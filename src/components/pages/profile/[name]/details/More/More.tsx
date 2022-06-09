import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { utils, BigNumber } from 'ethers'
import { useProvider, useNetwork } from 'wagmi'
import { Typography, Button } from '@ensdomains/thorin'
import { useRouter } from 'next/router'

import mq from '@app/mediaQuery'
import { useGetHistory } from '@app/hooks/useGetHistory'
import { useCopied } from '@app/hooks/useCopied'
import { IconCopyAnimated } from '@app/components/IconCopyAnimated'

import ResolverDetails from './ResolverDetails'
import Fuses from './Fuses'
import Accordion, { AccordionData } from './Accordion'

const RecordContainer = styled.button`
  ${({ theme, $hasBackground }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
    padding: ${theme.space['1.5']} ${theme.space['3']};
    border-radius: ${theme.radii.large};
    font-size: calc(${theme.fontSizes.small} - ${theme.space.px});
    transition: all 0.15s ease-in-out;
    cursor: pointer;

    ${$hasBackground ? `background: rgba(0, 0, 0, 0.04);` : ``}

    &:hover {
      background: rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }

    &:active {
      background: rgba(0, 0, 0, 0.04);
      transform: translateY(0);
    }

    ${mq.md.min`
      font-size: ${theme.fontSizes.small};
    `}
  `}
`

const RecordKey = styled(Typography)`
  ${({ theme }) => css`
    width: ${theme.space['20']};
    min-width: ${theme.space['20']};
    height: ${theme.space.full};
    align-self: flex-start;
    flex-direction: column;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    text-align: left;
    overflow-wrap: break-word;
    word-break: break-all;

    ${mq.md.min`
      width: ${theme.space['28']};
      min-width: ${theme.space['28']};
    `}
  `}
`

const CopyButtonWrapper = styled.div`
  ${({ $hasBackground }) => css`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    ${$hasBackground
      ? ``
      : `
      align-self: flex-start;
      padding-top: 3px;
    `}
  `}
`

const RecordValue = styled(Typography)<{ $fullWidth: boolean }>`
  ${({ theme, $fullWidth }) => css`
    max-width: calc(
      100% - ${$fullWidth ? '0px' : theme.space['20']} - ${theme.space['9']} -
        ${$fullWidth ? theme.space['2'] : theme.space['4']}
    );

    ${mq.md.min`
      max-width: calc(100% - ${$fullWidth ? '0px' : theme.space['28']} - ${
      theme.space['9']
    } - ${$fullWidth ? theme.space['2'] : theme.space['4']});
    `}

    ${mq.lg.min`
     max-width: 400px;
    `}

    ${mq.xl.min`
     max-width: 600px;
    `}
  `}
  overflow-wrap: break-word;
  text-align: left;
`

const InnerCopyButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => `
    width: ${theme.space['9']};
  `}
`

const LegacyType = styled(Typography)`
  ${({ theme }) => `
    color: ${theme.colors.textTertiary};
  `}
`

const RecordItem = ({
  itemKey,
  value,
  showLegacy,
  hasBackground = true,
}: {
  itemKey?: string
  value: string
  showLegacy?: boolean
  hasBackground?: boolean
}) => {
  const { copy, copied } = useCopied()

  return (
    <RecordContainer onClick={() => copy(value)} $hasBackground={hasBackground}>
      {itemKey && (
        <RecordKey weight="bold">
          {showLegacy ? itemKey.replace('_LEGACY', '') : itemKey}
          <LegacyType weight="bold" variant="label">
            {showLegacy && 'LEGACY'}
          </LegacyType>
        </RecordKey>
      )}
      <RecordValue $fullWidth={!itemKey}>{value}</RecordValue>
      <CopyButtonWrapper $hasBackground={hasBackground}>
        <InnerCopyButton>
          <IconCopyAnimated color="textTertiary" copied={copied} size="3.5" />
        </InnerCopyButton>
      </CopyButtonWrapper>
    </RecordContainer>
  )
}

const TokenId = () => {
  const router = useRouter()
  const { name } = router.query

  const label = name?.split('.')?.[0]
  const labelHash = utils.keccak256(utils.toUtf8Bytes(label))
  const tokenId = BigNumber.from(labelHash).toString()

  return (
    <div>
      <RecordItem itemKey="hex" value={labelHash} hasBackground={false} />
      <RecordItem itemKey="decimal" value={tokenId} hasBackground={false} />
    </div>
  )
}

function getEtherScanLink(networkId) {
  switch (networkId) {
    case 1:
    case '1':
      return 'https://etherscan.io/'
    case 3:
    case '3':
      return 'https://ropsten.etherscan.io/'
    case 4:
    case '4':
      return 'https://rinkeby.etherscan.io/'
    case 5:
    case '5':
      return 'https://goerli.etherscan.io/'
    default:
      return 'https://etherscan.io/'
  }
}

const RegistrationDateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const RegistrationDate = () => {
  const router = useRouter()
  const { name } = router.query
  const { history = {}, isLoading } = useGetHistory(name)
  const provider = useProvider()
  const {
    activeChain: { id },
  } = useNetwork()

  console.log('networkId: ', id)

  const [registrationData, setRegistrationData] = useState({
    registrationDate: null,
    transactionHash: null,
  })

  useEffect(() => {
    console.log('isLoading: ', isLoading)
    const getReigstartionData = async () => {
      if (!isLoading) {
        const registration = history?.registration?.[0]

        console.log('registration: ', registration)

        if (registration) {
          const registrationBlock = registration?.blockNumber
          const block = await provider.getBlock(registrationBlock)
          const unixTimestamp = block.timestamp
          console.log('registrationBlock: ', registrationBlock)
          console.log('history: ', history)
          console.log('block: ', block)

          const date = new Date(unixTimestamp * 1000)
          console.log('date: ', date.toString())

          setRegistrationData({
            registrationDate: date.toString(),
            transactionHash: registration.transactionHash,
          })
        }
      }
    }
    getReigstartionData()
  }, [name, provider, isLoading])

  console.log('registrationData: ', registrationData)
  console.log('link: ', `${getEtherScanLink(id)}`)

  return (
    <RegistrationDateContainer>
      <Typography>{registrationData.registrationDate}</Typography>
      <div style={{ maxWidth: 300 }}>
        <Button
          as="a"
          href={`${getEtherScanLink(id)}/tx/${
            registrationData.transactionHash
          }`}
          target="_blank"
          size="small"
        >
          View on etherscan
        </Button>
      </div>
    </RegistrationDateContainer>
  )
}

const data: AccordionData = [
  {
    title: 'Resolver',
    body: <ResolverDetails />,
  },
  {
    title: 'Fuses',
    body: <Fuses />,
  },
  {
    title: 'Token ID',
    body: <TokenId />,
  },
  {
    title: 'Registration Date',
    body: <RegistrationDate />,
  },
]

const MoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const More = () => {
  return (
    <MoreContainer>
      <Accordion data={data} />
    </MoreContainer>
  )
}

export default More
