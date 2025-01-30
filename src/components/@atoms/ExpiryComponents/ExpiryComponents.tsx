import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Skeleton, Typography } from '@ensdomains/thorin'

import ClockSVG from '@app/assets/Clock.svg'
import { secondsToDays, secondsToHours } from '@app/utils/utils'

import { useBlockTimestamp } from '../../../hooks/chain/useBlockTimestamp'

const GRACE_PERIOD_S = 90 * 24 * 60 * 60

type Color = 'red' | 'orange' | 'grey'

const ExpiryWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['1']};
    flex-gap: ${theme.space['1']};
  `,
)

const ClockIcon = styled.div<{ $color: Color }>(
  ({ theme, $color }) => css`
    width: ${theme.space['5']};
    height: ${theme.space['5']};
    color: ${theme.colors[$color]};
  `,
)

const ExpiryText = styled(Typography)<{
  $color: Color
}>(
  ({ theme, $color }) => css`
    color: ${theme.colors[$color]};
  `,
)

export const ExpiryClock = ({ expiry }: { expiry: Date }) => {
  const currentDate = new Date()
  const difference = secondsToDays((expiry.getTime() - currentDate.getTime()) / 1000)

  if (difference < 0) {
    return <ClockIcon data-testid="expiry-clock-red" $color="red" as={ClockSVG} />
  }
  if (difference < 90) {
    return <ClockIcon data-testid="expiry-clock-orange" $color="orange" as={ClockSVG} />
  }

  return <ClockIcon data-testid="expiry-clock-grey" $color="grey" as={ClockSVG} />
}

const makeTransPrefix = (inverse: boolean, hasGracePeriod: boolean) => {
  if (inverse) {
    return hasGracePeriod ? 'name.gracePeriod.expires' : 'name.expired'
  }
  return 'name.expires'
}

export const ShortExpiry = ({
  expiry,
  textOnly = false,
  hasGracePeriod,
}: {
  expiry: Date
  textOnly?: boolean
  hasGracePeriod?: boolean
}) => {
  const { t } = useTranslation()
  const blockTimestamp = useBlockTimestamp()
  const currentDate = blockTimestamp.data ? new Date(Number(blockTimestamp.data)) : new Date()
  let secondsDiff = (expiry.getTime() - currentDate.getTime()) / 1000
  const inverse = secondsDiff < 0
  if (inverse) {
    if (hasGracePeriod) {
      secondsDiff += GRACE_PERIOD_S
    } else {
      secondsDiff = -secondsDiff
    }
  }
  let difference = secondsToDays(secondsDiff)

  const months = Math.floor(difference / 30)
  const years = Math.floor(difference / 365)
  const transPrefix = makeTransPrefix(inverse, !!hasGracePeriod)

  let text = t(`${transPrefix}InYears`, { count: years })
  let color: 'grey' | 'red' | 'orange' = 'grey'

  if (difference === 0) {
    difference = secondsToHours(secondsDiff)
    text = t(`${transPrefix}InHours`, { count: difference })
    color = 'red'
  } else if (difference < 0) {
    text = t(`${transPrefix}InDays`, { count: difference })
    color = 'red'
  } else if (difference < 30) {
    text = t(`${transPrefix}InDays`, { count: difference })
    color = 'orange'
  } else if (difference < 90) {
    text = t(`${transPrefix}InMonths`, { count: months })
    color = 'orange'
  } else if (difference < 365) {
    text = t(`${transPrefix}InMonths`, { count: months })
    color = 'grey'
  }

  if (inverse) {
    color = 'red'
  }

  return (
    <Skeleton loading={blockTimestamp.isLoading}>
      {textOnly ? (
        text
      ) : (
        <ExpiryText
          data-testid="short-expiry"
          data-color={color}
          data-timestamp={expiry.getTime()}
          $color={color}
          fontVariant="small"
        >
          {text}
        </ExpiryText>
      )}
    </Skeleton>
  )
}

export const ReadableExpiry = ({ expiry }: { expiry: Date }) => {
  return (
    <ExpiryWrapper>
      <ExpiryClock expiry={expiry} />
      <Typography weight="bold" color="textSecondary">
        {`${expiry.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })}, ${expiry.getFullYear()}`}
      </Typography>
      <Typography weight="bold" color="grey">
        {`at ${expiry.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short',
        })}`}
      </Typography>
    </ExpiryWrapper>
  )
}
