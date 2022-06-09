import { FilledHamburgerMenu } from '@app/components/@molecules/FilledHamburgerMenu'
import { LeadingHeading } from '@app/components/LeadingHeading'
import { SearchInput } from '@app/components/SearchInput'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { mq, Typography } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import ENSWithGradient from '../assets/ENSWithGradient.svg'

const GradientTitle = styled.h1(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingTwo};
    text-align: center;
    font-weight: 800;
    background-image: ${theme.colors.accentGradient};
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

const Description = styled(Typography)(
  ({ theme }) => css`
    line-height: ${theme.lineHeights['1.5']};
  `,
)

const StyledENS = styled.div(
  ({ theme }) => css`
    height: ${theme.space['12']};
  `,
)

export default function Page() {
  const { t } = useTranslation('common')
  const breakpoints = useBreakpoint()

  return (
    <>
      {!breakpoints.sm && (
        <LeadingHeading>
          <StyledENS as={ENSWithGradient} />
          <FilledHamburgerMenu />
        </LeadingHeading>
      )}
      <Container>
        <Stack>
          <GradientTitle>{t('title')}</GradientTitle>
          <SubtitleWrapper>
            <Description variant="large" color="textSecondary">
              {t('description')}
            </Description>
          </SubtitleWrapper>
          <SearchInput />
        </Stack>
      </Container>
    </>
  )
}
