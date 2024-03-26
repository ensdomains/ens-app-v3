import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { Calendar } from '@app/components/@atoms/Calendar/Calendar'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import {
  addOneYear,
  formatExtensionPeriod,
  getSecondsFromDate,
  secondsToYears,
  yearsToSeconds,
} from '@app/utils/utils'

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

const now = Date.now() / 1000

export const DateSelection = ({
  seconds,
  setSeconds,
  name,
  minDuration,
  mode = 'register',
}: {
  seconds: number
  setSeconds: (seconds: number) => void
  name?: string
  minDuration: number
  mode?: 'register' | 'extend'
}) => {
  const [yearPickView, setYearPickView] = useState<'years' | 'date'>('years')
  const yearPickSelection = yearPickView === 'date' ? 'years' : 'date'

  const extensionPeriod = formatExtensionPeriod(seconds)

  useEffect(() => {
    if (minDuration > seconds) setSeconds(minDuration)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDuration, seconds])

  const dateInYears = secondsToYears(seconds)

  useEffect(() => {
    if (yearPickView === 'years' && dateInYears < 1) setSeconds(addOneYear(seconds))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateInYears, yearPickView])

  return (
    <Container>
      {yearPickView === 'date' ? (
        <Calendar
          value={now + seconds}
          onChange={(e) => {
            const { valueAsDate } = e.currentTarget
            if (valueAsDate) {
              setSeconds(getSecondsFromDate(valueAsDate))
            }
          }}
          highlighted
          name={name}
          min={now + minDuration}
        />
      ) : (
        <PlusMinusControl
          highlighted
          minValue={1}
          value={dateInYears}
          onChange={(e) => {
            const newYears = parseInt(e.target.value)

            if (!Number.isNaN(newYears)) setSeconds(yearsToSeconds(newYears))
          }}
        />
      )}
      <Typography color="greyPrimary" fontVariant="smallBold">
        {extensionPeriod === 'Invalid date'
          ? extensionPeriod
          : `${extensionPeriod} ${mode === 'register' ? 'registration' : 'extension'}`}
        .{' '}
        <YearsViewSwitch type="button" onClick={() => setYearPickView(yearPickSelection)}>
          Pick by {yearPickSelection}
        </YearsViewSwitch>
      </Typography>
    </Container>
  )
}
