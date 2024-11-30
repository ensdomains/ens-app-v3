import Link from 'next/link'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { AlertSVG, QuestionCircleSVG, Typography } from '@ensdomains/thorin'

const Container = styled.div(
  ({ theme }) => css`
    --icon-color: ${theme.colors.red};

    &.not-found {
      --icon-color: ${theme.colors.accent};
    }

    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};
    width: 100%;

    text-align: center;

    & > svg {
      color: var(--icon-color);
      width: ${theme.space['11']};
      height: ${theme.space['11']};
    }

    & > div:last-of-type {
      max-width: ${theme.space['96']};

      a {
        color: ${theme.colors.accent};
        font-weight: ${theme.fontWeights.bold};
      }
    }
  `,
)

const LinkWrapper = ({ children }: { children?: React.ReactNode }) => (
  <Link href="/" passHref legacyBehavior>
    <a>{children}</a>
  </Link>
)

type ErrorType = 'not-found' | 'application-error'

const ErrorScreen = ({ errorType }: { errorType: ErrorType }) => {
  const { t, ready } = useTranslation('error', { keyPrefix: errorType })

  if (!ready) {
    return null
  }

  return (
    <Container className={errorType}>
      {errorType === 'not-found' ? (
        <QuestionCircleSVG data-testid="question-circle-svg" />
      ) : (
        <AlertSVG data-testid="alert-svg" />
      )}
      <Typography fontVariant="headingOne">{t('title')}</Typography>
      <Typography fontVariant="body">
        <Trans
          t={t}
          i18nKey="message"
          components={{
            HomeLink: <LinkWrapper />,
            // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
            SupportLink: <a href="https://support.ens.domains" />,
          }}
        />
      </Typography>
    </Container>
  )
}

export default ErrorScreen
