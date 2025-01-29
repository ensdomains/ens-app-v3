import { ComponentPropsWithRef, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { RightArrowSVG, Tag, Typography } from '@ensdomains/thorin'

type Props = ComponentPropsWithRef<'button'> & { icon: ReactNode; verified: boolean }

const Container = styled.button(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    width: ${theme.space.full};
    overflow: hidden;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.large};
    padding: ${theme.space['4']};
    gap: ${theme.space['4']};
    background-color: ${theme.colors.background};
    cursor: pointer;
    transition:
      background-color 0.2s,
      transform 0.2s;

    &:hover {
      background-color: ${theme.colors.backgroundSecondary};
      transform: translateY(-1px);
    }
  `,
)

const IconWrapper = styled.div(
  ({ theme }) => css`
    svg {
      display: block;
      width: ${theme.space['8']};
      height: ${theme.space['8']};
    }
  `,
)

const Label = styled.div(
  () => css`
    flex: 1;
    overflow: hidden;
    text-align: left;
  `,
)

const ArrowWrapper = styled.div(
  ({ theme }) => css`
    color: ${theme.colors.accentPrimary};
  `,
)

export const VerificationOptionButton = ({ icon, children, verified, ...props }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <Container {...props} data-testid={`verification-option-${children}`}>
      {icon && <IconWrapper>{icon}</IconWrapper>}
      <Label>
        <Typography fontVariant="bodyBold">{children}</Typography>
      </Label>
      {verified && (
        <Tag size="small" colorStyle="greenSecondary" data-testid="verification-option-added">
          {t('input.verifyProfile.list.added')}
        </Tag>
      )}
      <ArrowWrapper>
        <RightArrowSVG height={16} width={16} />
      </ArrowWrapper>
    </Container>
  )
}
