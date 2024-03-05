import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { Calendar } from '@app/components/@atoms/Calendar/Calendar'
import { formatExtensionPeriod } from '@app/utils/utils'

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

  return (
    <Container>
      {yearPickView === 'years' ? (
        <Calendar
          value={date}
          defaultValue={defaultDate}
          onChange={(e) => {
            const { valueAsDate } = e.target
            if (valueAsDate) setDate(valueAsDate)
          }}
          highlighted
          name={name}
        />
      ) : (
        <></>
        // <PlusMinusControl
        //   minValue={1}
        //   value={date}
        //   onChange={(e) => {
        //     const newYears = parseInt(e.target.value)
        //     if (!Number.isNaN(newYears)) setDate(newYears)
        //   }}
        // />
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
