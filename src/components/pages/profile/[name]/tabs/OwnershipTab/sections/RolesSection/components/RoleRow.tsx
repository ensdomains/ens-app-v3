import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useCopyToClipboard } from 'react-use'
import styled, { css } from 'styled-components'
import { Address } from 'viem'

import {
  Button,
  CardDivider,
  CopySVG,
  Dropdown,
  OutlinkSVG,
  UpRightArrowSVG,
  VerticalDotsSVG,
} from '@ensdomains/thorin'

import { AvatarWithIdentifier } from '@app/components/@molecules/AvatarWithIdentifier/AvatarWithIdentifier'
import { useChainName } from '@app/hooks/chain/useChainName'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import type { Role } from '@app/hooks/ownership/useRoles/useRoles'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { getDestination } from '@app/routes'
import { emptyAddress } from '@app/utils/constants'
import { checkETH2LDFromName, makeEtherscanLink } from '@app/utils/utils'

import { useRoleActions } from '../hooks/useRoleActions'
import { RoleTag } from './RoleTag'

type DropdownItem = Parameters<typeof Dropdown>[0]['items'][number]

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space[4]};
  `,
)

const InnerContainer = styled.div(
  ({ theme }) => css`
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;

    gap: ${theme.space[4]};
  `,
)

const RoleTagContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.space[2]};
  `,
)

type Props = {
  name: string
  address?: Address | null
  roles: Role[]
  actions: ReturnType<typeof useRoleActions>['data']
  isWrapped: boolean
  isEmancipated: boolean
}

export const RoleRow = ({ name, address, roles, actions, isWrapped, isEmancipated }: Props) => {
  const router = useRouterWithHistory()
  const { t } = useTranslation('common')

  const primary = usePrimaryName({ address: address!, enabled: !!address })
  const networkName = useChainName()
  const [, copy] = useCopyToClipboard()

  const etherscanAction = useMemo(() => {
    const primaryName = primary.data?.name
    if (!primaryName) return null
    const is2ldEth = checkETH2LDFromName(primaryName)
    const hasToken = is2ldEth || isWrapped
    if (!hasToken) return null
    return {
      label: t('transaction.viewEtherscan', { ns: 'common' }),
      onClick: () => window.open(makeEtherscanLink(address!, networkName, 'address'), '_blank'),
      icon: () => <OutlinkSVG height={16} width={16} />,
    }
  }, [primary.data?.name, isWrapped, t, address, networkName])

  const editRolesAction = actions?.find(({ type, disabled }) => type === 'edit-roles' && !disabled)

  const syncManagerAction = roles.includes('manager')
    ? actions?.find(({ type, disabled }) => type === 'sync-manager' && !disabled)
    : null

  const items: DropdownItem[] = [
    ...(primary.data?.name
      ? ([
          {
            label: t('wallet.viewProfile'),
            onClick: () => router.push(getDestination(`/profile/${primary.data!.name}`) as string),
            color: 'text',
            icon: () => <UpRightArrowSVG height={16} width={16} />,
          },
          {
            label: t('name.copy'),
            onClick: () => copy(primary.data!.name!),
            color: 'text',
            icon: () => <CopySVG height={16} width={16} />,
          },
        ] as DropdownItem[])
      : []),
    {
      label: t('address.viewAddress'),
      onClick: () => router.push(getDestination(`/address/${address}`) as string),
      color: 'text',
      icon: () => <UpRightArrowSVG height={16} width={16} />,
    },
    {
      label: t('address.copyAddress'),
      onClick: () => copy(address!),
      color: 'text',
      icon: () => <CopySVG height={16} width={16} />,
    },
    ...(etherscanAction ? [etherscanAction] : []),
    ...(editRolesAction ? [editRolesAction] : []),
    ...(syncManagerAction ? [syncManagerAction] : []),
  ] as DropdownItem[]

  const { isLoading } = primary

  if (!address || address === emptyAddress || isLoading) return null
  return (
    <>
      <Container data-testid={`role-row-${address}`}>
        <InnerContainer>
          <AvatarWithIdentifier name={primary.data?.name} address={address} size="10" />
          <RoleTagContainer data-testid="role-tag-container">
            {roles?.map((role) => (
              <RoleTag key={role} name={name} role={role} isEmancipated={isEmancipated} />
            ))}
          </RoleTagContainer>
        </InnerContainer>
        <div>
          <Dropdown items={items} align="right" keepMenuOnTop width={200}>
            <Button
              data-testid={`role-row-button-${address}`}
              colorStyle="accentSecondary"
              size="small"
            >
              <VerticalDotsSVG width={12} height={12} />
            </Button>
          </Dropdown>
        </div>
      </Container>
      <CardDivider />
    </>
  )
}
