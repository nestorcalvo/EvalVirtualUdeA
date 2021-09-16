import React, { useEffect, useState } from 'react'
import { useStore } from '../../store/storeContext'
// import { DeveloperBar } from '../../components/DeveloperBar'
import { WarnContainer, Title, Message } from './styles'
import { useElectronActions } from '../../actions/electronActions'
import { CLOSE_APP } from '../../actions/types/electronTypes'
import { useAuthActions } from '../../actions/authActions'
import axios from 'axios'

export const WarnPage = () => {
  const { sendProcesses, getUserState } = useAuthActions()
  const { sendElectron, getElectronVar } = useElectronActions()
  // Tiempo para cerrar app
  const [countdown, setCountdown] = useState(15)
  const [intervalCountdown, setInvervalCountdown] = useState()
  const [title, setTitle] = useState()
  const [isWebcamSuspicious, setWebcamSuspicious] = useState(false)
  const [sendData, setSendData] = useState(false)
  const [isExternalDisplay, setExternalDisplay] = useState(false)
  const [remoteSoftwareFound, setRemoteSoftwareFound] = useState(false)
  const [remoteSoftware, setRemoteSoftware] = useState(false)
  const [wrongCohortNumber, setwrongCohortNumber] = useState(false)
  let usrstate = null
  let firstTimePosting = true
  useEffect(() => {
    async function fetchData () {
      const externalDisplay = await getElectronVar('externalDisplay')
      const webcamSuspicious = await getElectronVar('webcamSuspicious')
      const remoteSoftware = await getElectronVar('remoteSoftware')
      const remoteSoftwareFound = await getElectronVar('remoteSoftwareFound')
      const wrongCohortNumber = await getElectronVar('wrongCohortNumber')
      let flagWarn = false
      const id = await getElectronVar('personId')
      setWebcamSuspicious(webcamSuspicious)
      setExternalDisplay(externalDisplay)
      setRemoteSoftware(remoteSoftware)
      setRemoteSoftwareFound(remoteSoftwareFound)
      setwrongCohortNumber(wrongCohortNumber)
      if (webcamSuspicious || remoteSoftwareFound || externalDisplay || wrongCohortNumber) {
        console.log('Envio de warning')
        flagWarn = true
        // return { flagWarn, id, webcamSuspicious, externalDisplay, remoteSoftware, remoteSoftwareFound }
      }
      return { flagWarn, id, webcamSuspicious, externalDisplay, remoteSoftware, remoteSoftwareFound }
    }

    fetchData().then((response) => {

      if (response.flagWarn && firstTimePosting && (isWebcamSuspicious || isExternalDisplay || remoteSoftwareFound)) {
        firstTimePosting = false
        let descriptionPost = 'El usuario tiene: '
        if (response.remoteSoftware) {
          descriptionPost += `[Softwares no permitidos: ${response.remoteSoftware}]`
        }
        if (response.webcamSuspicious) {
          descriptionPost += '[Camara sospechosa]'
        }
        if (response.externalDisplay) {
          descriptionPost += '[Pantalla externa]'
        }
        sendProcesses({
          identification: response.id,
          // date: date,
          type_log: 1,
          remoteControl: response.remoteSoftwareFound,
          externalDevices: response.webcamSuspicious,
          externalScreen: response.externalDisplay,
          description: descriptionPost,
          information: ''
        }, true).then(() => {
          initCount()
        })
      } else if (response.flagWarn && firstTimePosting && wrongCohortNumber) {
        initCount()
      }
    })
  }, [isWebcamSuspicious, isExternalDisplay, remoteSoftwareFound, wrongCohortNumber])
  useEffect(() => {
    console.log('Entré')
    if (isCoutdownOver()) {
      clearInterval(intervalCountdown)
      closeApp()
    }
  }, [countdown])
  const isCoutdownOver = () => {
    if (countdown === 0) {
      return true
    } else {
      return false
    }
  }

  const closeApp = async () => {
    // axios.get('https://a03c0032-5696-4b2b-83b6-3ae4dc91ff1f.mock.pstmn.io/watchdog/health')
    sendElectron({ type: CLOSE_APP })
  }
  const initCount = () => {
    setInterval(() => {
      if (countdown > 0) {
        setCountdown(prev => prev - 1)
      } else {
        sendElectron({ type: CLOSE_APP })
      }
    }, 1000)
  }

  return (
    <>
      <WarnContainer>
        <Title>
          {title}
        </Title>
        <Message>
          {isExternalDisplay && `Se ha detectado una o más pantallas externas conectadas a su equipo. Este incidente será reportado. Por favor desconectelas y vuelva a ingresar. Se cerrará la aplicación. Asegurese de tener todo en regla para evitar futuros inconvenientes.El aplicativo se cerrará en ${countdown}`}
          {isWebcamSuspicious && `Se ha detectado un software sospechoso que puede alterar su cámara web. Este incidente será reportado. Por favor cierre toda aplicación que pueda estar causando este mensaje, por ejemplo, aplicaciones que cambien el fondo de la grabación. Se cerrará la aplicación. Asegurese de tener todo en regla para evitar futuros inconvenientes.El aplicativo se cerrará en ${countdown}`}
          {remoteSoftware && `Se han detectado uno o mas sofwares no permitidos para el examen. Este incidente será reportado. Por favor cierre: \r\n ${remoteSoftware}.\r\n Se cerrará la aplicación. Asegurese de tener todo en regla para evitar futuros inconvenientes.El aplicativo se cerrará en ${countdown}`}
          {wrongCohortNumber && `Este aplicativo no es para esta admision, porfavor descargue el aplicativo correspondiente. El aplicativo se cerrará en ${countdown}`}
        </Message>
      </WarnContainer>
    </>
  )
}
