import React from 'react'
import { WebCamPicure } from '../../components/WebcamPicture'
import { BiometricContainer } from './styles'
import { useBiometricState } from './state'

export default function Biometrics () {
  const { handleImage, uploadPhoto, isBiometricallyRegistered, launchConfirmWindow, clearError, confirmWindowLaunched } = useBiometricState()

  return <>
    <BiometricContainer>
      <WebCamPicure
        rawImg={handleImage}
        upload={uploadPhoto}
        photoUploaded={isBiometricallyRegistered}
        clearError={clearError}
        handleSignOut={launchConfirmWindow}
        confirmWindowLaunched={confirmWindowLaunched}
      />
    </BiometricContainer>
  </>
}
