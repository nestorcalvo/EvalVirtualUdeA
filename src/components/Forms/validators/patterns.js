export const PATTERN_EMAIL = new RegExp(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,3}$/
)
export const PATTERN_ALPHANUMERIC_SIGNS = new RegExp(
  /^[(\r\n|\r|\n)-?¿!¡():,%´°ºª&*.`~"<>{}^_'+#@\[\]\s a-zA-Z0-9\u00C0-\u00FF\s]+$/
)
export const PATTERN_ALPHANUMERIC = new RegExp(
  /^[-. a-zA-Z0-9\u00C0-\u00FF\s]+$/
)
export const PATTERN_SEMESTER = new RegExp(/^[0-9]+-[1-2]{1}$/)
export const PATTERN_NUMERIC = new RegExp(/^([0-9]){1,}$/)
export const PATTERN_RANGE = new RegExp(/^[0-9]+-[0-9]+$/)
export const PATTERN_ALFANUMERICO_SIN_ACENTOS = new RegExp(
  /^[-_?¿!¡()& a-zA-Z0-9\s]+$/
)
