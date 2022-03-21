import React from 'react'
import Countdown from 'react-countdown';
export default function WrongCohort() {
  console.log('Cohorte equivocada')
  let countdownValue = 10 //Valor en segundos
  const closeWindow = () =>{
    
    console.log('Cerrar ventana')
    window.close()
  }
  return (
    <div>
      <h1>Cohorte equivocada porfavor descargar el aplicativo correcto</h1>
      <h1>Esta ventana se cerrará en <Countdown onComplete={closeWindow} date={Date.now() + (countdownValue* 1000)} /></h1>
    </div>
  )
}
