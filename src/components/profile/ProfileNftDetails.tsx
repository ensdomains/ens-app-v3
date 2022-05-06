import { useEns } from '@app/utils/EnsProvider'
import { ensNftImageUrl, shortenAddress } from '@app/utils/utils'
import { tokens, Typography } from '@ensdomains/thorin'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { Fragment, useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { CopyButton } from '../CopyButton'

const StyledNftBox = styled.div<{ $loading: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ $loading, theme }) =>
    $loading ? tokens.colors[theme.mode].accentGradient : 'none'};
  border-radius: ${tokens.radii['2xLarge']};
  margin-bottom: ${tokens.space['8']};
  & > span {
    border-radius: ${tokens.radii['2xLarge']};
  }
`

const HoverableSelfName = styled.div<{ name: string }>`
  position: relative;
  visibility: visible;
  transition: all 0.15s ease-in-out 0.15s;
  color: inherit;

  &::before {
    transition: all 0.15s ease-in-out 0.15s;
    content: ${({ name }) => `"${name}"`};
    visibility: hidden;
    color: transparent;
    position: absolute;
    right: 0;
  }

  &:hover {
    transition: all 0.15s ease-in-out;
    visibility: hidden;
    color: transparent;
  }

  &:hover::before {
    transition: all 0.15s ease-in-out;
    visibility: visible;
    color: ${({ theme }) => tokens.colors[theme.mode].text};
  }
`

const HoverableSelfNameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-gap: ${tokens.space['2']};
  gap: ${tokens.space['2']};
`

const HoverableSelfNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-gap: ${tokens.space['1']};
  gap: ${tokens.space['1']};
`

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space['4']};
  flex-gap: ${tokens.space['4']};
`

const ItemContainer = styled.div`
  margin: 0 ${tokens.space['2']};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
`

const HorizontalLine = styled.div`
  height: 1px;
  background-color: ${({ theme }) =>
    tokens.colors[theme.mode].foregroundSecondary};
`

const AddressBox = ({
  address,
  isSelf,
}: {
  address: string
  isSelf: boolean
}) => {
  const { t } = useTranslation('profile')

  const { getName } = useEns()
  const { data } = useQuery(['getName', address], () => getName(address), {
    enabled: !!address,
  })

  const highlightName = isSelf || (data && data.name)

  const TopElement = () => {
    if (isSelf) {
      if (data?.name && data.name.length > 0) {
        return (
          <HoverableSelfName name={data?.name}>
            {t('yourWallet')}
          </HoverableSelfName>
        )
      }
      return t('yourWallet')
    }
    return (data && data.name) || 'No ENS Name'
  }

  return (
    <HoverableSelfNameWrapper>
      <HoverableSelfNameContainer>
        <Typography color={highlightName ? 'textSecondary' : 'textTertiary'}>
          <TopElement />
        </Typography>
        <Typography color={highlightName ? 'textTertiary' : 'textSecondary'}>
          {shortenAddress(address)}
        </Typography>
      </HoverableSelfNameContainer>
      <CopyButton value={address} />
    </HoverableSelfNameWrapper>
  )
}

export const ProfileNftDetails = ({
  name,
  selfAddress,
  network,
  expiryDate,
  ownerData,
}: {
  name: string
  selfAddress?: string
  network: string
  expiryDate: Date
  ownerData: {
    owner: string
    registrant?: string
  }
}) => {
  const [nftLoading, setNftLoading] = useState(true)
  const { t: tc } = useTranslation('common')
  const { contracts } = useEns()
  const { data: baseRegistrarAddress } = useQuery(
    'base-registrar-address',
    () => contracts?.getBaseRegistrar()!.then((c) => c.address),
  )

  return (
    <div>
      <StyledNftBox $loading={nftLoading}>
        <Image
          onLoadingComplete={() => setNftLoading(false)}
          src="/"
          loader={() =>
            ensNftImageUrl(name, network, baseRegistrarAddress || '')
          }
          width={270}
          height={270}
        />
      </StyledNftBox>
      <div style={{ marginTop: tokens.space['4'] }}>
        <Stack>
          {[
            ...[
              expiryDate
                ? {
                    label: tc('name.expires'),
                    type: 'text',
                    value: `${expiryDate.toLocaleDateString(undefined, {
                      month: 'long',
                    })} ${expiryDate.getDate()}, ${expiryDate.getFullYear()}`,
                  }
                : null,
            ],
            {
              label: tc('name.registrant'),
              type: 'address',
              value: ownerData.registrant,
            },
            {
              label: tc('name.controller'),
              type: 'address',
              value: ownerData.owner,
            },
          ].map(
            (item, inx, arr) =>
              item &&
              item.value && (
                <Fragment key={item.label}>
                  <ItemContainer>
                    <Typography color="textTertiary">{item.label}</Typography>
                    {item.type === 'address' ? (
                      <AddressBox
                        address={item.value}
                        isSelf={item.value === selfAddress}
                      />
                    ) : (
                      <Typography color="textSecondary">
                        {item.value}
                      </Typography>
                    )}
                  </ItemContainer>
                  {inx !== arr.length - 1 && <HorizontalLine />}
                </Fragment>
              ),
          )}
        </Stack>
      </div>
    </div>
  )
}
