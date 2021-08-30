import React from 'react'
import { LoadingZoneContent, LoadingZoneWrapper } from '../WebcamPicture/styles'
import { MiniLoader } from '../MiniLoader'

export const Loading = () => {
  return (
    <LoadingZoneWrapper><LoadingZoneContent><MiniLoader /></LoadingZoneContent></LoadingZoneWrapper>
  )
}
