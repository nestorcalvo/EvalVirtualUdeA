import {
  BIO_TAKE_PHOTO,
  BIO_TAKE_TEST_IMAGE,
  BIO_TRIGGER_SUPPLANTER,
  BIO_REGISTRATION_PHOTO_UPLOADED,
  BIO_ERROR,
  BIO_LOADING,
  BIO_CLEAN_ERROR,
  BIO_TRIGGER_SUSPICIOUS_CAMERA,
  BIO_LOGOUT
} from '../../actions/types/biometricTypes'
export const initialState = {
  biometrics: {
    error: null,
    loading: false,
    userImage: null,
    userTestImage: null,
    supplanter: false,
    webcam: null,
    isBiometricallyRegistered: false,
    isWebcamOk: true,
    confirmWindowLaunched: false
  }
}

export const biometricReducer = (state, action) => {
  // console.log('biometricState', { state, action })
  switch (action.type) {
    case BIO_TAKE_PHOTO:
      return { ...state, userImage: action.payload, error: null, loading: false }
    case BIO_TAKE_TEST_IMAGE:
      return { ...state, userTestImage: action.payload, error: null, loading: false }
    case BIO_TRIGGER_SUPPLANTER:
      return { ...state, supplanter: action.payload, error: null, loading: false }
    case BIO_REGISTRATION_PHOTO_UPLOADED:
      return { ...state, isBiometricallyRegistered: true, error: null, loading: false }
    case BIO_LOADING:
      return { ...state, loading: true }
    case BIO_ERROR:
      return { ...state, error: action.payload, loading: false }
    case BIO_TRIGGER_SUSPICIOUS_CAMERA:
      return { ...state, isWebcamOk: action.payload }
    case BIO_CLEAN_ERROR:
      return { ...state, error: null, loading: false }
    case BIO_LOGOUT:
      return initialState
    case 'BIO_CONFIRMWINDOW_LAUNCHED':
      return { ...state, confirmWindowLaunched: true }
    case 'BIO_CONFIRMWINDOW_CLOSED':
      return { ...state, confirmWindowLaunched: false }
    default:
      return state
  }
}
