import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { Calendar } from '@app/components/@atoms/Calendar/Calendar'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { add28Days, formatExtensionPeriod, setYearsForDate } from '@app/utils/utils'

// import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'

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

const now = new Date()

export const YearSelection = ({
  date,
  setDate,
  name,
  minDate = add28Days(now),
  since,
}: {
  date: Date
  setDate: (date: Date) => void
  name?: string
  minDate?: Date
  since?: Date
}) => {
  const [yearPickView, setYearPickView] = useState<'years' | 'date'>('years')
  const yearPickSelection = yearPickView === 'date' ? 'years' : 'date'

  const extensionPeriod = formatExtensionPeriod(date, since ?? now)

  useEffect(() => {
    if (minDate > date) setDate(minDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDate, date])

  const dateInYears = date.getFullYear() - minDate.getFullYear()

  useEffect(() => {
    if (yearPickView === 'years' && dateInYears < 1) setDate(setYearsForDate(date, 1, minDate))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateInYears, yearPickView])

  return (
    <Container>
      {yearPickView === 'date' ? (
        <Calendar
          value={date}
          onChange={(e) => {
            const { valueAsDate } = e.target
            if (valueAsDate && valueAsDate >= minDate) setDate(valueAsDate)
          }}
          highlighted
          name={name}
          min={minDate}
        />
      ) : (
        <PlusMinusControl
          highlighted
          minValue={1}
          value={dateInYears}
          onChange={(e) => {
            const newYears = parseInt(e.target.value)

            if (!Number.isNaN(newYears)) setDate(setYearsForDate(date, newYears, minDate))
          }}
        />
      )}
      <Typography color="greyPrimary" fontVariant="smallBold">
        {extensionPeriod === 'Invalid date'
          ? extensionPeriod
          : `${since ? 'Extending' : 'Registering'} for ${extensionPeriod}`}
        .{' '}
        <YearsViewSwitch type="button" onClick={() => setYearPickView(yearPickSelection)}>
          Pick by {yearPickSelection}
        </YearsViewSwitch>
      </Typography>
    </Container>
  )
}
