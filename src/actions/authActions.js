import httpClient, { getTokenAuth } from '../httpClient/httpClient'
import {
  AUTH_ERROR,
  AUTH_LOADING,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_SET_ACTIVE_COHORT,
  AUTH_SET_COHORTS,
  AUTH_SET_INSCRIPTIONS,
  AUTH_SET_MAC,
  AUTH_SET_USER
} from './types/authTypes'

import { TOKEN, BACK_URL } from '../utils/constantes'
import { useElectronActions } from './electronActions'
import { ASK_STATE_REPLY, NOTIFY_NO_ACTIVE_COHORT, SET_PERSON_ID, SHOW_BIOMETRIC_WINDOW, REQUEST_STATE, SEND_INFORMATION } from './types/electronTypes'
import { useStore } from '../store/storeContext'
import axios from 'axios'
import path from 'path'

export const useAuthActions = (dispatch) => {
  const { sendElectron, getElectronVar, onLogoutReply, onAskState } = useElectronActions(dispatch)
  const {
    state: {
      auth
    }
  } = useStore()

  /**
 * @param {*} param0
 */
  const sendLogoutState = async () => {
    dispatch({ type: AUTH_LOGOUT })
  }

  /**
   * @param {*} loginInfo {username:string, password: string, id_admission: number}
   */
  const login = async (loginInfo) => {
    dispatch({ type: AUTH_LOADING })
    // const headerAuth = await getTokenAuth()
    // console.log('Token', headerAuth)
    await axios.get(
      path.join(BACK_URL, `/checkCandidate?id_number=${loginInfo.identification}&password=${loginInfo.password}&id_admission=${loginInfo.id_admission}`),
      loginInfo
      // {
      //   headers:
      //   {
      //     // 'X-Requested-With': 'XMLHttpRequest',
      //     "Access-Control-Allow-Origin": "*",
      //     "Access-Control-Allow-Headers": "X-Requested-With",
      //     "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
      //     "Access-Control-Allow-Headers" :"append,delete,entries,foreach,get,has,keys,set,values,Authorization",
      //     'Content-Type': 'text/plain;charset=utf-8'
      //   }
      // }
    )
      .then((response) => {
        console.log(response)
        dispatch({
          type: AUTH_LOGIN,
          payload: response.data
        })
        console.log('Token usuario', response.data)
        getSessionInfo()
        registerPCInfo({ identification: response.data, date: new Date() })
        sendElectron({ type: SET_PERSON_ID, payload: response.data })
        return response.data
      })
      .catch((error) => {
        dispatch({ type: AUTH_ERROR, payload: error.message })
        sendLogoutState()
        setError('Usuario o contraseñas invalidos')
        return error
      })
  }
  const sendProcesses = async (Info, flags = false) => {
    console.log('Proceso a enviar')
    if (Info.identification) {
      if (flags) {
        sendElectron({ type: SEND_INFORMATION, payload: Info })
        // await axios.post(path.join(BACK_URL, '/sendWarnings'), Info).then((response) => {
        //   console.log('sendProcesses', response)
        // })
        //   .catch((error) => {
        //     console.log('ERROR AUTH: ', error)
        //     setError('Estimado usuario, si ya ingresó e inició el examen, no podrá ingresar de nuevo.')
        //   })
      }
    } else {
      console.log('NO ID: ')
    }
  }

  const getUserState = async (identification) => {
    if (identification) {
      const users = { identification: identification }
      return users
      // await axios.get(`https://a03c0032-5696-4b2b-83b6-3ae4dc91ff1f.mock.pstmn.io/watchdog/${identification}`).then(function (response) {
      //   console.log('Usuario solicitado', response)
      //   const users = response
      //   return users
      // })
      //   .catch((error) => {
      //     if (error.response) {
      //       console.log('Usuario inexistente')
      //       return false
      //     }
      //   })
    }
    // try {

    // } catch (error) {
    //   console.log('ERROR AUTH: ', error)
    //   setError('No se tiro nada de la db.')
    //   return false
    // }
  }

  const sendQuit = async (Info) => {
    // await axios.post('https://a03c0032-5696-4b2b-83b6-3ae4dc91ff1f.mock.pstmn.io/watchdog/exit', Info).then(function (response) {
    //   console.log('Cierre app', response)
    // })
    //   .catch((error) => {
    //     console.log('Error sendQuit', error)
    //   })
    // try {
    //   await httpClient.post('exit', Info)
    // } catch (error) {
    //   console.log('ERROR AUTH: ', error)
    //   setError('No se pudo conectar con el servidor')
    // }
  }
  const registerExamStarted = async (Info) => {
    const currentDate = new Date()
    const descriptionPost = 'Examen iniciado'
    const body = {
      identification: Info.identification,
      // date: Info.date,
      type_log: 1,
      remoteControl: false,
      externalDevices: false,
      externalScreen: false,
      description: 'Examen iniciado',
      information: ''
    }
    sendElectron({ type: SEND_INFORMATION, payload: body })
    // await axios.post(
    //   path.join(BACK_URL, '/sendWarnings'),
    //   body
    // )
    //   .then(function (response) {
    //     console.log('Inicio examen', response)
    //   })
    //   .catch((error) => {
    //     console.log('Error registerExamStarted', error)
    //     setError('No se pudo conectar con el servidor')
    //   })
  }

  const registerPCInfo = async (Info) => {
    const infoFile = await getElectronVar('fileInfo')
    console.log(infoFile)
    // Revisar que quiere en la descripcion aqui
    const body = {
      identification: Info.identification,
      type_log: 0,
      remoteControl: false,
      externalDevices: false,
      externalScreen: false,
      description: 'Registro informacion PC',
      information: infoFile
    }
    // sendElectron({ type: REQUEST_STATE, payload: body})
    sendElectron({ type: SEND_INFORMATION, payload: body })
    // await axios.post(
    //   path.join(BACK_URL, '/sendWarnings'),
    //   body,
    //   {
    //     headers: {
    //       'Content-Type': 'application/json;charset=UTF-8',
    //       'sec-fetch-mode': 'no-cors'
    //     }
    //   }
    // )
    //   .then(function (response) {
    //     console.log('Informacion enviada', response)
    //   })
    //   .catch((error) => {
    //     console.log('Error registerPCInfo', error)
    //     setError('No se pudo conectar con el servidor')
    //   })
    // const response = await httpClient.post('gatherInfo', body, null)
  }

  const getSessionInfo = async () => {
    dispatch({ type: AUTH_LOADING })
    // await getUserInfo()
    // await getCohorts()
    loadDeviceInfo()
    onAskState()
    // onLogoutReply()
    console.log('getSessionInfo auth')
    sendElectron({ type: ASK_STATE_REPLY, payload: auth })
    // getUserInscriptions()
  }

  const getUserInfo = async () => {
    // await axios.get(`https://a03c0032-5696-4b2b-83b6-3ae4dc91ff1f.mock.pstmn.io/watchdog/${identification}`).then(function (response) {
    //   console.log('Usuario solicitado', response)
    //   const users = response
    //   return users
    // })
    //   .catch((error) => {
    //     console.log('Error getUserState', error)
    //   })
    // console.log('getUserInfo')
    try {
      // const headerAuth = await getTokenAuth()
      const response = await httpClient.get('people/info').then(isOk)
      const user = response
      dispatch({
        type: AUTH_SET_USER,
        payload: user
      })
      if (user) {
        dispatch({
          type: AUTH_LOGIN
        })
      }
      sendElectron({ type: SHOW_BIOMETRIC_WINDOW, payload: { user } })
      sendElectron({ type: ASK_STATE_REPLY, state: { user } })
    } catch (err) {
      setError(err.message)
    }
  }
  const getCohorts = async () => {
    console.log("getCohorts")
    try {
      // const headerAuth = await getTokenAuth()
      const cohorts = await httpClient.get('cohorts/people').then(response => response.json())
      dispatch({
        type: AUTH_SET_COHORTS,
        payload: cohorts
      })
    } catch (err) {
      setError(err.message)
    }
  }

  const isAlreadyLoguedInCohort = async (cohortId) => {
    console.log("isAlreadyLoguedInCohort")
    const sessionId = window.localStorage.getItem(cohortId)
    return sessionId
  }

  const loginCohort = async (cohortId) => {
    console.log("loginCohort")
    const sessionId = await isAlreadyLoguedInCohort(cohortId)
    if (sessionId) {
      setActiveCohort(cohortId, sessionId)
      return
    }
    dispatch({ type: AUTH_LOADING })
    // const headerAuth = await getTokenAuth()
    const { mac, localIp } = await loadDeviceInfo()
    const body = {
      mac: mac,
      privateIp: localIp,
      city: 'Medellín' // TODO
    }
    //       timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // loginInfo.ciudad = getCurrentCity()
    try {
      const response = await httpClient.post(`inscriptions/${cohortId}/sessions`, body)
      if (response) {
        const sessionId = await response.text().then(value => value)
        setActiveCohort(cohortId, sessionId)
      }
    } catch (error) {
      console.log('ERROR loginCohort: ', error.message)
      setError('No se pudo iniciar sesión en la cohorte del examen')
    }
  }

  const setActiveCohort = async (cohortId, session) => {
    console.log('setActiveCohort')
    const cohort = auth.cohorts[auth.cohorts.findIndex(c => c.id === cohortId)]
    window.localStorage.setItem(cohortId, session)
    dispatch({ type: AUTH_SET_ACTIVE_COHORT, payload: cohort })
    sendElectron({ type: ASK_STATE_REPLY, payload: { activeCohort: cohort } })
  }

  const setNoActiveCohort = async () => {
    console.log('setNoActiveCohort')
    dispatch({ type: AUTH_SET_ACTIVE_COHORT, payload: null })
    sendElectron({ type: NOTIFY_NO_ACTIVE_COHORT })
  }

  const loadDeviceInfo = async () => {
    try {
      const serverHost = await getElectronVar('macInfo')
      const deviceInfo = await getElectronVar('deviceInfo')
      if (serverHost?.length) {
        setMac(serverHost[0].mac)
      }
      return { deviceInfo, mac: serverHost[0]?.mac, localIp: serverHost[0].address }
    } catch (error) {
      console.log('ERROR_loadMac', error)
    }
  }
  const getUserInscriptions = async () => {
    // const headerAuth = await getTokenAuth()
    console.log('getUserInscriptions')
    try {
      const inscriptions = await httpClient.get('inscriptions').then(response => response.json())
      console.log('inscriptions --> ', inscriptions)
      dispatch({ type: AUTH_SET_INSCRIPTIONS, payload: inscriptions })
    } catch (err) {
      setError(err.message)
    }
  }
  const setError = (error) => {
    dispatch({
      type: AUTH_ERROR,
      payload: error
    })
  }
  const setMac = async (mac) => {
    dispatch({ type: AUTH_SET_MAC, payload: mac })
  }

  const isOk = (response) =>
    response.ok
      ? response.json()
      : Promise.reject(new Error('Failed to load data from server'))

  return { login, loginCohort, setMac, getUserInscriptions, getSessionInfo, isAlreadyLoguedInCohort, setNoActiveCohort, registerExamStarted, registerPCInfo, sendProcesses, sendQuit, getUserState }
}
