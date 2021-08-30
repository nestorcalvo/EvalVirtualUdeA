import { useStore } from '../../store/storeContext'
import { useEffect, useRef } from 'react'
import { useElectronActions } from '../../actions/electronActions'
import { useBiometricActions } from '../../actions/BiometricActions'
import { MIN_CONFIDENCE, MODEL_URL, TRESHOLD } from './constants'
import { CONFIRM_WINDOW_SHOW, LOGOUT } from '../../actions/types/electronTypes'

export const useBiometricState = () => {
  const {
    state: { auth: { user, activeCohort }, biometrics: { isBiometricallyRegistered, userImage, confirmWindowLaunched } },
    dispatch
  } = useStore()
  const { onRequestStateReply, onNoActiveCohort, onShowBiometricWindowReply, onQuizWindowOpnened, sendElectron, onConfirmWindowClosed } = useElectronActions(dispatch)

  const {
    setImg,
    getFullFaceDescription,
    loadModels,
    getWebcamInfo,
    uploadRegistrationPhoto,
    uploadExamPhoto,
    clearError
  } = useBiometricActions({ MIN_CONFIDENCE, TRESHOLD, MODEL_URL }, dispatch)

  /*
    function that triggers webcam snapshot inside child WebCamPicture
    */
  const uploadPhoto = async (imageSrc) => {
    const localRegistered = await !!window.localStorage.getItem('isBiometricallyRegistered')
    const localDNI = await window.localStorage.getItem('dni')

    // if the user uploaded the registration photo, the next photos are from the exam
    if (isBiometricallyRegistered || localRegistered) {
      uploadExamPhoto(userImage, imageSrc, user?.dni ? user?.dni : localDNI)
    } else {
      await setImg(imageSrc)
      uploadRegistrationPhoto(imageSrc, user?.dni)
    }
  }

  // main function for veryfing face, only implement when everything is good and running
  /**
   const handleVerifyFace = async () => {
    verifyFace(userImage, userTestImage)
  }
   */
  /*
   *handler for child event which returns a string encoded image
   */
  const handleImage = async (picture) => {
    const image = new Image()
    image.src = picture
    image.onload = async () => {
      await getFullFaceDescription(image)
    }
  }

  const launchConfirmWindow = () => {
    dispatch({ type: 'LOGOUT' })
    sendElectron({
      type: LOGOUT
      /*,
      payload: {
        title: 'USTED ESTÁ A PUNTO DE CERRAR LA SESIÓN',
        message: 'Asegúrese de haber enviado el examen antes de cerrar la sesión, de lo contrario puede perder el avance. ¿Está seguro que desea cerrar la sesión?',
        confirmAction: { type: 'LOGOUT_COHORT', payload: { cohortId: activeCohort.id } }
      }*/
    })
  }
  const initialize = () => {
    onShowBiometricWindowReply()
    onRequestStateReply()
    getWebcamInfo()
    onQuizWindowOpnened()
    loadModels()
    onNoActiveCohort()
    onConfirmWindowClosed()
  }

  const initialTrackingValues = useRef({
    callInitialize: initialize
  })

  useEffect(() => {
    const { callInitialize } = initialTrackingValues.current
    callInitialize()
  }, [])

  return {
    handleImage,
    uploadPhoto,
    isBiometricallyRegistered,
    clearError,
    launchConfirmWindow,
    confirmWindowLaunched
  }
}
