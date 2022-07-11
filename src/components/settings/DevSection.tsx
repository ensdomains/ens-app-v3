/* eslint-disable @typescript-eslint/naming-convention */
import { useTransaction } from '@app/utils/TransactionProvider'
import { Button } from '@ensdomains/thorin'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { useSendTransaction } from 'wagmi'
import { SectionContainer, SectionHeading } from './Section'

export const DevSection = () => {
  const addTransaction = useAddRecentTransaction()
  const { setCurrentTransaction } = useTransaction()
  const { sendTransactionAsync } = useSendTransaction()

  const addSuccess = async () => {
    const transaction = await sendTransactionAsync({
      request: {
        to: '0x0000000000000000000000000000000000000000',
        value: '0',
      },
    })
    addTransaction({
      description: 'test',
      hash: transaction.hash,
      confirmations: transaction.confirmations || undefined,
    })
  }

  const sendName = async () => {
    setCurrentTransaction({
      actionName: 'sendName',
      generateTx: () =>
        sendTransactionAsync({
          request: {
            to: '0x0000000000000000000000000000000000000000',
            value: '0',
          },
        }),
      displayItems: [
        {
          label: 'To',
          value: '0x3F45BcB2DFBdF0AD173A9DfEe3b932aa2a31CeB3',
          type: 'address',
        },
        {
          label: 'Name',
          value: 'taytems.eth',
          type: 'name',
        },
        {
          label: 'Info',
          value: 'Set the controller and registrant of the name',
        },
      ],
    })
  }

  const addFailure = async () => {
    const transaction = await sendTransactionAsync({
      request: {
        to: '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e',
        data: '0x1231237123423423',
        gasLimit: '1000000',
      },
    })
    addTransaction({
      description: 'test',
      hash: transaction.hash,
      confirmations: transaction.confirmations || undefined,
    })
  }

  const startAutoMine = async () => {
    await fetch('http://localhost:8545', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'miner_start',
        params: [],
        id: 1,
      }),
    })
  }

  const stopAutoMine = async () => {
    await fetch('http://localhost:8545', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'miner_stop',
        params: [],
        id: 1,
      }),
    })
  }

  return (
    <SectionContainer>
      <SectionHeading variant="large" weight="bold">
        Developer
      </SectionHeading>
      <Button onClick={() => addSuccess()}>Add Successful Transaction</Button>
      <Button onClick={() => sendName()}>Test Send Name</Button>
      <Button onClick={() => addFailure()}>Add Failing Transaction</Button>
      <Button onClick={() => startAutoMine()}>Start Automine</Button>
      <Button onClick={() => stopAutoMine()}>Stop Automine</Button>
    </SectionContainer>
  )
}
