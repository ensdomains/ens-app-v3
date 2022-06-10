import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useProvider, useNetwork } from 'wagmi'
import { Typography, Button } from '@ensdomains/thorin'
import { useRouter } from 'next/router'

import { useGetHistory } from '@app/hooks/useGetHistory'
import mq from '@app/mediaQuery'

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
  flex-direction: column;
  gap: 10px;

  ${mq.sm.min`
  flex-direction: row;
    `}
`

export const RegistrationDate = () => {
  const router = useRouter()
  const { name } = router.query
  const { history = {}, isLoading } = useGetHistory(name)
  const provider = useProvider()
  const {
    activeChain: { id },
  } = useNetwork()

  const [registrationData, setRegistrationData] = useState({
    registrationDate: null,
    transactionHash: null,
  })

  useEffect(() => {
    const getReigstartionData = async () => {
      if (!isLoading) {
        const registration = history?.registration?.[0]

        if (registration) {
          const registrationBlock = registration?.blockNumber
          const block = await provider.getBlock(registrationBlock)
          const unixTimestamp = block.timestamp

          const date = new Date(unixTimestamp * 1000)

          setRegistrationData({
            registrationDate: date.toString(),
            transactionHash: registration.transactionHash,
          })
        }
      }
    }
    console.log('name: ', name)
    getReigstartionData()
  }, [name, isLoading, history, provider])

  return (
    <RegistrationDateContainer>
      <Typography>{registrationData.registrationDate}</Typography>
      <div style={{ maxWidth: 300 }}>
        <Button
          as="a"
          href={`${getEtherScanLink(id)}tx/${registrationData.transactionHash}`}
          target="_blank"
          size="small"
        >
          View on etherscan
        </Button>
      </div>
    </RegistrationDateContainer>
  )
}
