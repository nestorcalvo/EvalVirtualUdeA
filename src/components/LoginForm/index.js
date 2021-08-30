import React from 'react'
import { MiniLoader } from '../MiniLoader'
import { useInputValue } from '../Forms/Input/useInputValue'
import { Input } from '../Forms/Input'
import { LoginError, FormWrapper, LoginButton, Title, LoadingMessage } from './styles'

export const LoginForm = ({ onSubmit, title, error, loading }) => {
  // const { isFormValid } = useForm()

  const password = useInputValue({
    value: '',
    name: 'password',
    type: 'text',
    placeholder: 'Ingrese su contraseña'
  })
  const identification = useInputValue({
    value: '',
    name: 'identificacion',
    type: 'text',
    placeholder: 'Ingrese número de identificación'
  })

  const verifyForm = async (e) => {
    e.preventDefault()
    onSubmit({
      identification: identification.value
    })
  }

  const fillError = () => {
    return <LoginError><span>{error}</span></LoginError>
  }
  const fillContent = () => {
    if (loading) {
      return <LoadingMessage><p>Ingresando</p><MiniLoader /></LoadingMessage>
    }
    return <>
      <Title>{title}</Title>
      <form disabled={loading} onSubmit={verifyForm}>
        <Input disabled={loading} {...identification} />
        <LoginButton disabled={loading}>Iniciar sesión</LoginButton>
      </form>
    </>
  }

  return (
    <FormWrapper>{fillContent()}
      {error && fillError()}
    </FormWrapper>
  )
}
