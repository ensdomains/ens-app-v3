import { useEffect } from 'react'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { NameAvatar } from '@app/components/AvatarWithZorb'
import { useEns } from '@app/utils/EnsProvider'
import { shortenAddress } from '@app/utils/utils'

const Container = styled.div(
  ({ theme }) => css`
    text-align: center;
  `,
)

const GreyBox = styled.div(
  ({ theme }) => css`
    background: ${theme.colors.backgroundSecondary};
    border-radius: 10px;
    padding: 20px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  `,
)

const TextContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
  `,
)

const NamePillContainer = styled.div(
  ({ theme }) => css`
    height: ${theme.space['9']};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
  `,
)

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['7']};
    height: ${theme.space['7']};
  `,
)

export const NamePillWithAddress = ({
  name,
  network,
  address,
}: {
  name: string
  network: number
  address: string
}) => {
  return (
    <NamePillContainer>
      <TextContainer>
        <Typography {...{ weight: 'bold' }}>{name}</Typography>
        <Typography {...{ variant: 'small', weight: 'light', color: 'textTertiary' }}>
          {shortenAddress(address)}
        </Typography>
      </TextContainer>
      <AvatarWrapper>
        <NameAvatar label={name} name={name} network={network} />
      </AvatarWrapper>
    </NamePillContainer>
  )
}

const value = 'leontalbert.eth'
const address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

// const getDnsecTldOnwer = async (ens, tld, networkId) {
//   const tldowner = (await ens.getOwner(tld)).toLocaleLowerCase()
//   if (parseInt(tldowner) !== 0) return tldowner
//   switch (networkId) {
//     case 1:
//       return MAINNET_DNSREGISTRAR_ADDRESS
//     case 3:
//       return ROPSTEN_DNSREGISTRAR_ADDRESS
//     default:
//       return emptyAddress
//   }
// }

export const ClaimDomain = ({ currentStep }) => {
  useEffect(() => {
    const { ready, getOwner } = useEns()
  }, [])

  return (
    <Container>
      <Typography>Claim your domain</Typography>
      <Typography>You have verified your ownership and can claim this domain.</Typography>
      <GreyBox>
        <Typography>DNS Owner</Typography>
        <NamePillWithAddress name={value} label={`${value}-avatar`} network={1} address={address} />
      </GreyBox>
      <Spacer $height={4} />
      <GreyBox>
        <Typography>Estimated network cost</Typography>
        <Typography>000.4 ETH</Typography>
      </GreyBox>
    </Container>
  )
}
