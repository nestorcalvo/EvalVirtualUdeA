import React from 'react'
import { ListItem, ListItemContent, ListItemHeader, ListItemSubtitle } from './styles'
import { convertirFechaHoraFormatoLegible } from '../../utils/fechas'

export const CohortListItem = ({ cohort }) => {
  const fillReadableDate = (date) => convertirFechaHoraFormatoLegible(new Date(date))

  return <ListItem to={`cohort/${cohort.id}`}>
    <ListItemHeader>
      <ListItemHeader>
        {cohort.name}
      </ListItemHeader>
    </ListItemHeader>
    <ListItemContent>
      <ListItemSubtitle>
        FECHA DE INICIO {fillReadableDate(cohort.startDate)}
      </ListItemSubtitle>
      <ListItemSubtitle>
        FECHA DE FINALIZACIÓN {fillReadableDate(cohort.finalDate)}
      </ListItemSubtitle>
    </ListItemContent>
  </ListItem>
}
