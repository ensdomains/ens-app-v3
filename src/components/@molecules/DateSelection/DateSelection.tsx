import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { Calendar } from '@app/components/@atoms/Calendar/Calendar'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { roundDurationWithDay, secondsFromDateDiff } from '@app/utils/date'
import { isInsideSafe } from '@app/utils/safe'
import { formatDurationOfDates, secondsToYears } from '@app/utils/utils'

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
  durationType,
  onChangeDurationType,
  name,
  minSeconds,
  mode = 'register',
  expiry,
}: {
  seconds: number
  setSeconds: (seconds: number) => void
  durationType: 'years' | 'date'
  name?: string
  minSeconds: number
  mode?: 'register' | 'extend'
  expiry?: number
  onChangeDurationType?: (type: 'years' | 'date') => void
}) => {
  const currentTime = expiry ?? now

  const { t } = useTranslation()

  useEffect(() => {
    if (minSeconds > seconds) setSeconds(minSeconds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minSeconds, seconds])

  const dateInYears = Math.floor(secondsToYears(seconds))

  // When the duration type is years, normalise the seconds to a year value
  useEffect(() => {
    if (durationType === 'years' && currentTime) {
      setSeconds(
        secondsFromDateDiff({
          startDate: new Date(currentTime * 1000),
          additionalYears: Math.max(1, dateInYears),
        }),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateInYears, durationType])

  const isSafeApp = isInsideSafe()

  return (
    <Container>
      {durationType === 'date' && !isSafeApp ? (
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

            if (!Number.isNaN(newYears))
              setSeconds(
                secondsFromDateDiff({
                  startDate: new Date(currentTime * 1000),
                  additionalYears: newYears,
                }),
              )
          }}
        />
      )}
      <Typography color="greyPrimary" fontVariant="smallBold" data-testid="date-selection-info">
        {formatDurationOfDates({
          startDate: new Date(currentTime * 1000),
          endDate: new Date((currentTime + seconds) * 1000),
          postFix: mode === 'register' ? ' registration. ' : ' extension. ',
          t,
        })}
        {!isSafeApp && (
          <YearsViewSwitch
            type="button"
            data-testid="date-selection"
            onClick={() => onChangeDurationType?.(durationType === 'years' ? 'date' : 'years')}
          >
            {t(`calendar.pick_by_${durationType === 'date' ? 'years' : 'date'}`, { ns: 'common' })}
          </YearsViewSwitch>
        )}
      </Typography>
    </Container>
  )
}
