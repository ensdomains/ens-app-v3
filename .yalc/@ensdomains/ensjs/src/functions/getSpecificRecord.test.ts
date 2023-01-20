import { ENS } from '..'
import setup from '../tests/setup'

let ensInstance: ENS

beforeAll(async () => {
  ;({ ensInstance } = await setup())
})

const dummyABI = [
  {
    type: 'event',
    anonymous: false,
    name: 'ABIChanged',
    inputs: [
      {
        type: 'bytes32',
        indexed: true,
      },
      {
        type: 'uint256',
        indexed: true,
      },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    name: 'VersionChanged',
    inputs: [
      {
        type: 'bytes32',
        indexed: true,
      },
      {
        type: 'uint64',
      },
    ],
  },
  {
    type: 'function',
    name: 'ABI',
    constant: true,
    stateMutability: 'view',
    payable: false,
    inputs: [
      {
        type: 'bytes32',
      },
      {
        type: 'uint256',
      },
    ],
    outputs: [
      {
        type: 'uint256',
      },
      {
        type: 'bytes',
      },
    ],
  },
  {
    type: 'function',
    name: 'clearRecords',
    constant: false,
    payable: false,
    inputs: [
      {
        type: 'bytes32',
      },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'recordVersions',
    constant: true,
    stateMutability: 'view',
    payable: false,
    inputs: [
      {
        type: 'bytes32',
      },
    ],
    outputs: [
      {
        type: 'uint64',
      },
    ],
  },
  {
    type: 'function',
    name: 'setABI',
    constant: false,
    payable: false,
    inputs: [
      {
        type: 'bytes32',
      },
      {
        type: 'uint256',
      },
      {
        type: 'bytes',
      },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'supportsInterface',
    constant: true,
    stateMutability: 'view',
    payable: false,
    inputs: [
      {
        type: 'bytes4',
      },
    ],
    outputs: [
      {
        type: 'bool',
      },
    ],
  },
]

describe('getSpecificRecord', () => {
  describe('getContentHash', () => {
    it('should return null for a non-existent name', async () => {
      const result = await ensInstance.getContentHash('test123123cool.eth')
      expect(result).toBeUndefined()
    })
    it('should return null for a name with no contenthash record', async () => {
      const result = await ensInstance.getContentHash('with-profile.eth')
      expect(result).toBeUndefined()
    })
    it('should return the contenthash for a name with the record set', async () => {
      const result = await ensInstance.getContentHash('with-contenthash.eth')
      expect(result).toMatchObject({
        protocolType: 'ipfs',
        decoded: 'bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y',
        error: undefined,
      })
    })
  })

  describe('getText', () => {
    it('should return a record from a key', async () => {
      const result = await ensInstance.getText(
        'with-profile.eth',
        'description',
      )
      expect(result).toBe('Hello2')
    })

    it('should return null for a non-existent key', async () => {
      const result = await ensInstance.getText(
        'with-profile.eth',
        'thiskeydoesntexist',
      )
      expect(result).toBeUndefined()
    })
  })

  describe('getAddr', () => {
    it('should return the ETH addr record if no coinType is provided', async () => {
      const result = await ensInstance.getAddr('with-profile.eth')
      expect(result).toBe('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')
    })
    it('should return the correct address based on a coin ID input as a number', async () => {
      const result = await ensInstance.getAddr('with-profile.eth', 61)
      expect((result as any).addr).toBe(
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      )
      expect((result as any).coin).toBe('ETC_LEGACY')
    })
    it('should return the correct address based on a coin ID input as a string', async () => {
      const result = await ensInstance.getAddr('with-profile.eth', '61')
      expect((result as any).addr).toBe(
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      )
      expect((result as any).coin).toBe('ETC_LEGACY')
    })
    it('should return the correct address based on a coin name', async () => {
      const result = await ensInstance.getAddr('with-profile.eth', 'ETC_LEGACY')
      expect((result as any).addr).toBe(
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      )
      expect((result as any).coin).toBe('ETC_LEGACY')
    })
    it('should return null for a non-existent coin', async () => {
      const result = await ensInstance.getAddr('with-profile.eth', 'BNB')
      expect(result).toBeUndefined()
    })
  })

  describe('getABI', () => {
    it('should return object for type 1 ABI', async () => {
      const result = await ensInstance.getABI('with-type-1-abi.eth')
      expect(result).toBeTruthy()
      if (result) {
        expect(result.contentType).toBe(1)
        expect(result.decoded).toBe(true)
        expect(result.abi).toMatchObject(dummyABI)
      }
    })
    it('should return object for type 2 ABI', async () => {
      const result = await ensInstance.getABI('with-type-2-abi.eth')
      expect(result).toBeTruthy()
      if (result) {
        expect(result.contentType).toBe(2)
        expect(result.decoded).toBe(true)
        expect(result.abi).toMatchObject(dummyABI)
      }
    })
    it('should return object for type 4 ABI', async () => {
      const result = await ensInstance.getABI('with-type-4-abi.eth')
      expect(result).toBeTruthy()
      if (result) {
        expect(result.contentType).toBe(4)
        expect(result.decoded).toBe(true)
        expect(result.abi).toMatchObject(dummyABI)
      }
    })
    it('should return unresolved URI for type 8 ABI', async () => {
      const result = await ensInstance.getABI('with-type-8-abi.eth')
      expect(result).toBeTruthy()
      if (result) {
        expect(result.contentType).toBe(8)
        expect(result.decoded).toBe(false)
        expect(result.abi).toBe('https://example.com')
      }
    })
    it('should return undefined if unsupported contentType', async () => {
      const result = await ensInstance.getABI('with-type-256-abi.eth')
      expect(result).toBeUndefined()
    })
  })
})
