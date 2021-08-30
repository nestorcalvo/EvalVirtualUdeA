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
import { TOKEN } from '../utils/constantes'
import { useElectronActions } from './electronActions'
import { ASK_STATE_REPLY, NOTIFY_NO_ACTIVE_COHORT, SET_PERSON_ID, SHOW_BIOMETRIC_WINDOW } from './types/electronTypes'
import { useStore } from '../store/storeContext'
// import { getCurrentCity } from '../utils/location'

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
   * @param {*} loginInfo {username:string, password: string}
   */
  const login = async (loginInfo) => {
    dispatch({ type: AUTH_LOADING })
    const headerAuth = await getTokenAuth()
    try {
      const response = await httpClient.post('login', loginInfo, headerAuth)
      const token = await response.text().then(value => value)
      if (token) {
        await window.localStorage.setItem(TOKEN, token)
        dispatch({
          type: AUTH_LOGIN,
          payload: loginInfo.identification
        })
        // TODO
        getSessionInfo()
      }
    } catch (error) {
      sendLogoutState()
      console.log('ERROR AUTH: ', error)
      setError('No se pudo conectar con el servidor')
    }
    sendElectron({ type: SET_PERSON_ID, payload: loginInfo.identification })
  }
  const sendProcesses = async (Info, flags = false) => {
    if (Info.identification && auth) {
      Info.processes = await getElectronVar('processList')
      try {
        if (flags) {
          await httpClient.post('sus', Info, null)
        } else {
          await httpClient.post('watchProcesses', Info, null)
        }
      } catch (error) {
        console.log('ERROR AUTH: ', error)
        setError('Estimado usuario, si ya ingresó e inició el examen, no podrá ingresar de nuevo.')
      }
    } else {
      console.log('NO ID: ')
    }
  }

  const getUserState = async (identification) => {
    try {
      const users = await httpClient.get(`${identification}`)
      return users
    } catch (error) {
      console.log('ERROR AUTH: ', error)
      setError('No se tiro nada de la db.')
      return false
    }
  }

  const sendQuit = async (Info) => {
    try {
      await httpClient.post('exit', Info)
    } catch (error) {
      console.log('ERROR AUTH: ', error)
      setError('No se pudo conectar con el servidor')
    }
  }
  const registerExamStarted = async (Info) => {
    try {
      await httpClient.post('startexam', Info, null)
    } catch (error) {
      console.log('ERROR AUTH: ', error)
      setError('No se pudo conectar con el servidor')
    }
  }

  const registerPCInfo = async (Info) => {
    try {
      const pcinfo = await getElectronVar('pcInfo')
      const body = {
        identification: Info.identification,
        date: Info.date,
        specs: pcinfo
      }
      console.log(pcinfo)
      const response = await httpClient.post('gatherInfo', body, null)
    } catch (error) {
      console.log('ERROR AUTH: ', error)
      setError('No se pudo conectar con el servidor')
    }
  }

  const getSessionInfo = async () => {
    dispatch({ type: AUTH_LOADING })
    await getUserInfo()
    await getCohorts()
    loadDeviceInfo()
    onAskState()
    onLogoutReply()
    console.log('getSessionInfo auth', auth)
    sendElectron({ type: ASK_STATE_REPLY, payload: auth })
    getUserInscriptions()
  }

  const getUserInfo = async () => {
    try {
      const headerAuth = await getTokenAuth()
      const response = await httpClient.get('people/info', headerAuth).then(isOk)
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
    try {
      const headerAuth = await getTokenAuth()
      const cohorts = await httpClient.get('cohorts/people', headerAuth).then(response => response.json())
      dispatch({
        type: AUTH_SET_COHORTS,
        payload: cohorts
      })
    } catch (err) {
      setError(err.message)
    }
  }

  const isAlreadyLoguedInCohort = async (cohortId) => {
    const sessionId = window.localStorage.getItem(cohortId)
    return sessionId
  }

  const loginCohort = async (cohortId) => {
    const sessionId = await isAlreadyLoguedInCohort(cohortId)
    if (sessionId) {
      setActiveCohort(cohortId, sessionId)
      return
    }
    dispatch({ type: AUTH_LOADING })
    const headerAuth = await getTokenAuth()
    const { mac, localIp } = await loadDeviceInfo()
    const body = {
      mac: mac,
      privateIp: localIp,
      city: 'Medellín' // TODO
    }
    //       timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // loginInfo.ciudad = getCurrentCity()
    try {
      const response = await httpClient.post(`inscriptions/${cohortId}/sessions`, body, headerAuth)
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
    const headerAuth = await getTokenAuth()
    try {
      const inscriptions = await httpClient.get('inscriptions', headerAuth).then(response => response.json())
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
