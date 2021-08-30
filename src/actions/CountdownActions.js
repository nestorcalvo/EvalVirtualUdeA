import { AUTH_CAN_START_QUIZ } from './types/authTypes'

export const useCountdownActions = (dispatch) => {
  const coundownOver = () => {
    dispatch({ type: AUTH_CAN_START_QUIZ })
  }

  return { coundownOver }
}
