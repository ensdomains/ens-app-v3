import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@ensdomains/thorin'

import { secondsToDays, secondsToHours } from '@app/utils/utils'

import { useBlockTimestamp } from '../../../hooks/chain/useBlockTimestamp'

const GRACE_PERIOD_S = 90 * 24 * 60 * 60

type Color = 'red' | 'orange' | 'grey'

const ExpiryText = ({
  $color,
  ...props
}: ComponentProps<typeof Typography> & { $color: Color }) => (
  <Typography {...props} color={`${$color}`} />
)

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
  const currentDate = new Date(Number(blockTimestamp.data))
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

  if (textOnly) return <>{text}</>
  return (
    <ExpiryText
      data-testid="short-expiry"
      data-color={color}
      data-timestamp={expiry.getTime()}
      $color={color}
      fontVariant="small"
    >
      {text}
    </ExpiryText>
  )
}
