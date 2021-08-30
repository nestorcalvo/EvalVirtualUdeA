import React, { createContext, useReducer, useContext } from 'react'
import { combineReducers } from './combineReducers'
import { authReducer, initialState as authInitialState } from './reducers/authReducer'
import { biometricReducer, initialState as biometricInitialState } from './reducers/biometricReducer'
import { confirmWindowReducer, initialState as confirmWindowReducerInitialState } from './reducers/confirmWindowReducer'
import { dataPoliciesReducer, initialState as dataPoliciesInitialState } from './reducers/dataPoliciesReducer'

export const StoreContext = createContext()

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    combineReducers({
      auth: authReducer,
      biometrics: biometricReducer,
      confirmWindow: confirmWindowReducer,
      dataPolicies: dataPoliciesReducer
    }),
    Object.assign(authInitialState, biometricInitialState, confirmWindowReducerInitialState, dataPoliciesInitialState)
  )
  const value = { state, dispatch }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
