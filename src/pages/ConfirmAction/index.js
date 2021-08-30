import React, { useEffect, useRef } from 'react'
import { ConfirmContainer, Title, Message, Actions } from './style'
import { CancelButton, ConfirmButton } from '../../components/Buttons'
import { useElectronActions } from '../../actions/electronActions'
import { CONFIRM_WINDOW_CANCEL } from '../../actions/types/electronTypes'
import { useStore } from '../../store/storeContext'
import { FaExclamationTriangle } from 'react-icons/fa'
import { useConfirmWindowActions } from './actions'
import { Loading } from '../../components/Loading'

export const ConfirmActionPage = () => {
  const {
    state: {
      confirmWindow: { title, message, confirmAction }
    },
    dispatch
  } = useStore()
  const { sendElectron, onConfirmWindowOpen } = useElectronActions(dispatch)
  const { onConfirm } = useConfirmWindowActions(dispatch)

  const initialTrackingValues = useRef({
    callOnConfirmWindowOpen: onConfirmWindowOpen
  })
  useEffect(() => {
    const { callOnConfirmWindowOpen } = initialTrackingValues.current
    callOnConfirmWindowOpen()
  }, [])

  const closeWindow = () => {
    sendElectron({ type: CONFIRM_WINDOW_CANCEL })
  }
  const accept = () => {
    onConfirm(confirmAction)
  }

  const fillContent = () => (
    <ConfirmContainer>
      <Title>
        <FaExclamationTriangle />&nbsp;{title}
      </Title>
      <Message>{message}</Message>
      <Actions>
        <ConfirmButton text='confirmar' onClick={accept} />
        <CancelButton text='cancelar' onClick={closeWindow} />
      </Actions>
    </ConfirmContainer>
  )
  return <>
    {title && fillContent()}
    {!title && <Loading />}
  </>
}
