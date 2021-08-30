import React from 'react'
import Webcam from 'react-webcam'
import {
  Camera,
  CameraContainer,
  Logout,
  BarraDrag,
  LoadingZoneWrapper,
  LoadingZoneContent,
  ConfirmRepeatContainer,
  ConfirmButton,
  CameraActions,
  SnapshotPreview,
  Error,
  CameraButtonWrapper
} from './styles'
import { MiniLoader } from '../MiniLoader'
import { useWebCamState } from './state'
import { FaCamera } from 'react-icons/all'
import { CircularButton } from '../Buttons'

// user facing mode = front camera always

export const WebCamPicure = ({ rawImg: rawImgParam, upload, photoUploaded, clearError, handleSignOut, confirmWindowLaunched }) => {
  const {
    activeDevice,
    videoConstraints,
    snapshot,
    getSnapshot,
    repeatPhoto,
    webcam,
    error,
    loading,
    isBiometricallyRegistered,
    activeCohort
  } = useWebCamState({ upload, clearError, photoUploaded })
  const fillCameraButton = () => (
    <CameraButtonWrapper>
      {/*<CircularButton
        icon={() => <FaCamera />}
        onClick={() => getSnapshot(webcam.current.getScreenshot())}
      />*/}
    </CameraButtonWrapper>
  )
  const fillButtons = () => {
    if (!snapshot || error) {
      return fillCameraButton()
    } else {
      return (
        <ConfirmRepeatContainer>
          {/*<ConfirmButton onClick={() => upload(snapshot)}>CONFIRMAR Y SUBIR FOTO</ConfirmButton>*/}
          {/*<ConfirmButton repeat onClick={() => repeatPhoto()}>REPETIR FOTO</ConfirmButton>*/}
        </ConfirmRepeatContainer>)
    }
  }
  const fillCamera = () => (
    <CameraContainer>
      {!photoUploaded && !error && <SnapshotPreview src={snapshot} />}
      {activeDevice && (!snapshot || (snapshot && photoUploaded) || error) &&
      <Webcam
        className='biometric-camera'
        audio={false}
        height={videoConstraints.height}
        ref={webcam}
        screenshotFormat='image/jpeg'
        width={videoConstraints.width}
        videoConstraints={videoConstraints}
      />}

    </CameraContainer>
  )
  return (
    <Camera>
      <BarraDrag />
      {fillCamera()}
      <CameraActions>
        Si logra verse, puede cerrar esta ventana
        <Logout onClick={handleSignOut}>Cerrar ventana</Logout>
        {!isBiometricallyRegistered && !loading && activeDevice && fillButtons()}
        {isBiometricallyRegistered && activeCohort && !confirmWindowLaunched && <Logout onClick={handleSignOut}>CERRAR EXAMEN</Logout>}
        {!photoUploaded && error && <Error>{error}</Error>}
      </CameraActions>
      {(loading || !activeDevice) &&
      <LoadingZoneWrapper><LoadingZoneContent><MiniLoader/></LoadingZoneContent></LoadingZoneWrapper>}
    </Camera>
  )
}
