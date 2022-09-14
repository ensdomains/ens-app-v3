import packet from 'dns-packet'
import { useEffect } from 'react'
import styled, { css } from 'styled-components'
import { useNetwork, useProvider, useSigner } from 'wagmi'

import { DNSProver } from '@ensdomains/dnsprovejs'
import { Oracle as NewOracle } from '@ensdomains/dnssecoraclejs'
import { Typography } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { NameAvatar } from '@app/components/AvatarWithZorb'
import { useEns } from '@app/utils/EnsProvider'
import { emptyAddress } from '@app/utils/constants'
import { shortenAddress } from '@app/utils/utils'

import { DNS_OVER_HTTP_ENDPOINT, getDnsOwner } from './utils'

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

const tld = 'com'

// export const MAINNET_DNSREGISTRAR_ADDRESS = '0x58774Bb8acD458A640aF0B88238369A167546ef2'
// export const ROPSTEN_DNSREGISTRAR_ADDRESS = '0xdB328BA5FEcb432AF325Ca59E3778441eF5aa14F'

const name = 'leontalbert.com'

const submitProof = async (dnsRegistrarContractAddress, provider, dnsRegistrarContract, signer) => {
  const prover = DNSProver.create(DNS_OVER_HTTP_ENDPOINT)
  const result = await prover.queryWithProof('TXT', `_ens.${name}`)
  console.log('result: ', result)
  console.log('signer: ', signer)

  const dnsOwner = getDnsOwner(result)
  console.log('dnsOwner: ', dnsOwner)
  console.log('provider: ', provider)

  const registrarOracle = await dnsRegistrarContract.oracle()
  console.log('dnsRegistrarContractOracle: ', registrarOracle)

  // const oracleAddress = '0x21745FF62108968fBf5aB1E07961CC0FCBeB2364'
  // const testOracleAddress = '0x09635F643e140090A9A8Dcd712eD6285858ceBef'

  const oracle = new NewOracle(registrarOracle, provider)
  const anchors = await oracle.contract.anchors()
  console.log('anchors: ', anchors)
  const proofData = await oracle.getProofData(result)
  // console.log('proofData: ', proofData)

  const encodedName = `0x${packet.name.encode(name).toString('hex')}`
  const data = proofData.rrsets.map((x) => Object.values(x))
  const { proof } = proofData

  /*
  console.log('proof: ', proof)
  console.log('signer: ', signer)
  console.log('encodedName: ', encodedName)
  console.log('data: ', data)
  */

  // const tx = await dnsRegistrarContract.connect(signer).proveAndClaim(encodedName, data, proof, {
  //   gasLimit: 10000000,
  // })
  // const tx = await dnsRegistrarContract
  //   .connect(signer)
  //   .proveAndClaimWithResolver(
  //     encodedName,
  //     data,
  //     proof,
  //     '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
  //     '0xBe8563B89d31AD287c73da42848Bd7646172E0ba',
  //     {
  //       gasLimit: '10000000',
  //     },
  //   )

  // testnet
  const tx = await dnsRegistrarContract
    .connect(signer)
    .proveAndClaimWithResolver(
      encodedName,
      data,
      proof,
      '0x99bbA657f2BbC93c02D617f8bA121cB8Fc104Acf',
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      {
        gasLimit: 1000000,
      },
    )
  const receipt = await tx.wait()
  console.log('receipt: ', receipt)
}

export const ClaimDomain = ({ currentStep }) => {
  const { ready, contracts, getOwner } = useEns()
  const { chain } = useNetwork()
  const provider = useProvider()
  const { data: signer } = useSigner()

  useEffect(() => {
    const run = async () => {
      const dnsRegistrarContract = await contracts.getDNSRegistrar()
      const tldOwner = await getOwner(tld)
      console.log('toldOnwer: ', tldOwner)
      console.log('chain: ', chain)
      const oracleAddress = await dnsRegistrarContract.oracle()
      console.log('address: ', oracleAddress)

      submitProof(oracleAddress, provider, dnsRegistrarContract, signer)

      console.log('contracts: ', contracts)
    }
    if (ready && signer) {
      run()
    }

    // console.log('ens: ', ens.contracts)
  }, [ready, signer])

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
