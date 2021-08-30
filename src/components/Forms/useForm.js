export const useForm = () => {
  const isFormValid = inputs => {
    let isValid = true
    for (const input of inputs) {
      if (input.validateInput(input.value).length > 0) isValid = false
    }
    return isValid
  }

  return { isFormValid }
}
