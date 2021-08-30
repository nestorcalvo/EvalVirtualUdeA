import React, { useState, useEffect } from 'react'
import { getCountDown } from '../../utils/fechas'
import { Title, CountdownItem, CountdownItemLetter, EndText, CounterWrapper, CountdownContainer } from './styles'
import { SVGCircle } from '../SVGCircle'
import { useElectronActions } from '../../actions/electronActions'
import { CAN_START_QUIZ } from '../../actions/types/electronTypes'

export const CountDown = ({ endDate, title, endText }) => {
  const [countdown, setCountdown] = useState()
  const [intervalCountdown, setInvervalCountdown] = useState()
  const { sendElectron } = useElectronActions()

  useEffect(() => {
    setInvervalCountdown(
      setInterval(() => {
        setCountdown(getCountDown(endDate))
      }, 1000))
    return () => clearInterval(intervalCountdown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isCoutdownOver()) {
      notifyCanStartExam()
      clearInterval(intervalCountdown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown])

  const notifyCanStartExam = async () => {
    sendElectron({ type: CAN_START_QUIZ, payload: 'can start' })
  }
  const mapNumber = (number, inMin, inMax, outMin, outMax) => {
    return (
      ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
    )
  }

  const isCoutdownOver = () => {
    if (countdown && countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0) {
      return true
    } else {
      return false
    }
  }

  const fillTimeOver = () => {
    return <EndText>{endText}</EndText>
  }
  const fillContdown = () => {
    // Mapping the date values to radius values
    const daysRadius = mapNumber(countdown.days, 30, 0, 0, 360)
    const hoursRadius = mapNumber(countdown.hours, 24, 0, 0, 360)
    const minutesRadius = mapNumber(countdown.minutes, 60, 0, 0, 360)
    const secondsRadius = mapNumber(countdown.seconds, 60, 0, 0, 360)

    return (
      <CountdownContainer>
        <Title>{title}</Title>
        <CounterWrapper>
          <CountdownItem>
            <SVGCircle radius={daysRadius} />
            {countdown.days}
            <CountdownItemLetter>D</CountdownItemLetter>
          </CountdownItem>
          <CountdownItem>
            <SVGCircle radius={hoursRadius} />
            {countdown.hours}
            <CountdownItemLetter>H</CountdownItemLetter>
          </CountdownItem>
          <CountdownItem>
            <SVGCircle radius={minutesRadius} />
            {countdown.minutes}
            <CountdownItemLetter>M</CountdownItemLetter>
          </CountdownItem>
          <CountdownItem>
            <SVGCircle radius={secondsRadius} />
            {countdown.seconds}
            <CountdownItemLetter>S</CountdownItemLetter>
          </CountdownItem>
        </CounterWrapper>
      </CountdownContainer>
    )
  }

  const fillContent = () => {
    if (countdown) {
      return (
        <>
          {isCoutdownOver() ? fillTimeOver() : fillContdown()}
        </>)
    } else {
      return <></>
    }
  }

  return (
    fillContent()
  )
}
