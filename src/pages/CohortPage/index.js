import React from 'react'
import { LoadingButton } from '../../components/Buttons'
import { ContentInfo, ActiveSessionActions, ContentInfoText, ActiveSessionWrapper, QuizName } from './styles'
import { convertirFechaHoraFormatoLegible } from '../../utils/fechas'
import { MiniLoader } from '../../components/MiniLoader'
import { CountDown } from '../../components/CountDown'
import { useCohortState } from './state'
import { WarnMessage } from '../../components/WarnMessage'
import { Loading } from '../../components/Loading'

export const CohortPage = ({ match }) => {
  const { isQuizOpened, loading, error, activeCohort, canStartQuiz, isValidMac, user, handleOpenQuiz, isBiometricallyRegistered, externalDisplay } = useCohortState({match})

  const fillMacWarn = () => (
    <WarnMessage
      message='Está ingresando desde un equipo no registrado.
        En este examen solo puede ingresar en el mismo equipo registrado previamente.' background='#dc6969'
    />
  )

  const fillInfoQuiz = () => {
    const fechaInicio = convertirFechaHoraFormatoLegible(new Date(activeCohort.startDate))
    const fechaFin = convertirFechaHoraFormatoLegible(new Date(activeCohort.finalDate))

    return <>
      <QuizName>
        {activeCohort.name}
      </QuizName>
      <ContentInfo>
        <ContentInfoText> <b>Fecha de inicio:</b> {fechaInicio}</ContentInfoText>
        <ContentInfoText> <b>Fecha de finalización:</b> {fechaFin}</ContentInfoText>
        <ContentInfoText>Zona horaria {Intl.DateTimeFormat().resolvedOptions().timeZone}</ContentInfoText>
        <CountDown
          endDate={new Date(activeCohort.startDate)}
          title='El examen comienza en'
          endText='¡El examen ha comenzado!'
        />

      </ContentInfo>
    </>
  }

  const fillActionsZone = () => (
    <ActiveSessionActions>
      <LoadingButton
        className='ActiveSessionBtn'
        text='Iniciar examen'
        disabled={!canStartQuiz}
        onClick={handleOpenQuiz}
      />
    </ActiveSessionActions>
  )

  const fillContent = () => (
    <ActiveSessionWrapper>
      {!isValidMac && fillMacWarn()}
      {activeCohort && isValidMac && fillInfoQuiz()}
      {isBiometricallyRegistered && !externalDisplay && isValidMac && !isQuizOpened && fillActionsZone()}
      {isQuizOpened && <Loading />}
    </ActiveSessionWrapper>
  )
  return <>
    {loading && <MiniLoader />}
    {!loading && user && activeCohort && fillContent()}
    {error && <p>error</p>}
  </>
}
