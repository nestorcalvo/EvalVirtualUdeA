import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useElectronActions } from '../../actions/electronActions'
import { END_INTERVAL_PHOTO, INIT_INTERVAL_PHOTO } from '../../utils/constantes'
import { useStore } from '../../store/storeContext'

export const useWebCamState = ({ upload, clearError, photoUploaded }) => {
  const {
    state: { auth: { canStartQuiz, isQuizOpened, activeCohort }, biometrics: { error, loading, isBiometricallyRegistered } },
    dispatch
  } = useStore()
  // const [rawImg, setRawImg] = useState(rawImgParam)
  const [snapshot, setSnapshot] = useState()
  const [devices, setDevices] = useState([])
  const [activeDevice, setActiveDevice] = useState(null)
  const [videoConstraints, setVideoConstraints] = useState({
    width: 700,
    height: 400,
    facingMode: 'user'
  })

  // Save devices videoinput in devices state
  const handleDevices = useCallback(
    mediaDevices =>
      setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput')),
    [setDevices]
  )
  // find devices
  useEffect(
    () => {
      navigator.mediaDevices.enumerateDevices().then(handleDevices)
    },
    [handleDevices]
  )

  const updateDeviceId = useCallback((deviceId) => {
    if (videoConstraints.deviceId === deviceId) {
      return
    }
    setVideoConstraints({ ...videoConstraints, deviceId: deviceId })
  }, [setVideoConstraints, videoConstraints])

  // Select a valid camera device
  useMemo(() => {
    devices.forEach(device => {
      const isVirtualCamera = device.label.toLowerCase().includes('virtual') || device.label.toLowerCase().includes('vir')
      if (!isVirtualCamera) {
        updateDeviceId(device.deviceId)
        setActiveDevice(device)
      }
    })
  }, [devices, updateDeviceId])

  const { onCanStartQuizReply } = useElectronActions(dispatch)
  const webcam = useRef()
  // { deviceId: device.deviceId }

  const initialTrackingValues = useRef({
    callOnCanStartQuizReply: onCanStartQuizReply,
    callUpload: upload
  })

  useEffect(() => {
    const { callOnCanStartQuizReply } = initialTrackingValues.current
    callOnCanStartQuizReply()
  }, [])

  /**
   *  ============ On progress
   const checkCameraWorking = () => {
    navigator.mediaDevices.getUserMedia( { audio: true, video: true } )
    .then( ( stream ) => {
     console.log('stream', stream)
    },
    e => {
         // microphone not available
         console.log('error', e)
    } );
  }
   */

  useEffect(() => {
    // If countdown is over (canStartQuiz) and user opened the quiz window, and he uploaded the photo previusly -> take pictures every random minutes
    if (canStartQuiz && isQuizOpened && photoUploaded) {
      const milliseconds = getRandomArbitrary(INIT_INTERVAL_PHOTO, END_INTERVAL_PHOTO)
      const interval = setInterval(() => {
        const { callUpload } = initialTrackingValues.current
        callUpload(webcam.current.getScreenshot())
      }, milliseconds)
      return () => clearInterval(interval)
    }
  }, [canStartQuiz, isQuizOpened, photoUploaded])

  const getRandomArbitrary = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
  }

  const getSnapshot = (imageSrc) => {
    clearError()
    setSnapshot(imageSrc)
  }

  const repeatPhoto = () => {
    clearError()
    setSnapshot(null)
  }

  return {
    error,
    loading,
    isBiometricallyRegistered,
    activeDevice,
    videoConstraints,
    snapshot,
    setSnapshot,
    getSnapshot,
    repeatPhoto,
    webcam,
    activeCohort
  }
}
