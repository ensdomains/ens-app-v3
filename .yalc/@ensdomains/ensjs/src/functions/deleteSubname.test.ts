import { ethers } from 'ethers'
import { ENS } from '..'
import setup from '../tests/setup'
import { namehash } from '../utils/normalise'

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let provider: ethers.providers.JsonRpcProvider
let accounts: string[]

beforeAll(async () => {
  ;({ ensInstance, revert, provider } = await setup())
  accounts = await provider.listAccounts()
})

beforeEach(async () => {
  await revert()
})

afterAll(async () => {
  await revert()
})

describe('deleteSubname', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should allow deleting a subname on the registry by parent owner', async () => {
    const registry = await ensInstance.contracts!.getRegistry()!
    const parentOwner = await registry.owner(namehash('with-subnames.eth'))

    const tx = await ensInstance.deleteSubname('test.with-subnames.eth', {
      contract: 'registry',
      addressOrIndex: parentOwner,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const result = await registry.owner(namehash('test.with-subnames.eth'))
    expect(result).toBe('0x0000000000000000000000000000000000000000')
  })

  it('should allow deleting a subname on the nameWrapper by parent owner', async () => {
    const nameWrapper = await ensInstance.contracts!.getNameWrapper()!

    const parentOwner = await nameWrapper.ownerOf(
      namehash('wrapped-with-subnames.eth'),
    )

    const tx = await ensInstance.deleteSubname(
      'test.wrapped-with-subnames.eth',
      {
        contract: 'nameWrapper',
        method: 'setSubnodeOwner',
        addressOrIndex: parentOwner,
      },
    )
    expect(tx).toBeTruthy()
    await tx.wait()

    const result = await nameWrapper.ownerOf(
      namehash('test.wrapped-with-subnames.eth'),
    )
    expect(result).toBe('0x0000000000000000000000000000000000000000')
  })

  it('should allow deleting a subname on the nameWrapper by name owner', async () => {
    const nameWrapper = await ensInstance.contracts!.getNameWrapper()!

    const nameOwner = await nameWrapper.ownerOf(
      namehash('addr.wrapped-with-subnames.eth'),
    )

    await ensInstance.deleteSubname('addr.wrapped-with-subnames.eth', {
      contract: 'nameWrapper',
      method: 'setRecord',
      addressOrIndex: nameOwner,
    })

    const result = await nameWrapper.ownerOf(
      namehash('addr.wrapped-with-subnames.eth'),
    )
    expect(result).toBe('0x0000000000000000000000000000000000000000')
  })

  it('should allow deleting a subname on the nameWrapper with PCC burned by name owner', async () => {
    const nameWrapper = await ensInstance.contracts!.getNameWrapper()!

    const parentOwner = await nameWrapper.ownerOf(
      namehash('wrapped-with-subnames.eth'),
    )

    const tx0 = await ensInstance.setFuses('wrapped-with-subnames.eth', {
      named: ['CANNOT_UNWRAP'],
      addressOrIndex: parentOwner,
    })
    expect(tx0).toBeTruthy()
    await tx0.wait()

    const tx1 = await ensInstance.setChildFuses(
      'xyz.wrapped-with-subnames.eth',
      {
        fuses: {
          parent: {
            named: ['PARENT_CANNOT_CONTROL'],
          },
        },
        addressOrIndex: parentOwner,
      },
    )
    expect(tx1).toBeTruthy()
    await tx1.wait()

    const nameOwner = await nameWrapper.ownerOf(
      namehash('xyz.wrapped-with-subnames.eth'),
    )

    expect(parentOwner === nameOwner).toBe(false)

    const tx = await ensInstance.deleteSubname(
      'xyz.wrapped-with-subnames.eth',
      {
        contract: 'nameWrapper',
        method: 'setRecord',
        addressOrIndex: nameOwner,
      },
    )
    expect(tx).toBeTruthy()
    await tx.wait()

    const result = await nameWrapper.ownerOf(
      namehash('xyz.wrapped-with-subnames.eth'),
    )
    expect(result).toBe('0x0000000000000000000000000000000000000000')
  })

  it('should NOT allow deleting a subname on the nameWrapper with PCC burned by parent owner', async () => {
    const nameWrapper = await ensInstance.contracts!.getNameWrapper()!

    const parentOwner = await nameWrapper.ownerOf(
      namehash('wrapped-with-subnames.eth'),
    )

    const tx0 = await ensInstance.setFuses('wrapped-with-subnames.eth', {
      named: ['CANNOT_UNWRAP'],
      addressOrIndex: parentOwner,
    })
    expect(tx0).toBeTruthy()
    await tx0.wait()

    const tx1 = await ensInstance.setChildFuses(
      'legacy.wrapped-with-subnames.eth',
      {
        fuses: {
          parent: {
            named: ['PARENT_CANNOT_CONTROL'],
          },
        },
        addressOrIndex: parentOwner,
      },
    )
    expect(tx1).toBeTruthy()
    await tx1.wait()

    const checkOwner = await nameWrapper.ownerOf(
      namehash('legacy.wrapped-with-subnames.eth'),
    )
    expect(checkOwner).toBe(accounts[2])

    await expect(
      ensInstance.deleteSubname('legacy.wrapped-with-subnames.eth', {
        contract: 'nameWrapper',
        method: 'setSubnodeOwner',
        addressOrIndex: parentOwner,
      }),
    ).rejects.toThrow()

    const result = await nameWrapper.ownerOf(
      namehash('legacy.wrapped-with-subnames.eth'),
    )
    expect(result).toBe(accounts[2])
  })

  it('should not allow deleting 1LD', async () => {
    await expect(
      ensInstance.deleteSubname('eth', {
        contract: 'nameWrapper',
        method: 'setRecord',
        addressOrIndex: 1,
      }),
    ).rejects.toThrow()
  })

  it('should not allow deleting 2LD', async () => {
    await expect(
      ensInstance.deleteSubname('test123.eth', {
        contract: 'registry',
        addressOrIndex: 1,
      }),
    ).rejects.toThrow()
  })
})
