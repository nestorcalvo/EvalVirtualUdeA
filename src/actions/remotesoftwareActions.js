import { REMOTE_SOFTWARE_DETECTED } from './types/remotecontrolTypes'
import { SHOW_WARN_WINDOW } from './types/electronTypes'
import { useElectronActions } from './electronActions'

export const useRemoteSoftwareActions = (dispatch) => {
  const { sendElectron, getElectronVar, onRemoteSoftwareReply } = useElectronActions(dispatch)
  const config = {
    title: 'SOFTWARE DE ACCESO REMOTO ENCONTRADO',
    message: 'Se ha encontrado software de acceso remoto, este incidente será reportado.',
    time: 10000
  }
  const verifyRemoteAccessSoftware = async () => {
    const remoteSoftware = await getElectronVar('remoteSoftware')
    console.log('remoteSoftware', remoteSoftware)

    if (remoteSoftware) {
      dispatch({ type: REMOTE_SOFTWARE_DETECTED })
      sendElectron({ type: SHOW_WARN_WINDOW, payload: { config } })
    }
    onRemoteSoftwareReply()
  }

  return { verifyRemoteAccessSoftware }
}
