import {
  AUTH_LOADING,
  AUTH_ERROR,
  AUTH_LOGOUT,
  AUTH_LOGIN,
  AUTH_SET_MAC,
  AUTH_CAN_START_QUIZ,
  AUTH_QUIZ_WINDOW_IS_OPENED, AUTH_SET_COHORTS, AUTH_SET_ACTIVE_COHORT, AUTH_SET_USER, AUTH_SET_INSCRIPTIONS
} from '../../actions/types/authTypes'
import { DISPLAY_ADD_EXTERNAL, DISPLAY_REMOVE_EXTERNAL } from '../../actions/types/displayTypes'
import { REMOTE_SOFTWARE_DETECTED } from '../../actions/types/remotecontrolTypes'
export const initialState = {
  auth: {
    isAuth: false,
    user: null, // { nombres, identificacion, email, celular }
    loading: false,
    error: null,
    cohorts: [], // { name, startDate, endDate, cohort, urlQuiz }
    sessions: [],
    inscriptions: [],
    activeCohort: null,
    canStartQuiz: false, // countdown over, the user can start quiz
    isQuizOpened: false, // If quiz window is opnened -> true
    mac: null,
    externalDisplay: false,
    remoteSoftware: false
  }
}

export const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_SET_MAC:
      return { ...state, mac: action.payload }
    case AUTH_LOADING:
      return { ...state, loading: true, error: null }
    case AUTH_ERROR:
      return { ...state, loading: false, error: action.payload }
    case AUTH_LOGIN:
      return {
        ...state,
        isAuth: true,
        user: action.payload
      }
    case AUTH_SET_COHORTS:
      return {
        ...state,
        cohorts: action.payload,
        loading: false,
        error: null
      }
    case AUTH_SET_INSCRIPTIONS:
      return {
        ...state,
        inscriptions: action.payload,
        loading: false,
        error: null
      }
    case AUTH_SET_USER:
      return {
        ...state,
        loading: false,
        user: action.payload
      }
    case AUTH_SET_ACTIVE_COHORT:
      return {
        ...state,
        activeCohort: action.payload,
        loading: false,
        error: null
      }
    case AUTH_QUIZ_WINDOW_IS_OPENED:
      return {
        ...state,
        isQuizOpened: action.payload
      }
    case AUTH_CAN_START_QUIZ:
      return {
        ...state,
        canStartQuiz: true
      }
    case AUTH_LOGOUT:
      return initialState
    case DISPLAY_ADD_EXTERNAL:
      return { ...state, externalDisplay: true }
    case DISPLAY_REMOVE_EXTERNAL:
      return { ...state, externalDisplay: false }
    case REMOTE_SOFTWARE_DETECTED:
      return { ...state, remoteSoftware: true }
    default:
      return state
  }
}
