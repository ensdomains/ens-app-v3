import styled, { css } from 'styled-components'
import { useChainId } from 'wagmi'

import { Typography } from '@ensdomains/thorin'

import { AvatarWithZorb } from '@app/components/AvatarWithZorb'
import { usePrimary } from '@app/hooks/usePrimary'
import { QuerySpace } from '@app/types'
import { emptyAddress } from '@app/utils/constants'
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
  address: string
  name?: string
  subtitle?: string
  size?: QuerySpace
  shorten?: boolean
}

export const AvatarWithIdentifier = ({
  name,
  address,
  subtitle,
  size = '10',
  shorten = true,
}: Props) => {
  const primary = usePrimary(address, !address || !!name || address === emptyAddress)
  const network = useChainId()

  const _name = name || primary.data?.beautifiedName
  const _title = _name || (shorten ? shortenAddress(address) : address)
  const _subtitle =
    subtitle || (primary.data?.beautifiedName || name ? shortenAddress(address) : undefined)

  const isTitleFullAddress = !shorten && !_name

  return (
    <Container>
      <AvatarWithZorb label={_title} address={address} name={_name} size={size} network={network} />
      <TextContainer>
        {isTitleFullAddress ? (
          <AddressTitleContainer>{_title}</AddressTitleContainer>
        ) : (
          <Typography fontVariant="bodyBold" ellipsis data-testid="avatar-label-name">
            {_title}
          </Typography>
        )}
        {_subtitle && (
          <Typography fontVariant="extraSmall" color="grey" data-testid="avatar-label-address">
            {_subtitle}
          </Typography>
        )}
      </TextContainer>
    </Container>
  )
}
