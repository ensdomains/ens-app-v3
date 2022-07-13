import { useNFTImage } from '@app/hooks/useAvatar'
import { useChainId } from '@app/hooks/useChainId'
import { mockFunction, render, screen } from '@app/test-utils'
import { useEns } from '@app/utils/EnsProvider'
import { useTransaction } from '@app/utils/TransactionProvider'
import { useAccount, useSigner } from 'wagmi'
import { WrapperCallToAction } from './WrapperCallToAction'

jest.mock('@app/hooks/useAvatar')
jest.mock('@app/utils/TransactionProvider')
jest.mock('@app/utils/EnsProvider')
jest.mock('@app/hooks/useChainId')
jest.mock('wagmi')

const mockUseNFTImage = mockFunction(useNFTImage)
const mockUseTransaction = mockFunction(useTransaction)
const mockUseEns = mockFunction(useEns)
const mockUseChainId = mockFunction(useChainId)
const mockUseAccount = mockFunction(useAccount)
const mockUseSigner = mockFunction(useSigner)

const mockWrapName = jest.fn()
const mockSetRecords = jest.fn()
const mockGetProfile = jest.fn()
const mockContracts = {
  getPublicResolver: jest.fn(),
}

const mockSetCurrentTransaction = jest.fn()
const mockGetCurrentStep = jest.fn()

describe('WrapperCallToAction', () => {
  mockUseNFTImage.mockReturnValue({ isCompatible: true, image: '#' })
  mockUseTransaction.mockReturnValue({
    getCurrentStep: mockGetCurrentStep,
    setCurrentTransaction: mockSetCurrentTransaction,
  })
  mockUseEns.mockReturnValue({
    ready: true,
    wrapName: mockWrapName,
    setRecords: mockSetRecords,
    getProfile: mockGetProfile,
    contracts: mockContracts,
  })
  mockUseChainId.mockReturnValue(1)
  mockUseAccount.mockReturnValue({ data: {} })
  mockUseSigner.mockReturnValue({ data: {} })
  it('should render', () => {
    mockGetCurrentStep.mockReturnValue(0)
    render(<WrapperCallToAction name="test123.eth" />)
    expect(screen.getByTestId('wrapper-cta-container')).toBeVisible()
    expect(screen.getByTestId('wrapper-cta-button')).toHaveTextContent(
      'details.wrap.startLabel',
    )
  })
  it('should set the current transaction on click', () => {
    render(<WrapperCallToAction name="test123.eth" />)
    screen.getByTestId('wrapper-cta-button').click()
    expect(mockSetCurrentTransaction).toHaveBeenCalled()
  })
  it('should error on migrateProfile tx generation if getProfile returns undefined', async () => {
    mockGetProfile.mockReturnValue(undefined)
    render(<WrapperCallToAction name="test123.eth" />)
    screen.getByTestId('wrapper-cta-button').click()
    await expect(
      mockSetCurrentTransaction.mock.lastCall[0].data[0].generateTx(),
    ).rejects.toThrow('No profile found')
  })
  it('should create a setRecords transaction for the new resolver', async () => {
    mockUseSigner.mockReturnValue({ data: 'signer123' as any })
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
    await mockSetCurrentTransaction.mock.lastCall[0].data[0].generateTx()
    expect(mockSetRecords).toHaveBeenCalledWith('test123.eth', {
      records: {
        contentHash: 'ipfs://test-ipfs-hash',
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
            value: 'addr1',
          },
          {
            key: 'coin2',
            value: 'addr2',
          },
        ],
      },
      resolverAddress: '0x123',
      signer: 'signer123',
    })
  })
  it('should create a wrapName transaction', async () => {
    mockUseSigner.mockReturnValue({ data: 'signer123' as any })
    mockUseAccount.mockReturnValue({ data: { address: 'address123' } })
    render(<WrapperCallToAction name="test123.eth" />)
    screen.getByTestId('wrapper-cta-button').click()
    await mockSetCurrentTransaction.mock.lastCall[0].data[1].generateTx()
    expect(mockWrapName).toHaveBeenCalledWith('test123.eth', {
      wrappedOwner: 'address123',
      signer: 'signer123',
    })
  })
  it('should show button as resumable if step is greater than 0', () => {
    mockGetCurrentStep.mockReturnValue(1)
    render(<WrapperCallToAction name="test123.eth" />)
    expect(screen.getByTestId('wrapper-cta-button')).toHaveTextContent(
      'details.wrap.resumeLabel',
    )
  })
})
