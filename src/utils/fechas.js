
export const convertirFormatoLegible = (fecha) => {
  const mes = fecha.getMonth() + 1
  const dia = fecha.getDate()
  const ano = fecha.getFullYear()
  const mesString = obtenerMesEnCadena(mes)

  return dia + ' de ' + mesString + ' de ' + ano
}

export const convertirFormatoLegibleUTC = (fecha) => {
  const mes = fecha.getUTCMonth() + 1
  const dia = fecha.getUTCDate()
  const ano = fecha.getUTCFullYear()
  const mesString = obtenerMesEnCadena(mes)

  return dia + ' de ' + mesString + ' de ' + ano
}

export const convertirHoraFormatoLegible = (fecha) => {
  let periodo = 'am'
  let hora = fecha.getHours()
  let minutos = fecha.getMinutes()

  if (minutos < 10) {
    minutos = '0' + minutos
  }
  if (hora > 12) {
    hora -= 12
    periodo = 'pm'
  }

  return hora + ':' + minutos + periodo
}

export const convertirFechaHoraFormatoLegible = (fecha) => {
  const fechaLegible = convertirFormatoLegible(fecha)
  const horaLegible = convertirHoraFormatoLegible(fecha)

  return fechaLegible + '  ' + horaLegible
}

/**
 * @return { days, hours, minutes, seconds }
 * @param {*} countDownDate : Date
 */
export const getCountDown = (countDownDate) => {
  // Get today's date and time
  var now = new Date().getTime()

  // Find the distance between now and the count down date
  var distance = countDownDate - now

  // Time calculations for days, hours, minutes and seconds
  var days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)))
  var hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
  var minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
  var seconds = Math.max(0, Math.floor((distance % (1000 * 60)) / 1000))

  return { days, hours, minutes, seconds }
}

const obtenerMesEnCadena = (mes) => {
  let mesString = ''
  switch (mes) {
    case 1:
      mesString = 'enero'
      break
    case 2:
      mesString = 'febrero'
      break
    case 3:
      mesString = 'marzo'
      break
    case 4:
      mesString = 'abril'
      break
    case 5:
      mesString = 'mayo'
      break
    case 6:
      mesString = 'junio'
      break
    case 7:
      mesString = 'julio'
      break
    case 8:
      mesString = 'agosto'
      break
    case 9:
      mesString = 'septiembre'
      break
    case 10:
      mesString = 'octubre'
      break
    case 11:
      mesString = 'noviembre'
      break
    case 12:
      mesString = 'diciembre'
      break

    default:
      break
  }

  return mesString
}
