import React from 'react'
import ReactDOM from 'react-dom'
import { CloseButton, ModalWrapper, ModalContainer } from './style'

export const Modal = ({ isOpen, onCloseModal, children }) => {
  if (!isOpen) {
    return null
  }

  return ReactDOM.createPortal(
    <ModalWrapper>
      <ModalContainer>
        <CloseButton onClick={onCloseModal}>
          x
        </CloseButton>
        {children}
      </ModalContainer>
    </ModalWrapper>,
    document.getElementById('modal')
  )
}
