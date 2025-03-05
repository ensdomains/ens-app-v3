import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import FaucetBanner from '@app/components/@molecules/FaucetBanner'
import Hamburger from '@app/components/@molecules/Hamburger/Hamburger'
import { SearchInput } from '@app/components/@molecules/SearchInput/SearchInput'
import { LeadingHeading } from '@app/components/LeadingHeading'
import { AnnouncementBanner } from '@app/components/pages/AnnouncementBanner'
import { VerificationErrorDialog } from '@app/components/pages/VerificationErrorDialog'
import { useVerificationOAuthHandler } from '@app/hooks/verification/useVerificationOAuthHandler/useVerificationOAuthHandler'

import ENSFull from '../assets/ENSFull.svg'

const GradientTitle = styled.h1(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingTwo};
    text-align: center;
    font-weight: 800;
    background-image: ${theme.colors.blueGradient};
    background-repeat: no-repeat;
    background-size: 110%;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin: 0;

    @media (min-width: ${theme.breakpoints.sm}px) {
      font-size: ${theme.fontSizes.headingOne};
    }
  `,
)

const SubtitleWrapper = styled.div(
  ({ theme }) => css`
    max-width: calc(${theme.space['72']} * 2 - ${theme.space['4']});
    line-height: 150%;
    text-align: center;
    margin-bottom: ${theme.space['3']};
  `,
)

const Container = styled.div(
  () => css`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  `,
)

const Stack = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-gap: ${theme.space['3']};
    gap: ${theme.space['3']};
  `,
)

const StyledENS = styled.div(
  ({ theme }) => css`
    height: ${theme.space['8.5']};
  `,
)

const LogoAndLanguage = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};
    flex-gap: ${theme.space['4']};
  `,
)

const StyledLeadingHeading = styled(LeadingHeading)(
  ({ theme }) => css`
    @media (min-width: ${theme.breakpoints.sm}px) {
      display: none;
    }
  `,
)

export default function Page() {
  const { t } = useTranslation('common')

  const { dialogProps } = useVerificationOAuthHandler()

  return (
    <>
      <Head>
        <title>ENS</title>
      </Head>
      <StyledLeadingHeading>
        <LogoAndLanguage>
          <StyledENS as={ENSFull} />
        </LogoAndLanguage>
        <Hamburger />
      </StyledLeadingHeading>
      <FaucetBanner />
      <Container>
        <Stack>
          <GradientTitle>{t('title')}</GradientTitle>
          <SubtitleWrapper>
            <Typography fontVariant="large" color="grey">
              {t('description')}
            </Typography>
          </SubtitleWrapper>
          <SearchInput />

          <AnnouncementBanner />
        </Stack>
      </Container>
      <VerificationErrorDialog {...(dialogProps ?? {})} />
    </>
  )
}
