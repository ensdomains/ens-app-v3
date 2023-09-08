import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { OutlinkSVG, Typography, mq } from '@ensdomains/thorin'

import { QuestionTooltip } from '@app/components/@molecules/QuestionTooltip/QuestionTooltip'

type Props = {
  type: 'expiry' | 'grace-period' | 'registration' | 'parent-expiry' | 'parent-grace-period'
  date: Date
  link?: string
  tooltip?: string
}

const Container = styled.div(({ theme }) => [
  css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: ${theme.space[2]};
    border-bottom: 1px solid ${theme.colors.border};
    padding: ${theme.space['4']} 0;
  `,
  mq.lg.min(css`
    border-bottom: none;
    border-right: 1px solid ${theme.colors.border};
    padding: 0 ${theme.space['1']} 0 ${theme.space['4']};
  `),
])

const Header = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space[2]};
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
  const { t } = useTranslation('profile')
  return (
    <Container>
      <Header>
        <Typography fontVariant="bodyBold" color="text">
          {t(`tabs.ownership.sections.expiry.panel.${type}.title`)}
        </Typography>
        {link && (
          <Link
            target="_blank"
            href={link}
            rel="noreferrer"
            data-testid="etherscan-registration-link"
          >
            <Typography fontVariant="smallBold" color="accent">
              {t('action.view', { ns: 'common' })}
            </Typography>
            <OutlinkSVG />
          </Link>
        )}
        {tooltip && <QuestionTooltip content={tooltip} />}
      </Header>
      <Body>
        <Typography fontVariant="body" color="text">
          {date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </Typography>
        <Typography fontVariant="small" color="grey">
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
