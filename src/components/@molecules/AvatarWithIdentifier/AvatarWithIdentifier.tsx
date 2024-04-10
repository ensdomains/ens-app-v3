import styled, { css } from 'styled-components'
import { Address } from 'viem'

import { Typography } from '@ensdomains/thorin'

import { Name } from '@app/components/@atoms/Name2/Name'
import { AvatarWithZorb } from '@app/components/AvatarWithZorb'
import { useRemPixelValue } from '@app/hooks/dom/useRemPixelValue'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
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
    flex: 1;
    overflow: hidden;
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
  maxWidth?: number
}

export const AvatarWithIdentifier = ({
  name,
  address,
  subtitle,
  size = '10',
  shortenAddressAsTitle = true,
  maxWidth,
}: Props) => {
  const primary = usePrimaryName({
    address,
    enabled: !name,
  })

  const _name = primary.data?.beautifiedName || name
  const _title = _name || (shortenAddressAsTitle ? shortenAddress(address) : address)
  const _subtitle = subtitle || (_name ? shortenAddress(address) : undefined)

  const isTitleFullAddress = !shortenAddressAsTitle && !_name

  const remPixelValue = useRemPixelValue()

  return (
    <Container>
      <AvatarWithZorb label={_title} address={address} name={_name} size={size} />
      <TextContainer>
        {isTitleFullAddress ? (
          <AddressTitleContainer data-testid="avatar-label-title">{_title}</AddressTitleContainer>
        ) : (
          <Typography fontVariant="bodyBold" data-testid="avatar-label-title">
            <Name maxWidth={maxWidth! - 3 * remPixelValue}>{_title}</Name>
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
