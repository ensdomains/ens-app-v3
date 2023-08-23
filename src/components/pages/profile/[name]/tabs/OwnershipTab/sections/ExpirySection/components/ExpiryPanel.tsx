import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'

import { OutlinkSVG, QuestionCircleSVG, Tooltip, Typography } from '@ensdomains/thorin'

type Props = {
  type: 'expiry' | 'grace-period' | 'registration'
  date: Date
  link?: string
  tooltip?: string
}

const Container = styled.div(({ theme }) => [
  css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[2]};
  `,
])

const Header = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space[2]};
  `,
)

const IconWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space[4]};
    height: ${theme.space[4]};
    color: ${theme.colors.indigo};

    svg {
      display: block;
    }
  `,
)
const Link = styled.a(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space[1]};
    color: ${theme.colors.accentPrimary};

    svg {
      width: ${theme.space[3]};
      height: ${theme.space[3]};
    }
  `,
)

const Body = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space[2]};
  `,
)

export const ExpiryPanel = ({ type, date, link, tooltip }: Props) => {
  console.log(type)
  const { title } = match(type)
    .with('expiry', () => ({ title: 'Name expires' }))
    .with('grace-period', () => ({ title: 'Grace period ends' }))
    .with('registration', () => ({ title: 'Registered' }))
    .exhaustive()
  return (
    <Container>
      <Header>
        <Typography fontVariant="bodyBold" color="text">
          {title}
        </Typography>
        {link && (
          <Link
            target="_blank"
            href={link}
            rel="noreferrer"
            data-testid="etherscan-registration-link"
          >
            <Typography fontVariant="smallBold" color="accent">
              View
            </Typography>
            <OutlinkSVG />
          </Link>
        )}
        {tooltip && (
          <Tooltip content="tooltip" placement="top">
            <IconWrapper>
              <QuestionCircleSVG />
            </IconWrapper>
          </Tooltip>
        )}
      </Header>
      <Body>
        <Typography fontVariant="body" color="text">
          {date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </Typography>
        <Typography fontVariant="body" color="grey">
          {date.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
            hour12: false,
          })}
        </Typography>
      </Body>
    </Container>
  )
}
