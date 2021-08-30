import React from 'react'
import { FaFileUpload, FaCheckCircle, FaTimesCircle, FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { Button, CircleButton } from './styles'
import { AiFillCamera } from 'react-icons/all'

export const LoadingButton = ({
  id,
  onClick,
  canDisplay = true,
  color = '#fff',
  background = '#6c9a06',
  size = '20px',
  text,
  className
}) => (
  <Button
    onClick={() => onClick()}
    canDisplay={canDisplay}
    background={background}
    className={className}
  >
    <FaFileUpload size={size} color={color} />
    {text}
  </Button>
)

export const CheckPeripheralsButton = ({
  id,
  onClick,
  canDisplay = true,
  color = '#fff',
  background = '#e0ad10',
  size = '20px',
  text,
  className
}) => (
  <Button
    onClick={() => onClick()}
    canDisplay={canDisplay}
    background={background}
    className={className}
  >
    <AiFillCamera size={size} color={color} />
    {text}
  </Button>
)

export const ConfirmButton = ({
  id,
  onClick,
  canDisplay = true,
  color = '#fff',
  colorOver = '#fff',
  background = '#6c9a06',
  overBackground = '#6c9a06',
  size = '20px',
  text,
  className
}) => (
  <Button
    onClick={() => onClick()}
    canDisplay={canDisplay}
    background={background}
    className={className}
    colorOver={colorOver}
    color={color}
    overBackground={overBackground}
  >
    <FaCheckCircle size={size} color={color} />
    {text}
  </Button>
)

export const CancelButton = ({
  id,
  onClick,
  canDisplay = true,
  color = '#fff',
  colorOver = '#fff',
  background = '#6c9a06',
  overBackground = '#6c9a06',
  size = '20px',
  text,
  className
}) =>
  (
    <Button
      onClick={() => onClick()}
      canDisplay={canDisplay}
      background={background}
      className={className}
      colorOver={colorOver}
      color={color}
      overBackground={overBackground}
    >
      <FaTimesCircle size={size} color={color} />
      {text}
    </Button>
  )

export const BackButton = ({
  id,
  onClick,
  canDisplay = true,
  color = '#fff',
  colorOver = '#fff',
  background = '#6c9a06',
  overBackground = '#6c9a06',
  size = '20px',
  text,
  className
}) =>
  (
    <Button
      onClick={() => onClick()}
      canDisplay={canDisplay}
      background={background}
      className={className}
      colorOver={colorOver}
      color={color}
      overBackground={overBackground}
    >
      <FaRegArrowAltCircleLeft size={size} color={color} />
      {text}
    </Button>
  )

export const CircularButton = ({
  id,
  onClick,
  canDisplay = true,
  color = '#fff',
  colorOver = '#fff',
  background = '#6c9a06',
  overBackground = '#6c9a06',
  size = '20px',
  radius = '40px',
  icon: Icon,
  className
}) =>
  (
    <CircleButton
      onClick={() => onClick()}
      canDisplay={canDisplay}
      radius={radius}
      background={background}
      className={className}
      colorOver={colorOver}
      color={color}
      overBackground={overBackground}
    >
      <Icon size={size} color={color} />
    </CircleButton>
  )
