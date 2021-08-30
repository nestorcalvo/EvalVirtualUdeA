
import { COOKIE_MAC, COOKIE_TOKEN, TOKEN } from '../../utils/constantes'
import { useElectronActions } from '../../actions/electronActions'
import { SHOW_QUIZ_WINDOW, SHOW_BIOMETRIC_WINDOW } from '../../actions/types/electronTypes'
import { useEffect, useRef } from 'react'
import { useStore } from '../../store/storeContext'
import { useRedirect } from '../../hooks/useRedirect'
import { AUTH_LOADING } from '../../actions/types/authTypes'

export const useHomeState = () => {
  const { state: { auth: { isAuth } }, dispatch } = useStore()
  const { sendElectron } = useElectronActions()
  const { onBiometricPictureTakedReply } = useElectronActions(dispatch)
  const { redirectLogin } = useRedirect()
  const openQuiz = async (urlQuiz, expirationDate, mac) => {
    // Establece un cookie con los datos de la misma.
    // puede sobrescriba cookies iguales si existen.
    const token = await window.localStorage.getItem(TOKEN)
    // we get unix date
    var expiration = new Date(expirationDate).getTime() / 1000

    const cookieToken =
       {
         url: urlQuiz,
         name: COOKIE_TOKEN,
         value: token,
         expirationDate: expiration,
         path: '/'
       }
    const cookieMac = {
      url: urlQuiz,
      name: COOKIE_MAC,
      value: mac,
      expirationDate: expiration,
      path: '/'
    }
    const cookies = [cookieToken, cookieMac]
    const config = { urlQuiz, cookies }
    sendElectron({ type: SHOW_QUIZ_WINDOW, payload: config })
  }

  const openBiometrics = async () => {
    sendElectron({ type: SHOW_BIOMETRIC_WINDOW })
  }

  const toLogin = () => {
    dispatch({ type: AUTH_LOADING })
    redirectLogin()
  }
  const initialTrackingValues = useRef({
    callOnBiometricPictureTakedReply: onBiometricPictureTakedReply,
    callToLogin: toLogin
  })

  useEffect(() => {
    const { callToLogin } = initialTrackingValues.current
    const token = window.localStorage.getItem(TOKEN)
    // If exists a token in localStorage we try to login, but first, we redirect to login page
    if (!isAuth && token) {
      callToLogin()
    }
  }, [isAuth])

  useEffect(() => {
    // watchLoginReply()
    // TODO
    const { callOnBiometricPictureTakedReply } = initialTrackingValues.current
    callOnBiometricPictureTakedReply()
  }, [])

  return {
    openQuiz,
    openBiometrics
  }
}
