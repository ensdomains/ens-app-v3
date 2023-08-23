import { BigNumber } from '@ethersproject/bignumber'
import { useCopyToClipboard } from 'react-use'
import styled, { css } from 'styled-components'

import { labelhash } from '@ensdomains/ensjs/utils/labels'
import { namehash } from '@ensdomains/ensjs/utils/normalise'
import {
  Button,
  Card,
  CopySVG,
  Dropdown,
  HorizontalOutwardArrowsSVG,
  OutlinkSVG,
  PersonSVG,
  UpRightArrowSVG,
  VerticalDotsSVG,
} from '@ensdomains/thorin'

import { AvatarWithIdentifier } from '@app/components/@molecules/AvatarWithIdentifier/AvatarWithIdentifier'
import { useChainName } from '@app/hooks/useChainName'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { usePrimary } from '@app/hooks/usePrimary'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { getDestination } from '@app/routes'
import { emptyAddress } from '@app/utils/constants'
import { checkETH2LDFromName, makeEtherscanLink } from '@app/utils/utils'

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
  address?: string | null
  roles: string[]
  showEditRolesInput: (key: string, data: { name: string }) => void
}

export const RoleRow = ({ address, roles, showEditRolesInput }: Props) => {
  const router = useRouterWithHistory()

  const primary = usePrimary(address!, !address)
  const name = 'test123.eth'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, copy] = useCopyToClipboard()

  const isWrapped = true
  const is2ldEth = checkETH2LDFromName(name)

  const hex = isWrapped ? namehash(name) : labelhash(name.split('.')[0])
  const tokenId = BigNumber.from(hex).toString()

  const networkName = useChainName()
  const wrapperAddress = useContractAddress('NameWrapper')
  const registrarAddress = useContractAddress('BaseRegistrarImplementation')

  const contractAddress = isWrapped ? wrapperAddress : registrarAddress

  const hasToken = is2ldEth || isWrapped

  const items: DropdownItem[] = [
    ...(name
      ? ([
          {
            label: 'View profile',
            onClick: () => router.push(getDestination(`/profile/${name}`) as string),
            color: 'text',
            icon: <UpRightArrowSVG />,
          },
          {
            label: 'Copy name',
            onClick: () => copy(name),
            color: 'text',
            icon: <CopySVG />,
          },
        ] as DropdownItem[])
      : []),
    {
      label: 'View address',
      onClick: () => router.push(getDestination(`/address/${address}`) as string),
      color: 'text',
      icon: <UpRightArrowSVG />,
    },
    {
      label: 'Copy address',
      onClick: () => copy(address!),
      color: 'text',
      icon: <CopySVG />,
    },
    ...(hasToken
      ? ([
          {
            label: 'View on Etherscan',
            onClick: () =>
              window.open(
                makeEtherscanLink(`${contractAddress}/${tokenId}`, networkName, 'nft'),
                '_blank',
              ),
            color: 'text',
            icon: <OutlinkSVG />,
          },
        ] as DropdownItem[])
      : []),
    {
      label: 'Edit roles',
      onClick: () => showEditRolesInput('edit-roles', { name }),
      color: 'text',
      icon: <PersonSVG />,
    },
    {
      label: 'Sync manager',
      onClick: () => {},
      icon: <HorizontalOutwardArrowsSVG />,
    },
  ]

  const { isLoading } = primary

  if (!address || address === emptyAddress || isLoading) return null
  return (
    <>
      <Container>
        <InnerContainer>
          <AvatarWithIdentifier name={primary.data?.name} address={address} size="10" />
          <RoleTagContainer>
            {roles?.map((role) => (
              <RoleTag name={role} />
            ))}
          </RoleTagContainer>
        </InnerContainer>
        <div>
          <Dropdown items={items} align="right" keepMenuOnTop width={200}>
            <Button colorStyle="accentSecondary" size="small">
              <VerticalDotsSVG />
            </Button>
          </Dropdown>
        </div>
      </Container>
      <Card.Divider />
    </>
  )
}
