import React from 'react'
import { FaExclamationCircle } from 'react-icons/all'
import { WarnMessageWrapper, Message } from './styles'

export const WarnMessage = ({ message, background, color }) => {
  return (
    <WarnMessageWrapper background={background}>
      <Message color={color}>
        <FaExclamationCircle /> {message}
      </Message>
    </WarnMessageWrapper>
  )
}
