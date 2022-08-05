import { secondsToDays } from '@app/utils/utils'
import { Typography } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

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

export const ShortExpiry = ({ expiry }: { expiry: Date }) => {
  const { t } = useTranslation()
  const currentDate = new Date()
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

  return (
    <ExpiryText data-testid={`short-expiry-${color}`} weight="bold" $color={color}>
      {text}
    </ExpiryText>
  )
}
