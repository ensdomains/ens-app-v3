import Link from 'next/link'
import { Trans, useTranslation } from 'react-i18next'

import { AlertSVG, Box, BoxProps, QuestionCircleSVG, Typography } from '@ensdomains/thorin'

const Container = (props: BoxProps) => (
  <Box
    {...props}
    flexGrow="1"
    flexDirection="column"
    display="flex"
    justifyContent="center"
    alignItems="center"
    gap="$4"
    width="$full"
    textAlign="center"
  />
)

const LinkWrapper = ({ children }: { children?: React.ReactNode }) => (
  <Link href="/" passHref>
    {children}
  </Link>
)

const SupportLink = (props: BoxProps) => (
  <Box {...props} as="a" color="$accent" fontWeight="$bold" href="https://support.ens.domains" />
)

type ErrorType = 'not-found' | 'application-error'

const ErrorScreen = ({ errorType }: { errorType: ErrorType }) => {
  const { t } = useTranslation('error', { keyPrefix: errorType })

  return (
    <Container className={errorType}>
      <Box
        as={errorType === 'not-found' ? <QuestionCircleSVG /> : <AlertSVG />}
        color={errorType === 'not-found' ? '$accent' : '$red'}
        wh="$11"
      />
      <Typography fontVariant="headingOne">{t('title')}</Typography>
      <Typography fontVariant="body" maxWidth="$96">
        <Trans
          t={t}
          i18nKey="message"
          components={{
            HomeLink: <LinkWrapper />,
            // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
            SupportLink: <SupportLink />,
          }}
        />
      </Typography>
    </Container>
  )
}

export default ErrorScreen
