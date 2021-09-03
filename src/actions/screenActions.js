import { DISPLAY_ADD_EXTERNAL } from './types/displayTypes'
import { SHOW_WARN_WINDOW } from './types/electronTypes'
import { useElectronActions } from './electronActions'

export const useScreenActions = (dispatch) => {
  const { sendElectron, getElectronVar, onExternalDisplayReply } = useElectronActions(dispatch)
  const config = {
    title: 'PANTALLAS EXTERNAS ENCONTRADAS',
    message: 'Se encontraron pantallas externas conectadas a su equipo. Por favor desconéctelas para poder continuar con el examen.',
    time: 10000
  }
  const verifyExternalDisplay = async () => {
    const externalDisplay = await getElectronVar('externalDisplay')
    const screensDuplicated = await getElectronVar('screensDuplicated')
    const duplicatedDisplay = await getElectronVar('duplicatedDisplay')
    // const screensDisplay = await getElectronVar('screensDisplay')
    // const objScreen = await getElectronVar('objScreen')
    // const errosD = await getElectronVar('errosD')
    console.log('externalDisplay', externalDisplay)
    // console.log('Errors', errosD)
    console.log('Default', screensDuplicated)
    // console.log('duplicatedDisplay', screensDisplay)
    // console.log('objScreen', objScreen)

    if (externalDisplay || duplicatedDisplay) {
      dispatch({ type: DISPLAY_ADD_EXTERNAL })
      sendElectron({ type: SHOW_WARN_WINDOW, payload: { config } })
    }
    onExternalDisplayReply()
  }

  return { verifyExternalDisplay }
}
