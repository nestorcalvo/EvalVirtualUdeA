import React, { useEffect, useState } from 'react'
import { useStore } from '../../store/storeContext'
// import { DeveloperBar } from '../../components/DeveloperBar'
import { WarnContainer, Title, Message } from './styles'
import { useElectronActions } from '../../actions/electronActions'
import { CLOSE_APP } from '../../actions/types/electronTypes'
import { useAuthActions } from '../../actions/authActions'
export const WarnPage = () => {
  const { sendProcesses, getUserState } = useAuthActions()
  const { sendElectron, getElectronVar } = useElectronActions()
  // Tiempo para cerrar app
  const [countdown, setCountdown] = useState(5)
  const [intervalCountdown, setInvervalCountdown] = useState()
  const [title, setTitle] = useState()
  const [isWebcamSuspicious, setWebcamSuspicious] = useState(false)
  const [isExternalDisplay, setExternalDisplay] = useState(false)
  const [isRemoteSoftware, setRemoteSoftware] = useState(false)
  let usrstate = null
  useEffect(async () => {
    const externalDisplay = await getElectronVar('externalDisplay')
    const webcamSuspicious = await getElectronVar('webcamSuspicious')
    const remoteSoftware = await getElectronVar('remoteSoftware')
    //const id = await getElectronVar('personId')
    //usrstate = await getUserState(id)
    //await sendProcesses({ identification: id, processes: remoteSoftware, webcamsus: webcamSuspicious, externaldisplay: externalDisplay }, true)
    setRemoteSoftware(remoteSoftware)
    if (webcamSuspicious) {
      setTitle('SE HA ENCONTRADO ALGO MAL CON TU CÁMARA')
    } else if (remoteSoftware) {
      setTitle('SOFTWARE REMOTO DETECTADO')
    } else if (externalDisplay) {
      setTitle('PANTALLAS EXTERNAS DETECTADAS')
    } else {
      setTitle('OK')
    }
    setInvervalCountdown(
      setInterval(() => {
        setCountdown(prevCount => prevCount - 1)
      }, 1000))
    return () => clearInterval(intervalCountdown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (isCoutdownOver()) {
      closeApp()
      clearInterval(intervalCountdown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown])

  const isCoutdownOver = () => {
    if (countdown === 0) {
      return true
    } else {
      return false
    }
  }

  const closeApp = async () => {
    sendElectron({ type: CLOSE_APP })
  }

  return (
    <>
      <WarnContainer>
        <Title>
          {title}
        </Title>
        <Message>
          {isExternalDisplay && `Se ha detectado una o más pantallas externas conectadas a su equipo. Este incidente será reportado. Por favor desconectelas y vuelva a ingresar. La aplicación se cerrará en ${countdown} segundos.`}
          {isWebcamSuspicious && `Se ha detectado un software sospechoso que puede alterar su cámara web. Este incidente será reportado. Por favor cierre toda aplicación que pueda estar causando este mensaje, por ejemplo, aplicaciones que cambien el fondo de la grabación. La aplicación se cerrará en ${countdown} segundos.`}
          {isRemoteSoftware && `Se han detectado uno o mas sofwares no permitidos para el examen. Este incidente será reportado. Por favor cierre ${isRemoteSoftware}. Se cerrará la aplicación en ${countdown} segundos.`}
        </Message>
      </WarnContainer>
    </>
  )
}
