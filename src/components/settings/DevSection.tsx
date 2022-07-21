/* eslint-disable @typescript-eslint/naming-convention */
import { useTransaction } from '@app/utils/TransactionProvider'
import { Button } from '@ensdomains/thorin'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { BigNumber } from 'ethers'
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
      description: JSON.stringify({ action: 'test' }),
      hash: transaction.hash,
      confirmations: transaction.confirmations || undefined,
    })
  }

  const sendName = async () => {
    setCurrentTransaction('dev-sendName', async () => ({
      data: [
        {
          actionName: 'sendName',
          transaction: {
            to: '0x0000000000000000000000000000000000000000',
            value: BigNumber.from('0'),
          },
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
          ],
        },
      ],
    }))
  }

  const addFailure = async () => {
    const transaction = await sendTransactionAsync({
      request: {
        to: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
        data: '0x1231237123423423',
        gasLimit: '1000000',
      },
    })
    addTransaction({
      description: JSON.stringify({ action: 'test' }),
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
