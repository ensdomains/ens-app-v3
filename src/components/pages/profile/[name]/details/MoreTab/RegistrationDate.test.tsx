import { render, screen, waitFor } from '@app/test-utils'
import { useProvider, useNetwork } from 'wagmi'
import { useRouter } from 'next/router'
import { useGetHistory } from '@app/hooks/useGetHistory'

import { RegistrationDate } from './RegistrationDate'

jest.mock('next/router')
jest.mock('wagmi')
jest.mock('@app/hooks/useGetHistory')

describe('RegistrationDate', () => {
  const routerObject = {
    query: {
      name: 'nick.eth',
    },
  }

  const providerObject = {
    getBlock: () =>
      new Promise((resolve) => {
        resolve({ timestamp: 1654782805 })
      }),
  }

  const networkObject = { activeChain: { id: 3 } }

  const historyObject = {
    history: {
      registration: [
        {
          blockNumber: 0,
          transactionHash: 'transactionHash',
        },
      ],
    },
    isLoading: false,
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    useRouter.mockImplementation(() => {
      return {
        query: {
          name: 'nick.eth',
        },
      }
    })
    useProvider.mockImplementation(() => {
      return {}
    })
    useNetwork.mockImplementation(() => {
      return { activeChain: { id: 3 } }
    })
    useGetHistory.mockImplementation(() => {
      return {
        registration: [
          {
            blockNumber: 0,
            transactionHash: 'transactionHash',
          },
        ],
      }
    })
    render(<RegistrationDate />)
  })
  it('should render the correct registration date', async () => {
    useRouter.mockImplementation(() => {
      return routerObject
    })

    useProvider.mockImplementation(() => {
      return providerObject
    })
    useNetwork.mockImplementation(() => {
      return networkObject
    })

    useGetHistory.mockImplementation(() => {
      return historyObject
    })
    render(<RegistrationDate />)

    await waitFor(() => screen.getByText('Thu Jun 09 2022', { exact: false }))
  })
  it('should have correct link to etherscan', async () => {
    useRouter.mockImplementation(() => {
      return routerObject
    })

    useProvider.mockImplementation(() => {
      return providerObject
    })
    useNetwork.mockImplementation(() => {
      return networkObject
    })

    useGetHistory.mockImplementation(() => {
      return historyObject
    })
    render(<RegistrationDate />)

    await waitFor(() =>
      expect(
        screen.getByText('View on etherscan').closest('a'),
      ).toHaveAttribute(
        'href',
        'https://ropsten.etherscan.io/tx/transactionHash',
      ),
    )
  })
})
