import React from 'react'
import { SInput, InputWrapper, InputErrors } from './styles'

export const Input = ({
  type,
  name,
  placeholder,
  value = '',
  errors = [],
  label,
  disabled,
  onChange
}) => {
  return (
    <InputWrapper>
      {label && <label for={name}>{label}</label>}
      <SInput
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={onChange}
        error={!!errors.length > 0}
        valid={!!(errors.length === 0 && value.length > 0)}
      />
      {errors.length > 0 && (
        <InputErrors>
          {errors.map(e => (
            <div key={e.type}>{e.message}</div>
          ))}
        </InputErrors>
      )}
    </InputWrapper>
  )
}
