import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { Calendar } from '@app/components/@atoms/Calendar/Calendar'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'

const YearsViewSwitch = styled.button(
  ({ theme }) => css`
    color: ${theme.colors.bluePrimary};
    cursor: pointer;
    font-size: ${theme.fontSizes.small};
    font-weight: ${theme.fontWeights.bold};
  `,
)

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
    align-items: center;
    width: ${theme.space.full};
  `,
)

export const YearSelection = ({
  years,
  setYears,
  name,
}: {
  years: number
  setYears: (years: number) => void
  name?: string
}) => {
  const [yearPickView, setYearPickView] = useState<'years' | 'calendar'>('years')
  const yearPickSelection = yearPickView === 'calendar' ? 'years' : 'calendar'

  return (
    <Container>
      {yearPickView === 'calendar' ? (
        <Calendar
          minValue={1}
          value={years}
          onChange={(newYears) => {
            if (!Number.isNaN(newYears)) setYears(newYears)
          }}
          highlighted
          name={name}
        />
      ) : (
        <PlusMinusControl
          minValue={1}
          value={years}
          onChange={(e) => {
            const newYears = parseInt(e.target.value)
            if (!Number.isNaN(newYears)) setYears(newYears)
          }}
        />
      )}
      <Typography color="greyPrimary" fontVariant="smallBold">
        Registering for {years} years.{' '}
        <YearsViewSwitch type="button" onClick={() => setYearPickView(yearPickSelection)}>
          Pick by {yearPickSelection}
        </YearsViewSwitch>
      </Typography>
    </Container>
  )
}
