import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { Calendar } from '@app/components/@atoms/Calendar/Calendar'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import {
  formatExtensionPeriod,
  ONE_DAY,
  ONE_YEAR,
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

const now = Math.floor(Date.now() / 1000)

export const DateSelection = ({
  seconds,
  setSeconds,
  name,
  minSeconds,
  mode = 'register',
}: {
  seconds: number
  setSeconds: (seconds: number) => void
  name?: string
  minSeconds: number
  mode?: 'register' | 'extend'
}) => {
  const [yearPickView, setYearPickView] = useState<'years' | 'date'>('years')
  const toggleYearPickView = () => setYearPickView(yearPickView === 'date' ? 'years' : 'date')

  const { t } = useTranslation()

  const extensionPeriod = formatExtensionPeriod(seconds, t)

  useEffect(() => {
    if (minSeconds > seconds) setSeconds(minSeconds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minSeconds, seconds])

  const dateInYears = Math.floor(secondsToYears(seconds))

  useEffect(() => {
    if (yearPickView === 'years' && dateInYears < 1) {
      setSeconds(ONE_YEAR)
    }
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
              const valueAsSeconds = Math.floor(valueAsDate.getTime() / 1000) - now
              const dayDiff = valueAsSeconds % ONE_DAY
              setSeconds(valueAsSeconds + (ONE_DAY - dayDiff))
            }
          }}
          highlighted
          name={name}
          min={now + minSeconds}
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
        <YearsViewSwitch
          type="button"
          data-testid="date-selection"
          onClick={() => toggleYearPickView()}
        >
          Pick by {yearPickView === 'date' ? 'years' : 'date'}
        </YearsViewSwitch>
      </Typography>
    </Container>
  )
}
