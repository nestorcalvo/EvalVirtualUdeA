import React, { useEffect, useRef } from 'react'
import { Modal } from '../Modal'
import { Button } from '../Buttons/styles'
import { useDataPoliciesActions } from '../../actions/dataPoliciesActions'
import { ActionWrapper, DataPoliciesContainer, DataPolicy, Title } from './styles'
import { Loading } from '../Loading'
import { WarnMessage } from '../WarnMessage'
import { useStore } from '../../store/storeContext'

export const TermsModal = ({ isOpen, switchModal }) => {
  const { state: { dataPolicies: { data, error, loading } } } = useStore()
  const { getActiveDataPolicies } = useDataPoliciesActions()

  const initialTrackingValues = useRef({
    callGetActiveDataPolicies: getActiveDataPolicies
  })
  useEffect(() => {
    if (data.length === 0) {
      const { callGetActiveDataPolicies } = initialTrackingValues.current
      callGetActiveDataPolicies()
    }
  }, [data])

  const DataPolicyItem = (policy) => (
    <DataPolicy>
      {policy.data.content}
    </DataPolicy>
  )
  const fillContent = () => (
    <DataPoliciesContainer>
      <Title>POLÍTICA DE DATOS</Title>
      {data.map(policy => <DataPolicyItem key={policy.id} data={policy} /> )}
      <ActionWrapper>
        <Button onClick={switchModal}>
          ENTIENDO
        </Button>
      </ActionWrapper>
    </DataPoliciesContainer>
  )

  return (
    <Modal isOpen={isOpen} onCloseModal={switchModal}>
      {!loading && !error && fillContent()}
      {loading && <Loading />}
      {error && <WarnMessage message={error} />}
    </Modal>
  )
}
