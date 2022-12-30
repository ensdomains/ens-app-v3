import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography, mq } from '@ensdomains/thorin'

import { HamburgerRoutes } from '@app/components/@molecules/HamburgerRoutes'
import { SearchInput } from '@app/components/@molecules/SearchInput/SearchInput'
import { LanugageDropdown } from '@app/components/LanguageDropdown'
import { LeadingHeading } from '@app/components/LeadingHeading'

import ENSWithGradient from '../assets/ENSWithGradient.svg'

const GradientTitle = styled.h1(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingTwo};
    text-align: center;
    font-weight: 800;
    background-image: ${theme.colors.gradients.accent};
    background-repeat: no-repeat;
    background-size: 110%;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin: 0;

    ${mq.sm.min(css`
      font-size: ${theme.fontSizes.headingOne};
    `)}
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
    height: ${theme.space['12']};
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
  () => css`
    ${mq.md.min(
      css`
        display: none;
      `,
    )}
  `,
)

export default function Page() {
  const { t } = useTranslation('common')

  return (
    <>
      <Head>
        <title>ENS</title>
      </Head>
      <StyledLeadingHeading>
        <LogoAndLanguage>
          <StyledENS as={ENSWithGradient} />
          <LanugageDropdown />
        </LogoAndLanguage>
        <HamburgerRoutes />
      </StyledLeadingHeading>
      <Container>
        <Stack>
          <GradientTitle>{t('title')}</GradientTitle>
          <SubtitleWrapper>
            <Typography typography="Large/Normal" color="grey">
              {t('description')}
            </Typography>
          </SubtitleWrapper>
          <SearchInput />
        </Stack>
      </Container>
    </>
  )
}
