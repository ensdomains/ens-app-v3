import { formatsByName } from '@ensdomains/address-encoder'
import { decodeFirst } from 'cbor'
import { BigNumber } from 'ethers'
import { arrayify, toUtf8String } from 'ethers/lib/utils'
import { inflate } from 'pako'
import { ENS } from '..'
import setup from '../tests/setup'
import { decodeContenthash } from '../utils/contentHash'
import { hexEncodeName } from '../utils/hexEncodedName'
import { namehash } from '../utils/normalise'
import { generateABIInput } from '../utils/recordHelpers'

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']

beforeAll(async () => {
  ;({ ensInstance, revert } = await setup())
})

afterEach(async () => {
  await revert()
})

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

describe('setRecord', () => {
  it('should allow a text record set', async () => {
    const tx = await ensInstance.setRecord('test123.eth', {
      type: 'text',
      record: { key: 'foo', value: 'bar' },
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
    const [resultText] = publicResolver.interface.decodeFunctionResult(
      'text',
      encodedText[0],
    )
    expect(resultText).toBe('bar')
  })
  it('should allow an address record set', async () => {
    const tx = await ensInstance.setRecord('test123.eth', {
      type: 'addr',
      record: {
        key: 'ETC_LEGACY',
        value: '0x42D63ae25990889E35F215bC95884039Ba354115',
      },
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const universalResolver =
      await ensInstance.contracts!.getUniversalResolver()!
    const publicResolver = await ensInstance.contracts!.getPublicResolver()!
    const encodedAddr = await universalResolver['resolve(bytes,bytes)'](
      hexEncodeName('test123.eth'),
      publicResolver.interface.encodeFunctionData('addr(bytes32,uint256)', [
        namehash('test123.eth'),
        '61',
      ]),
    )
    const [resultAddr] = publicResolver.interface.decodeFunctionResult(
      'addr(bytes32,uint256)',
      encodedAddr[0],
    )
    expect(resultAddr).toBe(
      '0x42D63ae25990889E35F215bC95884039Ba354115'.toLowerCase(),
    )
  })
  it('should allow an empty address record to be set', async () => {
    const setRecord = await ensInstance.setRecord('test123.eth', {
      type: 'addr',
      record: {
        key: 'BNB',
        value: 'bnb1rrhqmj4fa28vlrnm89f6gjsgz3ya6h40ptckj0',
      },
      addressOrIndex: 1,
    })
    await setRecord.wait()

    const universalResolver =
      await ensInstance.contracts!.getUniversalResolver()!
    const publicResolver = await ensInstance.contracts!.getPublicResolver()!
    const getEncodedAddr = () =>
      universalResolver['resolve(bytes,bytes)'](
        hexEncodeName('test123.eth'),
        publicResolver.interface.encodeFunctionData('addr(bytes32,uint256)', [
          namehash('test123.eth'),
          '714',
        ]),
      )
    const encodedAddr = await getEncodedAddr()
    const [resultAddr] = publicResolver.interface.decodeFunctionResult(
      'addr(bytes32,uint256)',
      encodedAddr[0],
    )
    // record as hex
    expect(resultAddr).toBe('0x18ee0dcaa9ea8ecf8e7b3953a44a081449dd5eaf')

    const tx = await ensInstance.setRecord('test123.eth', {
      type: 'addr',
      record: {
        key: 'BNB',
        value: '',
      },
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const encodedEmptyAddr = await getEncodedAddr()
    const [resultEmptyAddr] = publicResolver.interface.decodeFunctionResult(
      'addr(bytes32,uint256)',
      encodedEmptyAddr[0],
    )
    // record as hex
    expect(resultEmptyAddr).toBe('0x')
  })

  Object.keys(formatsByName).forEach((coinName) => {
    it(`should allow an empty address record for ${coinName}`, async () => {
      const tx = await ensInstance.setRecord('test123.eth', {
        type: 'addr',
        record: {
          key: coinName,
          value: '',
        },
        addressOrIndex: 1,
      })
      expect(tx).toBeTruthy()
      await tx.wait()
    })
  })

  it('should allow a contenthash record set', async () => {
    const tx = await ensInstance.setRecord('test123.eth', {
      type: 'contentHash',
      record:
        'ipns://k51qzi5uqu5dgox2z23r6e99oqency055a6xt92xzmyvpz8mwz5ycjavm0u150',
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const universalResolver =
      await ensInstance.contracts!.getUniversalResolver()!
    const publicResolver = await ensInstance.contracts!.getPublicResolver()!
    const encodedContent = await universalResolver['resolve(bytes,bytes)'](
      hexEncodeName('test123.eth'),
      publicResolver.interface.encodeFunctionData('contenthash', [
        namehash('test123.eth'),
      ]),
    )
    const [resultContent] = publicResolver.interface.decodeFunctionResult(
      'contenthash',
      encodedContent[0],
    )
    const content = decodeContenthash(resultContent)
    expect(content.decoded).toBe(
      'k51qzi5uqu5dgox2z23r6e99oqency055a6xt92xzmyvpz8mwz5ycjavm0u150',
    )
    expect(content.protocolType).toBe('ipns')
  })
  it('should allow an abi record to be set from an object', async () => {
    const tx = await ensInstance.setRecord('test123.eth', {
      type: 'abi',
      record: {
        data: dummyABI,
      },
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const universalResolver =
      await ensInstance.contracts!.getUniversalResolver()!
    const publicResolver = await ensInstance.contracts!.getPublicResolver()!
    const encodedRes = await universalResolver['resolve(bytes,bytes)'](
      hexEncodeName('test123.eth'),
      publicResolver.interface.encodeFunctionData('ABI', [
        namehash('test123.eth'),
        '0x0f',
      ]),
    )
    const [contentType, encodedABI] =
      publicResolver.interface.decodeFunctionResult('ABI', encodedRes[0]) as [
        BigNumber,
        string,
      ]

    expect(contentType.toNumber()).toBe(1)
    expect(toUtf8String(encodedABI)).toBe(JSON.stringify(dummyABI))
  })
  it('should allow a zlib encoded abi record to be set', async () => {
    const encodedInput = await generateABIInput('zlib', dummyABI)
    const tx = await ensInstance.setRecord('test123.eth', {
      type: 'abi',
      record: encodedInput,
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const universalResolver =
      await ensInstance.contracts!.getUniversalResolver()!
    const publicResolver = await ensInstance.contracts!.getPublicResolver()!
    const encodedRes = await universalResolver['resolve(bytes,bytes)'](
      hexEncodeName('test123.eth'),
      publicResolver.interface.encodeFunctionData('ABI', [
        namehash('test123.eth'),
        '0x0f',
      ]),
    )
    const [contentType, encodedABI] =
      publicResolver.interface.decodeFunctionResult('ABI', encodedRes[0]) as [
        BigNumber,
        string,
      ]

    expect(contentType.toNumber()).toBe(2)
    expect(inflate(arrayify(encodedABI), { to: 'string' })).toBe(
      JSON.stringify(dummyABI),
    )
  })
  it('should allow a cbor encoded abi record to be set', async () => {
    const encodedInput = await generateABIInput('cbor', dummyABI)
    const tx = await ensInstance.setRecord('test123.eth', {
      type: 'abi',
      record: encodedInput,
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const universalResolver =
      await ensInstance.contracts!.getUniversalResolver()!
    const publicResolver = await ensInstance.contracts!.getPublicResolver()!
    const encodedRes = await universalResolver['resolve(bytes,bytes)'](
      hexEncodeName('test123.eth'),
      publicResolver.interface.encodeFunctionData('ABI', [
        namehash('test123.eth'),
        '0x0f',
      ]),
    )
    const [contentType, encodedABI] =
      publicResolver.interface.decodeFunctionResult('ABI', encodedRes[0]) as [
        BigNumber,
        string,
      ]

    expect(contentType.toNumber()).toBe(4)
    expect(JSON.stringify(await decodeFirst(arrayify(encodedABI)))).toBe(
      JSON.stringify(dummyABI),
    )
  })
  it('should allow a uri abi record to be set', async () => {
    const encodedInput = await generateABIInput('uri', 'https://example.com')
    const tx = await ensInstance.setRecord('test123.eth', {
      type: 'abi',
      record: encodedInput,
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const universalResolver =
      await ensInstance.contracts!.getUniversalResolver()!
    const publicResolver = await ensInstance.contracts!.getPublicResolver()!
    const encodedRes = await universalResolver['resolve(bytes,bytes)'](
      hexEncodeName('test123.eth'),
      publicResolver.interface.encodeFunctionData('ABI', [
        namehash('test123.eth'),
        '0x0f',
      ]),
    )
    const [contentType, encodedABI] =
      publicResolver.interface.decodeFunctionResult('ABI', encodedRes[0]) as [
        BigNumber,
        string,
      ]

    expect(contentType.toNumber()).toBe(8)
    expect(toUtf8String(encodedABI)).toBe('https://example.com')
  })
})
