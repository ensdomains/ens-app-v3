import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import ClockSVG from '@app/assets/Clock.svg'
import { secondsToDays } from '@app/utils/utils'

import { useBlockTimestamp } from '../../../hooks/useBlockTimestamp'

const ExpiryWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['1']};
    flex-gap: ${theme.space['1']};
  `,
)

const ClockIcon = styled.div<{ $color: 'red' | 'orange' | 'grey' }>(
  ({ theme, $color }) => css`
    width: ${theme.space['5']};
    height: ${theme.space['5']};
    color: ${theme.colors[$color]};
  `,
)

const ExpiryText = styled(Typography)<{
  $color: 'red' | 'orange' | 'foreground'
}>(
  ({ theme, $color }) => css`
    color: ${theme.colors[$color]};
    ${$color === 'foreground'
      ? css`
          opacity: 0.4;
        `
      : ``}
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

export const ShortExpiry = ({ expiry, textOnly = false }: { expiry: Date; textOnly?: boolean }) => {
  const { t } = useTranslation()
  const blockTimestamp = useBlockTimestamp()
  console.log(blockTimestamp.data! * 1000)
  console.log(Date.now())

  const currentDate = new Date(blockTimestamp.data!)
  const difference = secondsToDays((expiry.getTime() - currentDate.getTime()) / 1000)
  const months = Math.floor(difference / 30)
  const years = Math.floor(difference / 365)

  let text = t('name.expiresInYears', { count: years })
  let color: 'foreground' | 'red' | 'orange' = 'foreground'

  if (difference < 0) {
    text = t('name.expiresInDays', { count: difference + 90 })
    color = 'red'
  } else if (difference < 30) {
    text = t('name.expiresInDays', { count: difference })
    color = 'orange'
  } else if (difference < 90) {
    text = t('name.expiresInMonths', { count: months })
    color = 'orange'
  } else if (difference < 365) {
    text = t('name.expiresInMonths', { count: months })
    color = 'foreground'
  }

  if (textOnly) return <>{text}</>
  return (
    <ExpiryText data-testid={`short-expiry-${color}`} weight="bold" $color={color}>
      {text}
    </ExpiryText>
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
      <Typography weight="bold" color="textTertiary">
        {`at ${expiry.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short',
        })}`}
      </Typography>
    </ExpiryWrapper>
  )
}
