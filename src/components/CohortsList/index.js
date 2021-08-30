import React, { useEffect } from 'react'
import { CohortListItem } from './CohortListItem'
import { List } from './styles'

export const CohortsList = (cohorts = []) => {
  useEffect(() => {
  }, [cohorts])
  const fillList = () => (
    <List>
      {cohorts?.cohorts?.map(cohort => (
        <CohortListItem key={cohort.id} cohort={cohort} />
      ))}
    </List>
  )
  return (
    <>
      {fillList()}
    </>
  )
}
