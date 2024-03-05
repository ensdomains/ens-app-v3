import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { Calendar } from '@app/components/@atoms/Calendar/Calendar'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { add28Days, addYears, formatExtensionPeriod } from '@app/utils/utils'

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
  defaultDate,
}: {
  date: Date
  setDate: (date: Date) => void
  name?: string
  defaultDate?: Date
}) => {
  const [yearPickView, setYearPickView] = useState<'years' | 'calendar'>('years')
  const yearPickSelection = yearPickView === 'calendar' ? 'years' : 'calendar'

  const extensionPeriod = formatExtensionPeriod(date)

  const dateInYears = date.getFullYear() - now.getFullYear()

  useEffect(() => {
    if (dateInYears < 1) setDate(addYears(date, 1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearPickView])

  return (
    <Container>
      {yearPickView === 'calendar' ? (
        <Calendar
          value={date}
          defaultValue={defaultDate}
          onChange={(e) => {
            const { valueAsDate } = e.target
            if (valueAsDate && valueAsDate >= add28Days(now)) setDate(valueAsDate)
          }}
          highlighted
          name={name}
        />
      ) : (
        <PlusMinusControl
          highlighted
          minValue={1}
          value={dateInYears}
          onChange={(e) => {
            const newYears = parseInt(e.target.value)

            if (!Number.isNaN(newYears)) setDate(addYears(date, newYears))
          }}
        />
      )}
      <Typography color="greyPrimary" fontVariant="smallBold">
        {extensionPeriod === 'Invalid date'
          ? extensionPeriod
          : `Registering for ${extensionPeriod}`}
        .{' '}
        <YearsViewSwitch type="button" onClick={() => setYearPickView(yearPickSelection)}>
          Pick by {yearPickSelection}
        </YearsViewSwitch>
      </Typography>
    </Container>
  )
}
