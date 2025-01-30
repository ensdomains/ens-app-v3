import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Address } from 'viem'

import { RightArrowSVG, Typography } from '@ensdomains/thorin'

import { AvatarWithIdentifier } from '@app/components/@molecules/AvatarWithIdentifier/AvatarWithIdentifier'
import type { Role } from '@app/hooks/ownership/useRoles/useRoles'
import { emptyAddress } from '@app/utils/constants'

import { NoneSetAvatarWithIdentifier } from './NoneSetAvatarWithIdentifier'

const InfoContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[2]};
  `,
)

const Title = styled(Typography)(
  () => css`
    ::first-letter {
      text-transform: capitalize;
    }
  `,
)

const Divider = styled.div(
  ({ theme }) => css`
    border-bottom: 1px solid ${theme.colors.border};
    margin: 0 -${theme.space['4']};
  `,
)

const Footer = styled.button(
  () => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
)

const FooterRight = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['2']};
    color: ${theme.colors.accent};
  `,
)

const Container = styled.div<{ $dirty?: boolean }>(
  ({ theme, $dirty }) => css`
    display: flex;
    position: relative;
    flex-direction: column;
    gap: ${theme.space[4]};
    padding: ${theme.space[4]};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.large};
    width: ${theme.space.full};

    ${$dirty &&
    css`
      border: 1px solid ${theme.colors.greenLight};
      background: ${theme.colors.greenSurface};

      ${Divider} {
        border-bottom: 1px solid ${theme.colors.greenLight};
      }

      ::after {
        content: '';
        display: block;
        position: absolute;
        background: ${theme.colors.green};
        width: ${theme.space[4]};
        height: ${theme.space[4]};
        border: 2px solid ${theme.colors.background};
        border-radius: 50%;
        top: -${theme.space[2]};
        right: -${theme.space[2]};
      }
    `}
  `,
)

type Props = {
  address?: Address | null
  role: Role
  dirty?: boolean
  onClick?: () => void
}

export const RoleCard = ({ address, role, dirty, onClick }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const isAddressEmpty = !address || address === emptyAddress
  return (
    <Container $dirty={dirty} data-testid={`role-card-${role}`}>
      <InfoContainer>
        <Title fontVariant="bodyBold">{t(`roles.${role}.title`, { ns: 'common' })}</Title>
        <Typography fontVariant="small" color="grey">
          {t(`roles.${role}.description`, { ns: 'common' })}
        </Typography>
      </InfoContainer>
      <Divider />
      <Footer data-testid="role-card-change-button" type="button" onClick={onClick}>
        {isAddressEmpty ? (
          <>
            <NoneSetAvatarWithIdentifier size="8" dirty={dirty} />
            <FooterRight>
              <Typography fontVariant="bodyBold" color="accent">
                {t('action.add', { ns: 'common' })}
              </Typography>
              <RightArrowSVG height={16} width={16} />
            </FooterRight>
          </>
        ) : (
          <>
            <AvatarWithIdentifier address={address} size="8" />
            <FooterRight>
              <Typography fontVariant="bodyBold" color="accent">
                {t('action.change', { ns: 'common' })}
              </Typography>
              <RightArrowSVG height={16} width={16} />
            </FooterRight>
          </>
        )}
      </Footer>
    </Container>
  )
}
