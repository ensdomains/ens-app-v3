import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { Calendar } from '@app/components/@atoms/Calendar/Calendar'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { calculateDatesDiff, roundDurationWithDay, secondsFromDateDiff } from '@app/utils/date'
import { isInsideSafe } from '@app/utils/safe'
import { formatDurationOfDates } from '@app/utils/utils'

const YearsViewSwitch = styled.button(
  ({ theme }) => css`
    color: ${theme.colors.bluePrimary};
    cursor: pointer;
    font-size: ${theme.fontSizes.small};
    font-weight: ${theme.fontWeights.bold};
  `,
)

const MaxViewSwitch = styled(YearsViewSwitch)(
  ({ theme }) => css`
    margin-right: ${theme.space['2']};
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
  maxSeconds,
  mode = 'register',
  expiry,
}: {
  seconds: number
  setSeconds: (seconds: number) => void
  durationType: 'years' | 'date'
  name?: string
  minSeconds: number
  maxSeconds?: number
  mode?: 'register' | 'extend'
  expiry?: number
  onChangeDurationType?: (type: 'years' | 'date') => void
}) => {
  const currentTime = expiry ?? now

  const { t } = useTranslation()

  // Whole years available within the cap (floored). `undefined` => uncapped.
  const maxYears =
    maxSeconds !== undefined
      ? calculateDatesDiff(
          new Date(currentTime * 1000),
          new Date((currentTime + maxSeconds) * 1000),
        ).diff.years
      : undefined

  // Under a year of headroom can't be represented by the years counter, so
  // restrict to the date picker only in that case (WEB-110 risk note).
  const canPickByYears = maxYears === undefined || maxYears >= 1
  const effectiveDurationType = canPickByYears ? durationType : 'date'

  useEffect(() => {
    if (minSeconds > seconds) setSeconds(minSeconds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minSeconds, seconds])

  // Clamp down when a cap is set (or resolves asynchronously) below the
  // current selection. Only wired when headroom >= minSeconds, so this never
  // fights the min-bump effect above.
  useEffect(() => {
    if (maxSeconds !== undefined && seconds > maxSeconds) setSeconds(maxSeconds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxSeconds, seconds])

  const dateInYears = calculateDatesDiff(
    new Date(currentTime * 1000),
    new Date((currentTime + seconds) * 1000),
  ).diff.years

  // When the duration type is years, normalise the seconds to a year value
  useEffect(() => {
    if (effectiveDurationType === 'years' && currentTime) {
      const additionalYears =
        maxYears !== undefined
          ? Math.min(maxYears, Math.max(1, dateInYears))
          : Math.max(1, dateInYears)
      setSeconds(
        secondsFromDateDiff({
          startDate: new Date(currentTime * 1000),
          additionalYears,
        }),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateInYears, effectiveDurationType])

  const isSafeApp = isInsideSafe()

  return (
    <Container>
      {effectiveDurationType === 'date' && !isSafeApp ? (
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
          max={maxSeconds !== undefined ? currentTime + maxSeconds : undefined}
        />
      ) : (
        <PlusMinusControl
          highlighted
          minValue={1}
          maxValue={maxYears}
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
        {maxSeconds !== undefined && (
          <MaxViewSwitch
            type="button"
            data-testid="date-selection-max"
            onClick={() => {
              // Switch to the date view so the exact (possibly non-year-aligned)
              // max sticks — the years-normalisation effect would otherwise
              // round it back down.
              onChangeDurationType?.('date')
              setSeconds(maxSeconds)
            }}
          >
            {t('calendar.max', { ns: 'common' })}
          </MaxViewSwitch>
        )}
        {!isSafeApp && canPickByYears && (
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
