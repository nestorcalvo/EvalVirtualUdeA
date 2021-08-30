import { LOGOUT } from '../../actions/types/electronTypes'
import { useElectronActions } from '../../actions/electronActions'

export const useConfirmWindowActions = (dispatch) => {
  const { sendElectron } = useElectronActions(dispatch)
  const onConfirm = (action) => {
    switch (action.type) {
      case 'LOGOUT_COHORT':
        sendElectron({ type: LOGOUT, payload: { cohortId: action.payload.cohortId } })
        break
      default:
        break
    }
  }

  return { onConfirm }
}
