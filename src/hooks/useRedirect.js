import { useHistory } from 'react-router-dom'

export const useRedirect = () => {
  const history = useHistory()
  const pathHome = '/home'
  const pathLogin = '/login'
  const redirectHome = () => {
    history.push(pathHome)
  }
  const redirectLogin = () => {
    history.push(pathLogin)
  }

  return { redirectHome, redirectLogin }
}
