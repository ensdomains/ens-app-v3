import { useRouter } from 'next/router'
import { useNetwork, useProvider } from 'wagmi'

import { useGetHistory } from '@app/hooks/useGetHistory'
import { mockFunction, render, screen, waitFor } from '@app/test-utils'

import { RegistrationDate } from './RegistrationDate'

jest.mock('next/router')
jest.mock('@app/hooks/useGetHistory')

const mockUseRouter = mockFunction(useRouter)
const mockUseProvider = mockFunction(useProvider)
const mockUseNetwork = mockFunction(useNetwork)
const mockUseGetHistory = mockFunction(useGetHistory)

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

  const networkObject = { chain: { id: 3 } }

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
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    mockUseProvider.mockReturnValue({})
    mockUseNetwork.mockReturnValue({ chain: { id: 3 } })
    mockUseGetHistory.mockReturnValue({
      history: {
        registration: [
          {
            blockNumber: 0,
            transactionHash: 'transactionHash',
          },
        ],
      },
    })
    render(<RegistrationDate />)
  })
  it('should render the correct registration date', async () => {
    mockUseRouter.mockReturnValue(routerObject)
    mockUseProvider.mockReturnValue(providerObject)
    mockUseNetwork.mockReturnValue(networkObject)
    mockUseGetHistory.mockReturnValue(historyObject)

    render(<RegistrationDate />)

    await waitFor(() => screen.getByText('Thu Jun 09 2022', { exact: false }))
  })
  it('should have correct link to etherscan', async () => {
    mockUseRouter.mockReturnValue(routerObject)
    mockUseProvider.mockReturnValue(providerObject)
    mockUseNetwork.mockReturnValue(networkObject)
    mockUseGetHistory.mockReturnValue(historyObject)

    render(<RegistrationDate />)

    await waitFor(() =>
      expect(screen.getByText('transaction.viewEtherscan').closest('a')).toHaveAttribute(
        'href',
        'https://ropsten.etherscan.io/tx/transactionHash',
      ),
    )
  })
})
