import { useState } from 'react'

export const useInputValue = ({
  name: nameP = '',
  value: valueP = '',
  placeholder: placeholderP = '',
  validators: validatorsParam = [],
  errors: errorsP = [],
  type: typeP = 'text'
}) => {
  const [value, setValue] = useState(valueP)
  const [placeholder, setPlaceholder] = useState(placeholderP)
  const [name, setName] = useState(nameP)
  const [errors, setErrors] = useState(errorsP)
  const [validators, setValidators] = useState(validatorsParam)
  const [type, setType] = useState(typeP)

  const onChange = e => {
    setValue(e.target.value)
    validateInput(e.target.value)
  }

  /**
   *
   * @param {*} value
   * @return Array of errors
   */
  const validateInput = value => {
    const err = validators
      .filter(validator => !validator.check(value, validator.valueToCheck))
      .map(val => {
        return { type: val.type, message: val.message }
      })
    setErrors(err)
    return err
  }

  return {
    value,
    setValue,
    placeholder,
    setPlaceholder,
    name,
    setName,
    errors,
    setErrors,
    type,
    setType,
    validators,
    setValidators,
    onChange,
    validateInput
  }
}
