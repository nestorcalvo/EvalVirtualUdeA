import {
  LOGOUT_REPLY,
  EXTERNAL_DISPLAY_REPLY,
  ELECTRON_REMOTE_SOFTWARE_ACTIVATED,
  ELECTRON_SEND_SOFTWARE_LIST,
  SHOW_WARN_WINDOW,
  SEND_SOFTWARE_LIST_TO_MW,
  BIOMETRIC_PICTURE_TAKED_REPLY,
  SHOW_BIOMETRIC_WINDOW_REPLY,
  CAN_START_QUIZ_REPLY,
  QUIZ_WINDOW_IS_OPENED_REPLY,
  ASK_STATE,
  ASK_STATE_REPLY,
  REQUEST_STATE_REPLY,
  CONFIRM_WINDOW_SET_STATE, REQUEST_STATE, NOTIFY_NO_ACTIVE_COHORT_REPLY, NOTIFY_NO_ACTIVE_COHORT,
} from './types/electronTypes'
import {
  AUTH_CAN_START_QUIZ,
  AUTH_QUIZ_WINDOW_IS_OPENED,
  AUTH_SET_USER, AUTH_SET_ACTIVE_COHORT, AUTH_LOGOUT
} from './types/authTypes'
import { DISPLAY_ADD_EXTERNAL, DISPLAY_REMOVE_EXTERNAL } from './types/displayTypes'
import { BIO_REGISTRATION_PHOTO_UPLOADED, BIO_LOGOUT } from './types/biometricTypes'
import { REMOTE_SOFTWARE_DETECTED, SEND_SOFTWARE_LIST } from './types/remotecontrolTypes'
import { CONFIRM_WINDOW_INIT_STATE } from './types/confirmWindowTypes'
import { useStore } from '../store/storeContext'
import httpClient, { getTokenAuth } from '../httpClient/httpClient'
import { useRedirect } from '../hooks/useRedirect'
import axios from 'axios'

export const useElectronActions = (dispatch) => {
  const {
    state: {
      auth
    }
  } = useStore()
  const { redirectHome, redirectLogin } = useRedirect()
  const { ipcRenderer, remote } = window.require('electron')
  const sendElectron = ({ type, payload }) => {
    ipcRenderer.send(type, payload)
  }

  /**
   * get global variable from electron
   * @param {*} varName
   */
  const getElectronVar = async (varName) => {
    return await remote.getGlobal(varName)
  }

  /**
   * Executed by mainWindow
   * Triggered by LOGOUT channel
   * Here we manage logout signal, both, from cohort and global
*/
  const onLogoutReply = async () => {
    ipcRenderer.on(LOGOUT_REPLY, async (event, state) => {
      // If cohortId exists it means we want to logout from specific cohort
      if (state?.cohortId) {
        cohortLogout(state.cohortId)
      } else {
        // Close session from application
        globalLogout()
      }
    })
  }

  /**
   * This method is called when a display is added or removed
   */
  const onExternalDisplayReply = () => {
    ipcRenderer.on(EXTERNAL_DISPLAY_REPLY, (event, state) => {
      // if state is true, a new display was added, is false, all external display was removed
      if (state) {
        dispatch({ type: DISPLAY_ADD_EXTERNAL })
        ipcRenderer.send(SHOW_WARN_WINDOW)
      } else {
        dispatch({ type: DISPLAY_REMOVE_EXTERNAL })
      }
    })
  }
  const onRemoteSoftwareReply = () => {
    ipcRenderer.on(ELECTRON_REMOTE_SOFTWARE_ACTIVATED, (event, state) => {
      // if state is true, a new display was added, is false, all external display was removed
      if (state) {
        dispatch({ type: REMOTE_SOFTWARE_DETECTED })
        ipcRenderer.send(SHOW_WARN_WINDOW)
      } else {
        dispatch({ type: REMOTE_SOFTWARE_DETECTED })
      }
    })
  }

  const onProcessesAqcuired = () => {
    ipcRenderer.on(ELECTRON_SEND_SOFTWARE_LIST, (event, state) => {
      // if state is true, a new display was added, is false, all external display was removed
      if (state) {
        dispatch({ type: SEND_SOFTWARE_LIST })
        ipcRenderer.send(SEND_SOFTWARE_LIST_TO_MW)
      } else {
        dispatch({ type: SEND_SOFTWARE_LIST })
      }
    })
  }

  /**
   * Update window state when biometric window is opnened
   */
  const onShowBiometricWindowReply = () => {
    ipcRenderer.on(SHOW_BIOMETRIC_WINDOW_REPLY, (event, state) => {
      window.localStorage.removeItem('isBiometricallyRegistered')
      window.localStorage.removeItem('dni')
      window.localStorage.removeItem('localPhotoRegistered')
      state ? updateSessionState(state) : sendElectron({ type: REQUEST_STATE })
    })
  }

  /**
 * This methos is called when a photo is taked from biometric window and here notify mainWindow
 */
  const onBiometricPictureTakedReply = () => {
    ipcRenderer.on(BIOMETRIC_PICTURE_TAKED_REPLY, (event, arg) => { dispatch({ type: BIO_REGISTRATION_PHOTO_UPLOADED }) })
  }
  /**
   * This methos is called when countdown is over and we need notify to biometric window the user can start quiz
   */
  const onCanStartQuizReply = () => {
    ipcRenderer.on(CAN_START_QUIZ_REPLY, (event, arg) => { dispatch({ type: AUTH_CAN_START_QUIZ }) })
  }

  const onQuizWindowOpnened = () => {
    ipcRenderer.on(QUIZ_WINDOW_IS_OPENED_REPLY, (event, arg) => {
      dispatch({ type: AUTH_QUIZ_WINDOW_IS_OPENED, payload: arg })
    })
  }
  /**
   * Subscription when secondary window ask for state to main window
   * @param state
   */
  const onAskState = () => {
    ipcRenderer.on(ASK_STATE, (event, arg) => {
      sendElectron({ type: ASK_STATE_REPLY, payload: auth })
    })
  }

  const onRequestStateReply = (state) => {
    ipcRenderer.on(REQUEST_STATE_REPLY, (event, state) => {
      updateSessionState(state)
    })
  }

  const updateSessionState = (state) => {
    if (state?.user) {
      dispatch({
        type: AUTH_SET_USER,
        payload: state.user
      })
    }
    if (state?.activeCohort) {
      dispatch({
        type: AUTH_SET_ACTIVE_COHORT,
        payload: state.activeCohort
      })
    }
  }
  /**
   * Executed by confirmWindow
   * Triggered by CONFIRM_WINDOW_SHOW channel after create window
   * @param state
   */
  const onConfirmWindowOpen = (state) => {
    ipcRenderer.on(CONFIRM_WINDOW_SET_STATE, (event, state) => {
      dispatch({ type: CONFIRM_WINDOW_INIT_STATE, payload: state })
    })
  }

  const onNoActiveCohort = () => {
    ipcRenderer.on(NOTIFY_NO_ACTIVE_COHORT_REPLY, (event, state) => {
      dispatch({ type: AUTH_SET_ACTIVE_COHORT, payload: null })
    })
  }
  const onConfirmWindowClosed = () => {
    ipcRenderer.on('CONFIRM_WINDOW_CLOSED_REPLY', (event, state) => {
      dispatch({ type: 'BIO_CONFIRMWINDOW_CLOSED' })
    })
  }
  const cohortLogout = async (cohortId) => {
    const sessionId = window.localStorage.getItem(cohortId)
    // const headerAuth = await getTokenAuth()
    // await httpClient.put(`inscriptions/${cohortId}/sessions/${sessionId}`)
    window.localStorage.removeItem(cohortId)
    redirectHome()
    dispatch({ type: AUTH_SET_ACTIVE_COHORT, payload: null })
    sendElectron({ type: NOTIFY_NO_ACTIVE_COHORT })
  }

  const globalLogout = async () => {
    // const headerAuth = await getTokenAuth()
    // await httpClient.put('inscriptions/sessions')
    window.localStorage.clear()
    dispatch({ type: AUTH_LOGOUT })
    dispatch({ type: BIO_LOGOUT })
    redirectLogin()
  }

  return { sendElectron, onNoActiveCohort, onConfirmWindowOpen, onQuizWindowOpnened, onAskState, onRequestStateReply, getElectronVar, onLogoutReply, onExternalDisplayReply, onShowBiometricWindowReply, onBiometricPictureTakedReply, onCanStartQuizReply, onConfirmWindowClosed, onRemoteSoftwareReply, onProcessesAqcuired }
}
