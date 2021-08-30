import { BASE_URL, BASE_URL2, TOKEN } from '../utils/constantes'

/**
 * @param {string}  url url a la cual consultar
 * esta funcion detecta si es una nueva url base (comienza con http:// o https://).
 * en caso de ser asi, retorna la url. en caso contrario, se asume que es un fragmento
 * de path por lo que se concatena con la constante BASE_URL
 **/
const readUrl = (url = '') =>
  url.startsWith('login') || url.startsWith('logout') || url.startsWith('sus') || url.startsWith('gatherInfo') || url.startsWith('watchProcesses') ||
  url.startsWith('startexam') || url.startsWith('exit')
    ? `${BASE_URL2}/${url}`
    : `${BASE_URL}/${url}`

const isOk = (response) =>
  response.ok
    ? response
    : Promise.reject(new Error('Failed to load data from server'))

const get = async (url = '', headers = {}) => {
  return await fetch(readUrl(url), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers
    }

  }).then(isOk)
}

const post = (url = '', body = {}, headers = {}) =>
  fetch(readUrl(url), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...headers
    }
  }).then(isOk)

const postPure = (url = '', body = {}, headers = {}) => {
  const options = {
    method: 'POST',
    body: body,
    headers: {
      Accept: 'application/json',
      ...headers
    }
  }
  if (options && options.headers) {
    delete options.headers['Content-Type']
  }
  return fetch(url, options).then((response) => response.json())
}

const put = (url = '', body = {}, headers = {}) =>
  fetch(readUrl(url), {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers
    }
  }).then(isOk)

const del = (url = '', headers = {}) =>
  fetch(readUrl(url), {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers
    }
  }).then((response) => response.json())

export const getTokenAuth = async () => {
  const token = await window.localStorage.getItem(TOKEN)
  let AUTH_HEADER = null
  if (token) {
    AUTH_HEADER = { Authorization: `Bearer ${token}` }
  }
  return AUTH_HEADER
}

export default {
  get,
  post,
  postPure,
  put,
  delete: del
}
