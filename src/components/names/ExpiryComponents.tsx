import ClockSVG from '@app/assets/Clock.svg'
import { secondsToDays } from '@app/utils/utils'
import { Typography } from '@ensdomains/thorin'
import styled from 'styled-components'

const ExpiryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${({ theme }) => `
   gap: ${theme.space['1']};
   flex-gap: ${theme.space['1']};
   `}
`

const ClockIcon = styled.div<{ $color: 'red' | 'orange' | 'grey' }>`
  ${({ theme, $color }) => `
        width: ${theme.space['5']};
        height: ${theme.space['5']};
        color: ${theme.colors[$color]};
    `}
`

const ExpiryText = styled(Typography)<{
  $color: 'red' | 'orange' | 'foreground'
}>`
  ${({ theme, $color }) => `
    color: ${theme.colors[$color]};
    ${
      $color === 'foreground'
        ? `
      opacity: 0.4;
    `
        : ``
    }
  `}
`

export const ExpiryClock = ({ expiry }: { expiry: Date }) => {
  const currentDate = new Date()
  const difference = secondsToDays(
    (expiry.getTime() - currentDate.getTime()) / 1000,
  )

  if (difference < 0) {
    return <ClockIcon $color="red" as={ClockSVG} />
  }
  if (difference < 90) {
    return <ClockIcon $color="orange" as={ClockSVG} />
  }

  return <ClockIcon $color="grey" as={ClockSVG} />
}

export const ShortExpiry = ({ expiry }: { expiry: Date }) => {
  const currentDate = new Date()
  const difference = secondsToDays(
    (expiry.getTime() - currentDate.getTime()) / 1000,
  )
  const months = Math.round(difference / 30)
  const years = Math.round(difference / 365)

  let text = `${years} year${years > 1 ? 's' : ''}`
  let color: 'foreground' | 'red' | 'orange' = 'foreground'

  if (difference < 0) {
    text = `${difference + 90} days`
    color = 'red'
  } else if (difference < 90) {
    text = `${months} months`
    color = 'orange'
  } else if (difference < 365) {
    text = `${months} months`
    color = 'foreground'
  }

  return (
    <ExpiryText weight="bold" $color={color}>
      Expires in {text}
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
