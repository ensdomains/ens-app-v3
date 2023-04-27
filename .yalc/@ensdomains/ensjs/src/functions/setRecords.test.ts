import { toUtf8String } from 'ethers/lib/utils'
import { ENS } from '..'
import setup from '../tests/setup'
import { hexEncodeName } from '../utils/hexEncodedName'
import { namehash } from '../utils/normalise'

const dummyABI = [
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

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']

beforeAll(async () => {
  ;({ ensInstance, revert } = await setup())
})

afterAll(async () => {
  await revert()
})

describe('setRecords', () => {
  it('should return a transaction to the resolver and set successfully', async () => {
    const tx = await ensInstance.setRecords('test123.eth', {
      records: {
        coinTypes: [
          {
            key: 'ETC_LEGACY',
            value: '0x42D63ae25990889E35F215bC95884039Ba354115',
          },
        ],
        texts: [{ key: 'foo', value: 'bar' }],
        abi: {
          data: dummyABI,
        },
      },
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const universalResolver =
      await ensInstance.contracts!.getUniversalResolver()!
    const publicResolver = await ensInstance.contracts!.getPublicResolver()!
    const encodedText = await universalResolver['resolve(bytes,bytes)'](
      hexEncodeName('test123.eth'),
      publicResolver.interface.encodeFunctionData('text', [
        namehash('test123.eth'),
        'foo',
      ]),
    )
    const encodedAddr = await universalResolver['resolve(bytes,bytes)'](
      hexEncodeName('test123.eth'),
      publicResolver.interface.encodeFunctionData('addr(bytes32,uint256)', [
        namehash('test123.eth'),
        '61',
      ]),
    )
    const [resultText] = publicResolver.interface.decodeFunctionResult(
      'text',
      encodedText[0],
    )
    const [resultAddr] = publicResolver.interface.decodeFunctionResult(
      'addr(bytes32,uint256)',
      encodedAddr[0],
    )
    expect(resultText).toBe('bar')
    expect(resultAddr).toBe(
      '0x42D63ae25990889E35F215bC95884039Ba354115'.toLowerCase(),
    )

    const encodedABI = await universalResolver['resolve(bytes,bytes)'](
      hexEncodeName('test123.eth'),
      publicResolver.interface.encodeFunctionData('ABI', [
        namehash('test123.eth'),
        '0x01',
      ]),
    )
    const [contentType, resultABI] =
      publicResolver.interface.decodeFunctionResult('ABI', encodedABI[0])
    expect(contentType.toNumber()).toBe(1)
    expect(toUtf8String(resultABI)).toBe(JSON.stringify(dummyABI))
  })

  describe('record types', () => {
    it('should be able to set and delete a cointype for a wrapped name', async () => {
      const tx = await ensInstance.setRecords('wrapped.eth', {
        records: {
          coinTypes: [
            {
              key: 'ETH',
              value: '0x42D63ae25990889E35F215bC95884039Ba354115',
            },
          ],
        },
        addressOrIndex: 1,
      })
      expect(tx).toBeTruthy()
      await tx.wait()

      const universalResolver =
        await ensInstance.contracts!.getUniversalResolver()!
      const publicResolver = await ensInstance.contracts!.getPublicResolver()!

      const encodedAddr = await universalResolver['resolve(bytes,bytes)'](
        hexEncodeName('wrapped.eth'),
        publicResolver.interface.encodeFunctionData('addr(bytes32,uint256)', [
          namehash('wrapped.eth'),
          '60',
        ]),
      )
      const [resultAddr] = publicResolver.interface.decodeFunctionResult(
        'addr(bytes32,uint256)',
        encodedAddr[0],
      )
      expect(resultAddr).toBe(
        '0x42D63ae25990889E35F215bC95884039Ba354115'.toLowerCase(),
      )

      const tx2 = await ensInstance.setRecords('wrapped.eth', {
        records: {
          coinTypes: [
            {
              key: 'ETH',
              value: '',
            },
          ],
        },
        addressOrIndex: 1,
      })
      expect(tx2).toBeTruthy()
      await tx2.wait()

      const encodedAddr2 = await universalResolver['resolve(bytes,bytes)'](
        hexEncodeName('wrapped.eth'),
        publicResolver.interface.encodeFunctionData('addr(bytes32,uint256)', [
          namehash('wrapped.eth'),
          '60',
        ]),
      )
      const [resultAddr2] = publicResolver.interface.decodeFunctionResult(
        'addr(bytes32,uint256)',
        encodedAddr2[0],
      )
      expect(resultAddr2).toBe(
        '0x0000000000000000000000000000000000000000'.toLowerCase(),
      )
    })

    it('should be able to set and delete a contenthash for a wrapped name', async () => {
      const tx = await ensInstance.setRecords('wrapped.eth', {
        records: {
          contentHash: 'ipfs://QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4',
        },
        addressOrIndex: 1,
      })
      expect(tx).toBeTruthy()
      await tx.wait()

      const universalResolver =
        await ensInstance.contracts!.getUniversalResolver()!
      const publicResolver = await ensInstance.contracts!.getPublicResolver()!

      const encodedData = await universalResolver['resolve(bytes,bytes)'](
        hexEncodeName('wrapped.eth'),
        publicResolver.interface.encodeFunctionData('contenthash', [
          namehash('wrapped.eth'),
        ]),
      )
      const [resultData] = publicResolver.interface.decodeFunctionResult(
        'contenthash',
        encodedData[0],
      )
      expect(resultData).toBe(
        '0xe3010170122029f2d17be6139079dc48696d1f582a8530eb9805b561eda517e22a892c7e3f1f'.toLowerCase(),
      )

      const tx2 = await ensInstance.setRecords('wrapped.eth', {
        records: {
          contentHash: '',
        },
        addressOrIndex: 1,
      })
      expect(tx2).toBeTruthy()
      await tx2.wait()

      const encodedAddr2 = await universalResolver['resolve(bytes,bytes)'](
        hexEncodeName('wrapped.eth'),
        publicResolver.interface.encodeFunctionData('contenthash', [
          namehash('wrapped.eth'),
        ]),
      )
      const [resultAddr2] = publicResolver.interface.decodeFunctionResult(
        'contenthash',
        encodedAddr2[0],
      )
      expect(resultAddr2).toBe('0x'.toLowerCase())
    })
  })
})
