import {
  checkMinLength,
  checkMaxLength,
  checkPattern,
} from '../../components/Forms/validators/validatorsCheks'
import { PATTERN_EMAIL } from '../../components/Forms/validators/patterns'

export const REQUIRED_MESSAGE = 'This field is requiered'
export const PATTERN_EMAIL_MESSAGE = 'Email not valid'
export const MAX_LENGTH_MESSAGE = 'Max size is'
export const MIN_LENGTH_MESSAGE = 'Min size is'

export const VALIDATORS_LOGIN_FORM = {
  email: [
    {
      type: 'required',
      message: REQUIRED_MESSAGE,
      check: checkMinLength,
      valueToCheck: 0,
    },
    {
      type: 'pattern',
      message: PATTERN_EMAIL_MESSAGE,
      check: checkPattern,
      valueToCheck: PATTERN_EMAIL,
    },
    {
      type: 'maxlength',
      message: MAX_LENGTH_MESSAGE,
      check: checkMaxLength,
      valueToCheck: 100,
    },
    {
      type: 'minlength',
      message: MIN_LENGTH_MESSAGE,
      check: checkMinLength,
      valueToCheck: 3,
    },
  ],
  repeatEmail: [
    {
      type: 'required',
      message: REQUIRED_MESSAGE,
      check: checkMinLength,
      valueToCheck: 0,
    },
    {
      type: 'maxlength',
      message: MAX_LENGTH_MESSAGE,
      check: checkMaxLength,
      valueToCheck: 50,
    },
    {
      type: 'minlength',
      message: MIN_LENGTH_MESSAGE,
      check: checkMinLength,
      valueToCheck: 3,
    },
  ],
}
