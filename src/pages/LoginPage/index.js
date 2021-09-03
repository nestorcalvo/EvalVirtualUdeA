import React, { useEffect, useRef } from 'react'
import { Login } from '../../components/Login'
import { useHistory, useLocation } from 'react-router-dom'
import { useStore } from '../../store/storeContext'
import { useAuthActions } from '../../actions/authActions'
import { TOKEN } from '../../utils/constantes'
// import { DeveloperBar } from '../../components/DeveloperBar'
// import { NotifyExternalDisplay } from '../../components/NotifyExternalDisplay'

export const LoginPage = () => {
  const {
    state: {
      auth: { isAuth }
    },
    dispatch
  } = useStore()
  const { getSessionInfo } = useAuthActions(dispatch)
  const history = useHistory()
  const location = useLocation()
  const { from } = location.state || { from: { pathname: '/home' } }

  const checkSession = () => {
    const token = window.localStorage.getItem(TOKEN)
    console.log("Token", token)
    // If user isn't authenticated we verify login
    if (!isAuth && token) {
      console.log('sessionInfo desde LoginPage')
      getSessionInfo()
    }
  }
  const initialTrackingValues = useRef({
    redirectHome: () => history.replace(from)
    // callCheckSession: checkSession
  })
  // useEffect(() => {
  //   //const { callCheckSession } = initialTrackingValues.current
  //   //callCheckSession()
  // }, [])

  useEffect(() => {
    const { redirectHome } = initialTrackingValues.current
    // Is authenticated redirect to /home
    if (isAuth) {
      redirectHome()
    }
    // redirectHome()
  }, [isAuth])

  return (
    <Login />
  )
}
