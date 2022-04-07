import { useEns } from '@app/utils/EnsProvider'
import { ensNftImageUrl, shortenAddress } from '@app/utils/utils'
import { Box, Stack, Typography, vars } from '@ensdomains/thorin'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { Fragment, useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import { CopyButton } from '../CopyButton'

const StyledNftBox = styled(Box)<{ $loading: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ $loading }) =>
    $loading ? vars.colors.accentGradient : 'none'};
  border-radius: ${vars.radii['2xLarge']};
  margin-bottom: ${vars.space['8']};
  & > span {
    border-radius: ${vars.radii['2xLarge']};
  }
`

const HoverableSelfName = styled(Box)<{ name: string }>`
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
    color: ${vars.colors.text};
  }
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
  const { data } = useQuery(`name-${address}`, () => getName(address))

  const [{ data: { ens } = { ens: undefined } }] = useAccount()

  const highlightName = isSelf || (data && data.name)

  const TopElement = () => {
    if (isSelf) {
      if (ens?.name && ens.name.length > 0) {
        return (
          <HoverableSelfName name={ens?.name}>
            {t('yourWallet')}
          </HoverableSelfName>
        )
      }
      return t('yourWallet')
    }
    return (data && data.name) || 'No ENS Name'
  }

  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap="2">
      <Box display="flex" flexDirection="column" alignItems="flex-end" gap="1">
        <Typography color={highlightName ? 'textSecondary' : 'textTertiary'}>
          <TopElement />
        </Typography>
        <Typography color={highlightName ? 'textTertiary' : 'textSecondary'}>
          {shortenAddress(address)}
        </Typography>
      </Box>
      <CopyButton value={address} />
    </Box>
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
    <Box>
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
      <Box marginTop="4">
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
                  <Box
                    marginX="2"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    fontWeight="bold"
                  >
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
                  </Box>
                  {inx !== arr.length - 1 && (
                    <Box height="0.25" backgroundColor="foregroundSecondary" />
                  )}
                </Fragment>
              ),
          )}
        </Stack>
      </Box>
    </Box>
  )
}
