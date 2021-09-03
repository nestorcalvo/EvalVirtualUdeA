import React from 'react'
import { MiniLoader } from '../MiniLoader'
import { useInputValue } from '../Forms/Input/useInputValue'
import { Input } from '../Forms/Input'
import { LoginError, FormWrapper, LoginButton, Title, LoadingMessage } from './styles'
import httpClient from '../../httpClient/httpClient'
import axios from 'axios'

export const LoginForm = ({ onSubmit, title, error, loading }) => {
  // const { isFormValid } = useForm()

  // const password = useInputValue({
  //   value: '',
  //   name: 'password',
  //   type: 'text',
  //   placeholder: 'Ingrese su contraseña'
  // })
  const identification = useInputValue({
    value: '',
    name: 'identificacion',
    type: 'number',
    placeholder: 'Ingrese número de identificación'
  })

  const verifyForm = async (e) => {
    console.log("Verify Form", e)
    e.preventDefault()
    onSubmit({
      identification: identification.value
    })
    // axios.get('https://a03c0032-5696-4b2b-83b6-3ae4dc91ff1f.mock.pstmn.io/watchdog/health').then(function (response) {
    //   console.log(response)
    // })
  }

  const fillError = () => {
    return <LoginError><span>{error}</span></LoginError>
  }
  const fillContent = () => {
    if (loading) {
      return <LoadingMessage><p>Ingresando</p><MiniLoader /></LoadingMessage>
    }
    // return <>
    return (
      <>
        <Title>{title}</Title>
        <form disabled={loading} onSubmit={verifyForm}>
          <Input disabled={loading} {...identification} />
          <LoginButton disabled={loading}>Iniciar sesión</LoginButton>
        </form>
      </>
    )
    {/* </> */}
  }

  return (
    <FormWrapper>{fillContent()}
      {error && fillError()}
    </FormWrapper>
  )
}
