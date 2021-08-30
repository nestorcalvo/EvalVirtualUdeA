import {
  DATA_POLICIES_LOADING,
  DATA_POLICIES_SET_DATA,
  DATA_POLICIES_SET_ERROR
} from '../../actions/types/dataPoliciesTypes'

export const initialState = {
  dataPolicies: {
    loading: false,
    data: [],
    error: null
  }
}

export const dataPoliciesReducer = (state, action) => {
  switch (action.type) {
    case DATA_POLICIES_LOADING:
      return {
        ...state,
        loading: true
      }
    case DATA_POLICIES_SET_DATA:
      return {
        ...state,
        loading: false,
        data: action.payload
      }
    case DATA_POLICIES_SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    default:
      return state
  }
}
