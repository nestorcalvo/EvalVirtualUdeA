import React from 'react'
import { InputCheck, InputWrapper, InputErrors, Label } from './styles'

export const Checkbox = ({
  name,
  value = false,
  errors = [],
  label,
  disabled,
  onChange,
  checked
}) => {
  return (
    <InputWrapper>
      <InputCheck
        id={name}
        type='checkbox'
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        defaultChecked={checked}
        error={!!errors.length > 0}
        valid={!!(errors.length === 0 && value.length > 0)}
      />
      {label && <Label htmlFor={name}>{label}</Label>}
      {errors.length > 0 && (
        <InputErrors>
          {errors.map((e) => (
            <div key={e.type}>{e.message}</div>
          ))}
        </InputErrors>
      )}
    </InputWrapper>
  )
}
