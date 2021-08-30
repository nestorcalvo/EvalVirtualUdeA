import React, { useEffect, useState } from 'react'
import { HeaderWrapper, HeaderItem, LogoutButton, BackButton } from './styles'
import { FaPowerOff } from 'react-icons/all'
import { LOGOUT } from '../../actions/types/electronTypes'
import { useElectronActions } from '../../actions/electronActions'
import { useStore } from '../../store/storeContext'
import { useAuthActions } from '../../actions/authActions'
import { useHistory, useLocation } from 'react-router-dom'

export const Header = ({ name, id }) => {
  const { dispatch } = useStore()
  const { sendElectron } = useElectronActions(dispatch)
  const { setNoActiveCohort } = useAuthActions(dispatch)
  const location = useLocation()
  const history = useHistory()
  const [isHome, setIsHome] = useState()

  useEffect(() => {
    console.log(location.pathname)
    setIsHome(location.pathname === '/home')
  }, [location])

  const handleGoBack = () => {
    const isCohortPage = location.pathname.indexOf('/cohort/')
    console.log('isCohortPage', isCohortPage)
    if (isCohortPage === 0) {
      setNoActiveCohort()
    }
    history.goBack()
  }
  const fillLogoutButton = () => (
    <>
      <FaPowerOff />&nbsp;
      Cerrar sesión
    </>
  )
  const launchConfirmWindow = () => {
    window.localStorage.clear()
    sendElectron({ type: LOGOUT })
  }
  return (
    <HeaderWrapper>
      {!isHome && <BackButton onClick={handleGoBack} />}
      <HeaderItem>Bienvenido {name}</HeaderItem>
      <HeaderItem>| </HeaderItem>
      <HeaderItem>Identificación: {id}</HeaderItem>
      <HeaderItem>| </HeaderItem>
      <LogoutButton onClick={launchConfirmWindow}>{fillLogoutButton()}</LogoutButton>
    </HeaderWrapper>)
}
