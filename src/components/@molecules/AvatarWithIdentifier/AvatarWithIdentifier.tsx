import styled, { css } from 'styled-components'
import { Address } from 'viem'

import { Typography } from '@ensdomains/thorin'

import { AvatarWithZorb } from '@app/components/AvatarWithZorb'
// import { useChainId } from '@app/hooks/chain/useChainId'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { QuerySpace } from '@app/types'
// import { emptyAddress } from '@app/utils/constants'
import { shortenAddress } from '@app/utils/utils'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
  `,
)

const TextContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 0;
  `,
)

const AddressTitleContainer = styled.div(
  () => css`
    word-break: break-all;
    text-align: left;
  `,
)

type Props = {
  address: Address
  name?: string
  subtitle?: string
  size?: QuerySpace
  shortenAddressAsTitle?: boolean
}

export const AvatarWithIdentifier = ({
  name,
  address,
  subtitle,
  size = '10',
  shortenAddressAsTitle = true,
}: Props) => {
  const primary = usePrimaryName({ address })
  // const network = useChainId()

  const _name = name || primary.data?.beautifiedName
  const _title = _name || (shortenAddressAsTitle ? shortenAddress(address) : address)
  const _subtitle =
    subtitle || (primary.data?.beautifiedName || name ? shortenAddress(address) : undefined)

  const isTitleFullAddress = !shortenAddressAsTitle && !_name

  return (
    <Container>
      <AvatarWithZorb
        label={_title}
        address={address}
        name={_name}
        size={size}
        // network={network} // TODO: Check if network is needed
      />
      <TextContainer>
        {isTitleFullAddress ? (
          <AddressTitleContainer data-testid="avatar-label-title">{_title}</AddressTitleContainer>
        ) : (
          <Typography fontVariant="bodyBold" ellipsis data-testid="avatar-label-title">
            {_title}
          </Typography>
        )}
        {_subtitle && (
          <Typography fontVariant="extraSmall" color="grey" data-testid="avatar-label-subtitle">
            {_subtitle}
          </Typography>
        )}
      </TextContainer>
    </Container>
  )
}
