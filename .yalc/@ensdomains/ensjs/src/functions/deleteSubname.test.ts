import { ENS } from '..'
import setup from '../tests/setup'
import { namehash } from '../utils/normalise'

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']

beforeAll(async () => {
  ;({ ensInstance, revert } = await setup())
})

afterAll(async () => {
  await revert()
})

describe('deleteSubname', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should allow deleting a subname on the registry', async () => {
    const tx = await ensInstance.deleteSubname('test.with-subnames.eth', {
      contract: 'registry',
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const registry = await ensInstance.contracts!.getRegistry()!
    const result = await registry.owner(namehash('test.with-subnames.eth'))
    expect(result).toBe('0x0000000000000000000000000000000000000000')
  })
  it('should allow deleting a subname on the nameWrapper', async () => {
    const tx = await ensInstance.deleteSubname(
      'test.wrapped-with-subnames.eth',
      {
        contract: 'nameWrapper',
        addressOrIndex: 1,
      },
    )
    expect(tx).toBeTruthy()
    await tx.wait()

    const nameWrapper = await ensInstance.contracts!.getNameWrapper()!
    const result = await nameWrapper.ownerOf(
      namehash('test.wrapped-with-subnames.eth'),
    )
    expect(result).toBe('0x0000000000000000000000000000000000000000')
  })
})
