import { ENS } from '..'
import setup from '../tests/setup'
import { decodeContenthash } from '../utils/contentHash'
import { hexEncodeName } from '../utils/hexEncodedName'
import { namehash } from '../utils/normalise'

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']

beforeAll(async () => {
  ;({ ensInstance, revert } = await setup())
})

afterAll(async () => {
  await revert()
})

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
        key: 'ETC',
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
})
