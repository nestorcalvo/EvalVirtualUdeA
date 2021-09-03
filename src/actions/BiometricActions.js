import {
  BIO_TAKE_PHOTO,
  BIO_TAKE_TEST_IMAGE,
  BIO_TRIGGER_SUPPLANTER,
  BIO_REGISTRATION_PHOTO_UPLOADED,
  BIO_ERROR,
  BIO_LOADING,
  BIO_CLEAN_ERROR,
  BIO_TRIGGER_SUSPICIOUS_CAMERA
} from './types/biometricTypes'
import * as faceapi from 'face-api.js'
import { DataURIToBlob } from '../utils/base64ToBlob'
import httpClient from '../httpClient/httpClient'
// import { URL_BIOMETRICS } from '../utils/constantes'
import { useElectronActions } from './electronActions'
import { BIOMETRIC_PICTURE_TAKED } from './types/electronTypes'

export const useBiometricActions = ({ minConfidence, threshold, MODEL_URL = '/models' }, dispatch) => {
  let fullFaceDescriptions = null
  const { sendElectron } = useElectronActions()

  const loadModels = async () => {
    await faceapi.loadFaceDetectionModel(MODEL_URL)
    await faceapi.loadFaceLandmarkModel(MODEL_URL)
    await faceapi.loadFaceRecognitionModel(MODEL_URL)
  }

  const getFullFaceDescription = async (img) => {
    /*
        function that aqcuires face biometrics from HTMLImageElement and stores
        the image obtained when not registered. When registered, stores the test
        image used for continous face verification
        img: HTMLImageElement
        */
    fullFaceDescriptions = await faceapi.allFaces(img, minConfidence)

    // reemplazar con el isAuth, retorna algo raro de momento
    if (true) {
      await setImg(fullFaceDescriptions)
    } else {
      await setTestImg(fullFaceDescriptions)
    }
  }

  // main function for veryfing face, only implement when everything is good and running
  const verifyFace = async (userImage, userTestImage) => {
    const distance = faceapi.euclideanDistance(
      userImage[0].descriptor,
      userTestImage[0].descriptor
    )
    if (distance > threshold) {
      triggerSupplanter(true)
    }
  }
  const getWebcamInfo = () => {
    navigator.mediaDevices.enumerateDevices()
      .then(checkWebCam)
  }
  const checkWebCam = async (deviceInfos) => {
    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i]
      if ((deviceInfo.label.toLowerCase().includes('virtual') || deviceInfo.label.toLowerCase().includes('vir')) && deviceInfo.kind === 'videoinput') {
        dispatch({ type: BIO_TRIGGER_SUSPICIOUS_CAMERA, payload: true })
        //  dispatchElectron({ type: NOTIFY_WEBCAM_SUSPICIOUS, payload: deviceInfos })
      }
    }
  }

  const notifyPhotoUploaded = async () => {
    dispatch({ type: BIO_REGISTRATION_PHOTO_UPLOADED })
  }

  // const uploadRegistrationPhoto = async (imgBase64, id) => {
  //   dispatch({ type: BIO_LOADING })
  //   const file = await DataURIToBlob(imgBase64)
  //   const data = new FormData()
  //   data.append('images[]', file)
  //   const url = `${URL_BIOMETRICS}/autenticar?id=${id}`
  //   try {
  //     const response = await httpClient.postPure(url, data, {})
  //     if (response?.test_similarity > 0.8) {
  //       dispatch({ type: BIO_REGISTRATION_PHOTO_UPLOADED })
  //       sendElectron({ type: BIOMETRIC_PICTURE_TAKED, payload: response })
  //       window.localStorage.setItem('isBiometricallyRegistered', '1')
  //       window.localStorage.setItem('dni', id)
  //       window.localStorage.setItem('localPhotoRegistered', imgBase64)
  //     } else {
  //       dispatch({ type: BIO_REGISTRATION_PHOTO_UPLOADED })
  //       sendElectron({ type: BIOMETRIC_PICTURE_TAKED, payload: response })
  //       window.localStorage.setItem('isBiometricallyRegistered', '1')
  //       window.localStorage.setItem('dni', id)
  //       window.localStorage.setItem('localPhotoRegistered', imgBase64)
  //       /**
  //       sendElectron({ type: REQUEST_STATE })
  //       response.test_similarity < 0.8
  //         ? dispatch({ type: BIO_ERROR, payload: 'No pudimos reconocerte, intenta de nuevo' })
  //         : dispatch({ type: BIO_ERROR, payload: response.message ? response.message : 'Ocurrió un error al subir la foto' })
  //     */
  //        }
  //   } catch (error) {
  //     dispatch({ type: BIO_ERROR, payload: error.message ? error.message : 'Ocurrió un error al subir la foto' })
  //   }
  // }

  // const uploadExamPhoto = async (registrationImgBase64, imgBase64, id) => {
  //   const localPhotoRegistered = await window.localStorage.getItem('localPhotoRegistered')
  //   const file = await DataURIToBlob(imgBase64)
  //   const fileRegistration = await DataURIToBlob(registrationImgBase64 ? registrationImgBase64 : localPhotoRegistered)
  //   const data = new FormData()
  //   data.append('images[]', file)
  //   data.append('images[]', fileRegistration)

  //   const url = `${URL_BIOMETRICS}/verificar?id=${id}`
  //   try {
  //     await httpClient.postPure(url, data, {})
  //   } catch (error) {
  //     dispatch({ type: BIO_ERROR, payload: 'Ocurrió un error al subir la foto' })
  //   }
  // }

  const setImg = async (img) => {
    dispatch({ type: BIO_TAKE_PHOTO, payload: img })
  }
  const setTestImg = async (img) => {
    dispatch({ type: BIO_TAKE_TEST_IMAGE, payload: img })
  }
  const triggerSupplanter = async (bool) => {
    dispatch({ type: BIO_TRIGGER_SUPPLANTER, payload: bool })
  }
  const clearError = () => {
    dispatch({ type: BIO_CLEAN_ERROR })
  }
  return {
    setImg,
    setTestImg,
    triggerSupplanter,
    loadModels,
    getFullFaceDescription,
    verifyFace,
    getWebcamInfo,
    checkWebCam,
    // uploadRegistrationPhoto,
    // uploadExamPhoto,
    notifyPhotoUploaded,
    clearError
  }
}
