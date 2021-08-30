import httpClient from '../httpClient/httpClient'
import { DATA_POLICIES_LOADING, DATA_POLICIES_SET_DATA, DATA_POLICIES_SET_ERROR } from './types/dataPoliciesTypes'
import { useStore } from '../store/storeContext'

export const useDataPoliciesActions = () => {
  const {
    dispatch
  } = useStore()
  const isOk = (response) =>
    response.ok
      ? response.json()
      : Promise.reject(new Error('Failed to load data polices from server'))

  const getActiveDataPolicies = async () => {
    dispatch({ type: DATA_POLICIES_LOADING})
    try {
      const dataPolicies = await httpClient.get('data-policies', {}, {}).then(isOk)
      dispatch({ type: DATA_POLICIES_SET_DATA, payload: dataPolicies })
    } catch (err) {
      dispatch({ type: DATA_POLICIES_SET_ERROR, payload: err.message })
    }
  }
  return { getActiveDataPolicies }
}
