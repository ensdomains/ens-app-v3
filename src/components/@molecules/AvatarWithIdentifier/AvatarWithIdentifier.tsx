import styled, { css } from 'styled-components'
import { useChainId } from 'wagmi'

import { Typography } from '@ensdomains/thorin'

import { AvatarWithZorb } from '@app/components/AvatarWithZorb'
import { usePrimary } from '@app/hooks/usePrimary'
import { QuerySpace } from '@app/types'
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

type Props = {
  address: string
  name?: string
  subtitle?: string
  size?: QuerySpace
}

export const AvatarWithIdentifier = ({ name, address, subtitle, size = '10' }: Props) => {
  const primary = usePrimary(address, !address || !!name)
  const network = useChainId()

  const _subtitle = subtitle || (primary.data?.name ? shortenAddress(address) : undefined)

  return (
    <Container>
      <AvatarWithZorb
        label={name || primary.data?.name || address}
        address={address}
        name={name || primary.data?.name}
        size={size}
        network={network}
      />
      <TextContainer>
        <Typography fontVariant="bodyBold" ellipsis data-testid="avatar-label-name">
          {name || primary.data?.beautifiedName || shortenAddress(address)}
        </Typography>
        {_subtitle && (
          <Typography fontVariant="extraSmall" color="grey" data-testid="avatar-label-address">
            {_subtitle}
          </Typography>
        )}
      </TextContainer>
    </Container>
  )
}
