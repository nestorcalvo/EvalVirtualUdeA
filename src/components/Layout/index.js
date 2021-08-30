import React from 'react'
import './styles.css'
import { useStore } from '../../store/storeContext'
import { Header } from '../Header'
import { VERSION } from '../../utils/constantes'

export const Layout = ({ children }) => {
  const { state: { auth: { user } } } = useStore()
  return (
    <div id='MainContainer' className='MainLayout'>
      {user && <Header name={`${user.firstName} ${user.lastName}`} id={user.dni} />}
      {children}
      <div id='footer_version'>{VERSION} </div>
    </div>
  )
}
