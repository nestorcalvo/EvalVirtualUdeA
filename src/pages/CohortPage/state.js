
import { COOKIE_MAC, COOKIE_TOKEN, TOKEN, EXAM_URL } from '../../utils/constantes'
import { useElectronActions } from '../../actions/electronActions'
import { SHOW_QUIZ_WINDOW, SHOW_BIOMETRIC_WINDOW } from '../../actions/types/electronTypes'
import { useStore } from '../../store/storeContext'
import { useEffect, useRef, useState } from 'react'
import { useAuthActions } from '../../actions/authActions'

export const useCohortState = ({match}) => {
  const { state: { auth: { user, inscriptions, activeCohort, cohorts, canStartQuiz, loading, error, mac, externalDisplay }, biometrics: { isBiometricallyRegistered } }, dispatch } = useStore()
  // const { notifyPhotoUploaded } = useBiometricActions({}, dispatch)
  const { loginCohort, getSessionInfo, registerExamStarted } = useAuthActions(dispatch)
  const { getElectronVar } = useElectronActions(dispatch)
  const [isQuizOpened, setIsQuizOpened] = useState(false)
  const checkLoginCohort = () => {
    console.log('checkLoginCohort')
    const cohortId = match?.params?.cohortId
    if (!activeCohort && !error && cohortId && cohorts?.length > 0) {
      loginCohort(cohortId)
    }
  }
  const checkSessionInfo = () => {
    // TODO realmente esto es últil
    console.log('Cohorte chekeado')
    if (cohorts?.length === 0 && !user) {
      // console.log('sessionInfo desde CohortPage')
      getSessionInfo()
    }
  }

  const handleOpenQuiz = async () => {
    setIsQuizOpened(true)
    const id = await getElectronVar('personId')
    console.log(id)
    registerExamStarted({ identification: id})
    openQuiz(EXAM_URL)
  }

  const { sendElectron } = useElectronActions()
  const [isValidMac, setIsValidMac] = useState(false)
  const [isMinimizable, setMinimizable] = useState(false)

  const openQuiz = async (urlQuiz) => {
    // Establece un cookie con los datos de la misma.
    // puede sobrescriba cookies iguales si existen.
    const token = await window.localStorage.getItem(TOKEN)
    // we get unix date

    const cookieToken =
       {
         url: urlQuiz,
         name: COOKIE_TOKEN,
         value: token,
         expirationDate: null,
         path: '/'
       }
    const cookieMac = {
      url: urlQuiz,
      name: COOKIE_MAC,
      value: mac,
      expirationDate: null,
      path: '/'
    }
    const cookies = [cookieToken, cookieMac]
    const config = { urlQuiz, cookies, isMinimizable: isMinimizable }
    sendElectron({ type: SHOW_QUIZ_WINDOW, payload: config })
  }

  const openBiometrics = async () => {
    sendElectron({ type: SHOW_BIOMETRIC_WINDOW })
  }
  const checkSettingsExam = (cohort) => {
    checkMacIsValid(cohort)
    checkMinimizable(cohort)
  }
  const checkMacIsValid = (cohort) => {
    const settings = cohort?.settings
    if (settings?.blockByMac) {
      const inscription = inscriptions.find(i => i.id.cohortId === cohort.id)
      const macRegistered = inscription?.allowMac
      const isValid = mac === macRegistered
      setIsValidMac(isValid)
    } else {
      setIsValidMac(true)
    }
  }
  const checkMinimizable = (cohort) => {
    const settings = cohort?.settings
    if (settings?.minWindow) {
      setMinimizable(true)
    }
  }
  const initialTrackingValues = useRef({
    callCheckSettingsExam: checkSettingsExam,
    callCheckLoginCohort: checkLoginCohort
    // callCheckSessionInfo: checkSessionInfo
  })

  useEffect(() => {
    // const { callCheckLoginCohort, callCheckSessionInfo } = initialTrackingValues.current
    // callCheckSessionInfo()
    // callCheckLoginCohort()
    const { callCheckLoginCohort} = initialTrackingValues.current
    callCheckLoginCohort()
  }, [])

  useEffect(() => {
    const { callCheckSettingsExam } = initialTrackingValues.current
    activeCohort && inscriptions.length > 0 && callCheckSettingsExam(activeCohort)
  }, [activeCohort, inscriptions])

  return {
    handleOpenQuiz,
    openBiometrics,
    checkSettingsExam,
    isValidMac,
    user,
    activeCohort,
    canStartQuiz,
    loading,
    error,
    isBiometricallyRegistered,
    externalDisplay,
    isQuizOpened
  }
}
