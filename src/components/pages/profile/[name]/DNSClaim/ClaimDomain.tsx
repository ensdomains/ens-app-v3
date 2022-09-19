import packet from 'dns-packet'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import styled, { css } from 'styled-components'
import { useAccount, useProvider, useSigner } from 'wagmi'

import { DNSProver } from '@ensdomains/dnsprovejs'
import { Oracle as NewOracle } from '@ensdomains/dnssecoraclejs'
import { Typography } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { NameAvatar } from '@app/components/AvatarWithZorb'
import { useEns } from '@app/utils/EnsProvider'
import { shortenAddress } from '@app/utils/utils'

import { DNS_OVER_HTTP_ENDPOINT } from './utils'

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

export const ClaimDomain = ({ currentStep }) => {
  const { ready, contracts } = useEns()
  const provider = useProvider()
  const { data: signer } = useSigner()
  const router = useRouter()
  const { address } = useAccount()

  const name = router.query.name as string

  console.log('signer: ', signer)

  useEffect(() => {
    const run = async () => {
      const dnsRegistrarContract = await contracts.getDNSRegistrar()
      const resolverContract = await contracts.getPublicResolver()
      const prover = DNSProver.create(DNS_OVER_HTTP_ENDPOINT)
      const result = await prover.queryWithProof('TXT', `_ens.${name}`)
      const registrarOracle = await dnsRegistrarContract.oracle()

      const oracle = new NewOracle(registrarOracle, provider)
      const proofData = await oracle.getProofData(result)

      const encodedName = `0x${packet.name.encode(name).toString('hex')}`
      const data = proofData.rrsets.map((x) => Object.values(x))
      const { proof } = proofData

      const tx = await dnsRegistrarContract
        .connect(signer)
        .proveAndClaimWithResolver(encodedName, data, proof, resolverContract.address, address)

      const receipt = await tx.wait()
      console.log('receipt: ', receipt)
    }
    if (ready && signer) {
      run()
    }
  }, [contracts, name, provider, ready, signer, address])

  return (
    <Container>
      <Typography>Claim your domain</Typography>
      <Typography>You have verified your ownership and can claim this domain.</Typography>
      <GreyBox>
        <Typography>DNS Owner</Typography>
        <NamePillWithAddress name={name} label={`${name}-avatar`} network={1} address={address} />
      </GreyBox>
      <Spacer $height={4} />
      <GreyBox>
        <Typography>Estimated network cost</Typography>
        <Typography>000.4 ETH</Typography>
      </GreyBox>
    </Container>
  )
}
