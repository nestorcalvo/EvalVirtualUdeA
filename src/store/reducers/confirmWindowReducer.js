import { CONFIRM_WINDOW_INIT_STATE } from '../../actions/types/confirmWindowTypes'

export const initialState = {
  confirmWindow: {
    title: null,
    message: null,
    confirmAction: null,
    cancelAction: null
  }
}

export const confirmWindowReducer = (state, action) => {
  switch (action.type) {
    case CONFIRM_WINDOW_INIT_STATE:
      return {
        ...state,
        confirmAction: action.payload.confirmAction,
        title: action.payload.title,
        message: action.payload.message,
        cancelAction: action.payload.cancelAction
      }
    default:
      return state
  }
}
