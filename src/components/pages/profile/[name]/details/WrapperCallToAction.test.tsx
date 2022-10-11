import { mockFunction, render, screen } from '@app/test-utils'

import { ReactNode } from 'react'
import { useAccount } from 'wagmi'

import { useNFTImage } from '@app/hooks/useAvatar'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { useEns } from '@app/utils/EnsProvider'

import { WrapperCallToAction } from './WrapperCallToAction'

jest.mock('@app/hooks/useAvatar')
jest.mock('@app/transaction-flow/TransactionFlowProvider')
jest.mock('@app/utils/EnsProvider')
jest.mock('@app/hooks/useChainId')
jest.mock('wagmi')
jest.mock('@app/hooks/useNameDetails')
jest.mock('@app/assets/NightSky', () => ({
  NightSky: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

const mockUseNFTImage = mockFunction(useNFTImage)
const mockUseTransaction = mockFunction(useTransactionFlow)
const mockUseEns = mockFunction(useEns)
const mockUseChainId = mockFunction(useChainId)
const mockUseAccount = mockFunction(useAccount)
const mockUseNameDetails = mockFunction(useNameDetails)

const mockWrapName = {
  populateTransaction: jest.fn(),
}
const mockSetRecords = {
  populateTransaction: jest.fn(),
}
const mockGetProfile = jest.fn()
const mockContracts = {
  getPublicResolver: jest.fn(),
}

const mockCreateTransactionFlow = jest.fn()
const mockResumeTransactionFlow = jest.fn()
const mockGetResumeable = jest.fn()

describe('WrapperCallToAction', () => {
  mockUseNFTImage.mockReturnValue({ isCompatible: true, image: '#' })
  mockUseTransaction.mockReturnValue({
    resumeTransactionFlow: mockResumeTransactionFlow,
    createTransactionFlow: mockCreateTransactionFlow,
    getResumable: mockGetResumeable,
  })
  mockUseEns.mockReturnValue({
    ready: true,
    wrapName: mockWrapName,
    setRecords: mockSetRecords,
    getProfile: mockGetProfile,
    contracts: mockContracts,
  })
  mockUseChainId.mockReturnValue(1)
  mockUseAccount.mockReturnValue({ address: '0x123' })
  mockUseNameDetails.mockReturnValue({
    ownerData: { owner: '0x123' },
    profile: { resolverAddress: '0x456' },
    isLoading: false,
  })

  it('should render', () => {
    mockResumeTransactionFlow.mockReturnValue(0)
    render(<WrapperCallToAction name="test123.eth" />)
    expect(screen.getByTestId('wrapper-cta-container')).toBeVisible()
    expect(screen.getByTestId('wrapper-cta-button')).toHaveTextContent('details.wrap.startLabel')
  })
  it('should set the current transaction on click', () => {
    render(<WrapperCallToAction name="test123.eth" />)
    screen.getByTestId('wrapper-cta-button').click()
    expect(mockCreateTransactionFlow).toHaveBeenCalled()
  })
  it('should create a transaction flow for migrateProfile and wrapName', async () => {
    mockContracts.getPublicResolver.mockResolvedValue({ address: '0x123' })
    mockGetProfile.mockReturnValue({
      records: {
        contentHash: {
          protocolType: 'ipfs',
          decoded: 'test-ipfs-hash',
        },
        texts: [
          {
            key: 'test1',
            value: 'test1-value',
          },
          {
            key: 'test2',
            value: 'test2-value',
          },
        ],
        coinTypes: [
          {
            key: 'coin1',
            addr: 'addr1',
          },
          {
            key: 'coin2',
            addr: 'addr2',
          },
        ],
      },
    })
    render(<WrapperCallToAction name="test123.eth" />)
    screen.getByTestId('wrapper-cta-button').click()
    const args = mockCreateTransactionFlow.mock.lastCall

    expect(args[0]).toBe('wrapName-test123.eth')
    expect(args[1].transactions[0].name).toEqual('migrateProfile')
    expect(args[1].transactions[0].data).toEqual({ name: 'test123.eth' })
    expect(args[1].transactions[1].name).toEqual('wrapName')
    expect(args[1].transactions[1].data).toEqual({ name: 'test123.eth' })
  })

  it('should show button as resumable if step is greater than 0', () => {
    mockGetResumeable.mockReturnValue(1)
    render(<WrapperCallToAction name="test123.eth" />)
    expect(screen.getByTestId('wrapper-cta-button')).toHaveTextContent('details.wrap.resumeLabel')
  })
})
