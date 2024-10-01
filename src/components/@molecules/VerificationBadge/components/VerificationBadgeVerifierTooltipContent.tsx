import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'

import { Colors, Typography } from '@ensdomains/thorin'

import VerifiedPersonSVG from '@app/assets/VerifiedPerson.svg'
import { CenteredTypography } from '@app/transaction-flow/input/ProfileEditor/components/CenteredTypography'

const Container = styled.div<{ $color: Colors }>(
  ({ theme, $color }) => css`
    display: flex;
    align-items: center;
    width: 100%;
    gap: ${theme.space['1.5']};
    overflow: hidden;

    ${$color && `color: ${theme.colors[$color]};`}
  `,
)

const IconWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['5']};
    height: ${theme.space['5']};
    display: block;
  `,
)

const Content = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

export const VerificationBadgeVerifierTooltipContent = ({
  isVerified,
}: {
  isVerified: boolean
}) => {
  const { t } = useTranslation('common')
  return (
    <Container $color="green">
      {match(isVerified)
        .with(true, () => (
          <>
            <IconWrapper>
              <VerifiedPersonSVG />
            </IconWrapper>
            <Content>
              <Typography>{t('verification.personhoodVerified')}</Typography>
            </Content>
          </>
        ))
        .otherwise(() => (
          <Content>
            <CenteredTypography>{t('verification.verificationFailed')}</CenteredTypography>
          </Content>
        ))}
    </Container>
  )
}
