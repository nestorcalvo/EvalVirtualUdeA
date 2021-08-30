import { useState } from 'react'

export const useValidatorsType = (initialState, validators = []) => {
  const [value, setValue] = useState(initialState)

  return { value }
}
