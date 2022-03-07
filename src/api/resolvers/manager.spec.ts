import { emptyAddress } from '@app/utils/utils'
import type { getNamehash as GetNamehash } from '@ensdomains/ui'
import { asMock } from '__tests__/helpers'

jest.mock('@ensdomains/ui', () => ({
  ...jest.requireActual('@ensdomains/ui'),
  getNamehash: jest.fn(),
  encodeContenthash: jest.fn(),
}))

jest.mock('@app/api/resolverUtils', () => ({
  ...jest.requireActual('@app/api/resolverUtils'),
  sendHelper: jest.fn(),
  sendHelperArray: jest.fn(),
}))

const { getNamehash: _getNamehash } = require('@ensdomains/ui')
const {
  handleMultipleTransactions,
  handleSingleTransaction,
} = require('./manager')

const getNamehash = asMock(_getNamehash as typeof GetNamehash)

describe('handleMultipleTransactions', () => {
  it('should set contentHash to emptyAddress if value is emptyAddress', () => {
    const mockResolverInstanceFn = jest.fn()
    mockResolverInstanceFn.mockImplementation(() => 'contentTx')

    const resolverInstance = {
      setContenthash: mockResolverInstanceFn,
    }

    const mockRecord = {
      contractFn: 'setContenthash',
      value: emptyAddress,
    }

    getNamehash.mockImplementation(() => 'namehash')
    handleSingleTransaction('name', mockRecord, resolverInstance)

    expect(mockResolverInstanceFn).toBeCalledWith('namehash', emptyAddress)
  })
})

describe('handleMultipleTransactions', () => {
  it('should set contentHash to emptyAddress if value is emptyAddress', () => {
    const mockResolverInstanceFn = jest.fn()
    mockResolverInstanceFn.mockImplementation(() => 'contentTx')

    const mockEncodeFunctionData = jest.fn()

    const mockMulticallFn = jest.fn()

    const resolverInstance = {
      setContenthash: mockResolverInstanceFn,
      interface: {
        encodeFunctionData: mockEncodeFunctionData,
        multicall: mockMulticallFn,
      },
    }

    const mockRecord = {
      contractFn: 'setContenthash',
      value: emptyAddress,
    }

    getNamehash.mockImplementation(() => 'namehash')

    handleMultipleTransactions('name', [mockRecord], resolverInstance)
    expect(mockEncodeFunctionData.mock.calls[0][1]).toEqual([
      'namehash',
      emptyAddress,
    ])
  })
})
