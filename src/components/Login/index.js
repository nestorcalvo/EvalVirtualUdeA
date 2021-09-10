import React, { useState } from 'react'
import { LoginForm } from '../LoginForm'
import { useStore } from '../../store/storeContext'
import { useAuthActions } from '../../actions/authActions'
import { TermsModal } from '../TermsModal'
import { RememberDataPoliciesContent, RememberDataPoliciesWrapper } from './styles'
import { SET_PERSON_ID } from '../../actions/types/electronTypes'
import { useElectronActions } from '../../actions/electronActions'
import { setIntervalAsync } from 'set-interval-async/dynamic'
const ipcRenderer = window.require('electron').ipcRenderer

export const Login = () => {
  let identification_ = null
  let password_ = null
  const {
    state: { auth: { loading, error} },
    dispatch
  } = useStore()

  const { login, sendProcesses, sendQuit } = useAuthActions(dispatch)
  const [isTermsOpened, setIsTermsOpened] = useState(false)
  const { sendElectron } = useElectronActions(dispatch)
  const handleSubmit = (dataForm) => {
    const identification = dataForm.identification
    const date = new Date()
    const password = dataForm.password

    sendElectron({ type: SET_PERSON_ID, response: identification })

    login({
      // Se debe enviar el usuario y la contraseña
      identification: identification,
      password: password,
      date: date
    })
  }
  const sendActiveProcesses = async () => {
    await sendProcesses({ identification: identification_, date: new Date() })
  }
  const switchModal = () => {
    setIsTermsOpened(!isTermsOpened)
  }
  const fillRememberDataPolicies = () => (
    <RememberDataPoliciesWrapper onClick={switchModal}>
      <RememberDataPoliciesContent>
        <b><u> Ingresar información incorrecta en este campo será causal de anulación del examen</u></b>
        <br />
        <br />
        <br />
        Recuerde que al iniciar sesión usted ha aceptado previamiente los <u>términos y condiciones</u>
      </RememberDataPoliciesContent>
    </RememberDataPoliciesWrapper>
  )
  const fillContent = () => (
    <>
      <LoginForm
        onSubmit={handleSubmit}
        title='Login'
        loading={loading}
        error={error}
      />
      {fillRememberDataPolicies()}
      {/* <TermsModal isOpen={isTermsOpened} switchModal={switchModal} /> */}
    </>
  )

  return fillContent()
}
