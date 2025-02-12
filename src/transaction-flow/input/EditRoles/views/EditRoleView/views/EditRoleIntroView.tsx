import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Address } from 'viem'

import { Button } from '@ensdomains/thorin'

import { AvatarWithIdentifier } from '@app/components/@molecules/AvatarWithIdentifier/AvatarWithIdentifier'
import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import type { Role } from '@app/hooks/ownership/useRoles/useRoles'
import { SearchViewIntroView } from '@app/transaction-flow/input/SendName/views/SearchView/views/SearchViewIntroView'
import { emptyAddress } from '@app/utils/constants'

const SHOW_REMOVE_ROLES: Role[] = ['eth-record']
const SHOW_SET_TO_SELF_ROLES: Role[] = ['manager', 'eth-record']

const Row = styled.div(({ theme }) => [
  css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
    border-bottom: 1px solid ${theme.colors.border};

    > *:first-child {
      flex: 1;
    }

    > *:last-child {
      flex: 0 0 ${theme.space['24']};
    }
    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['4']} ${theme.space['6']};
    }
  `,
])

const Container = styled.div(
  ({ theme }) => css`
    width: 100%;
    height: 100%;
    min-height: ${theme.space['40']};
  `,
)

type Props = {
  role: Role
  address?: Address | null
  onSelect: (role: { role: Role; address: Address }) => void
}

export const EditRoleIntroView = ({ role, address, onSelect }: Props) => {
  const { t } = useTranslation('transactionFlow')
  const account = useAccountSafely()

  const showRemove = SHOW_REMOVE_ROLES.includes(role) && !!address && address !== emptyAddress
  const showSetToSelf = SHOW_SET_TO_SELF_ROLES.includes(role) && account.address !== address
  const showIntro = showRemove || showSetToSelf

  if (!account.address) return null
  return (
    <Container>
      {showIntro ? (
        <>
          {showRemove && (
            <Row>
              <AvatarWithIdentifier
                address={address}
                subtitle={t('input.editRoles.views.editRole.views.intro.current', {
                  role: t(`roles.${role}.title`, { ns: 'common' }),
                })}
              />
              <Button
                colorStyle="redSecondary"
                size="small"
                onClick={() => {
                  onSelect({ role, address: emptyAddress })
                }}
              >
                {t('action.remove', { ns: 'common' })}
              </Button>
            </Row>
          )}
          {showSetToSelf && (
            <Row>
              <AvatarWithIdentifier address={account.address!} />
              <Button
                data-testid="edit-roles-set-to-self-button"
                colorStyle="accentSecondary"
                size="small"
                onClick={() => {
                  onSelect({ role, address: account.address! })
                }}
              >
                {t('action.setToSelf', { ns: 'common' })}
              </Button>
            </Row>
          )}
        </>
      ) : (
        <SearchViewIntroView />
      )}
    </Container>
  )
}
