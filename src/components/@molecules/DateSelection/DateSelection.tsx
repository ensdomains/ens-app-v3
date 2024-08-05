import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { Calendar } from '@app/components/@atoms/Calendar/Calendar'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { roundDurationWithDay } from '@app/utils/date'
import { formatDurationOfDates, ONE_YEAR, secondsToYears, yearsToSeconds } from '@app/utils/utils'

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
  expiry,
}: {
  seconds: number
  setSeconds: (seconds: number) => void
  name?: string
  minSeconds: number
  mode?: 'register' | 'extend'
  expiry?: number
}) => {
  const currentTime = expiry ?? now
  const [yearPickView, setYearPickView] = useState<'years' | 'date'>('years')
  const toggleYearPickView = () => setYearPickView(yearPickView === 'date' ? 'years' : 'date')

  const { t } = useTranslation()

  useEffect(() => {
    if (minSeconds > seconds) setSeconds(minSeconds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minSeconds, seconds])

  const dateInYears = Math.floor(secondsToYears(seconds))
  const extensionPeriod = useMemo(() => {
    return formatDurationOfDates(
      new Date(currentTime * 1000),
      new Date((currentTime + seconds) * 1000),
      t,
    )
  }, [currentTime, seconds, t])

  useEffect(() => {
    if (yearPickView === 'years') {
      setSeconds(dateInYears < 1 ? ONE_YEAR : dateInYears * ONE_YEAR)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateInYears, yearPickView])

  return (
    <Container>
      {yearPickView === 'date' ? (
        <Calendar
          value={currentTime + seconds}
          onChange={(e) => {
            const { valueAsDate } = e.currentTarget
            if (valueAsDate) {
              setSeconds(roundDurationWithDay(valueAsDate, currentTime))
            }
          }}
          highlighted
          name={name}
          min={currentTime + minSeconds}
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
        {extensionPeriod === t('unit.invalid_date', { ns: 'common' })
          ? extensionPeriod
          : `${extensionPeriod} ${mode === 'register' ? 'registration.' : 'extension.'}`}{' '}
        <YearsViewSwitch
          type="button"
          data-testid="date-selection"
          onClick={() => toggleYearPickView()}
        >
          {t(`calendar.pick_by_${yearPickView === 'date' ? 'years' : 'date'}`, { ns: 'common' })}
        </YearsViewSwitch>
      </Typography>
    </Container>
  )
}
