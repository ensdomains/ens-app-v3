import { ethers } from 'ethers'
import { ENS } from '..'
import setup from '../tests/setup'
import { hexEncodeName } from '../utils/hexEncodedName'
import { namehash } from '../utils/normalise'

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let provider: ethers.providers.JsonRpcProvider
let accounts: string[]

beforeAll(async () => {
  ;({ ensInstance, revert, provider } = await setup())
  accounts = await provider.listAccounts()
})

afterAll(async () => {
  await revert()
})

const approve = async () => {
  const nameWrapper = await ensInstance.contracts!.getNameWrapper()!
  const registry = (await ensInstance.contracts!.getRegistry()!).connect(
    provider.getSigner(2),
  )
  const setApprovedForAllTx = await registry.setApprovalForAll(
    nameWrapper.address,
    true,
  )
  await setApprovedForAllTx?.wait()
}

describe('wrapName', () => {
  beforeEach(async () => {
    await revert()
  })
  describe('.eth', () => {
    it('should return a wrap name transaction and succeed', async () => {
      const tx = await ensInstance.wrapName('test123.eth', {
        wrappedOwner: accounts[2],
        addressOrIndex: 1,
      })
      expect(tx).toBeTruthy()
      await tx.wait()

      const nameWrapper = await ensInstance.contracts!.getNameWrapper()!
      const [, fuses] = await nameWrapper.getData(namehash('test123.eth'))

      expect(fuses).toBe(196608)
    })
    it('should allow initial fuses', async () => {
      const tx = await ensInstance.wrapName('test123.eth', {
        wrappedOwner: accounts[2],
        fuseOptions: {
          child: {
            named: ['CANNOT_UNWRAP', 'CANNOT_SET_TTL'],
          },
        },
        addressOrIndex: 1,
      })
      expect(tx).toBeTruthy()
      await tx.wait()

      const nameWrapper = await ensInstance.contracts!.getNameWrapper()!
      const [, fuses] = await nameWrapper.getData(namehash('test123.eth'))
      expect(fuses).toBe(196625)
    })
    it('should allow an initial resolver address', async () => {
      const tx = await ensInstance.wrapName('test123.eth', {
        wrappedOwner: accounts[2],
        resolverAddress: '0x42D63ae25990889E35F215bC95884039Ba354115',
        addressOrIndex: 1,
      })
      expect(tx).toBeTruthy()
      await tx.wait()

      const universalResolver =
        await ensInstance.contracts!.getUniversalResolver()!
      const [result] = await universalResolver.findResolver(
        hexEncodeName('test123.eth'),
      )
      expect(result).toBe('0x42D63ae25990889E35F215bC95884039Ba354115')
    })
    it('should throw an error for labels longer than 255 bytes', async () => {
      const label = 'a'.repeat(256)
      await expect(
        ensInstance.wrapName(`${label}.eth`, {
          wrappedOwner: accounts[2],
          addressOrIndex: 1,
        }),
      ).rejects.toThrow("Label can't be longer than 255 bytes")
    })
  })
  describe('other', () => {
    it('should return a wrap name transaction and succeed', async () => {
      await approve()

      const tx = await ensInstance.wrapName('test.with-subnames.eth', {
        wrappedOwner: accounts[2],
        addressOrIndex: 2,
      })
      expect(tx).toBeTruthy()
      await tx.wait()

      const nameWrapper = await ensInstance.contracts!.getNameWrapper()!
      const [, fuses] = await nameWrapper.getData(
        namehash('test.with-subnames.eth'),
      )

      expect(fuses).toBe(0)
    })
    it('should allow an initial resolver address', async () => {
      await approve()
      const tx = await ensInstance.wrapName('test.with-subnames.eth', {
        wrappedOwner: accounts[2],
        resolverAddress: '0x42D63ae25990889E35F215bC95884039Ba354115',
        addressOrIndex: 2,
      })
      expect(tx).toBeTruthy()
      await tx.wait()

      const universalResolver =
        await ensInstance.contracts!.getUniversalResolver()!
      const [result] = await universalResolver.findResolver(
        hexEncodeName('test.with-subnames.eth'),
      )
      expect(result).toBe('0x42D63ae25990889E35F215bC95884039Ba354115')
    })
    it('should throw an error if contract does not have approval', async () => {
      await expect(
        ensInstance.wrapName('test.with-subnames.eth', {
          wrappedOwner: accounts[2],
          addressOrIndex: 2,
        }),
      ).rejects.toThrow()
    })
    it('should throw an error if initial fuses are provided', async () => {
      await expect(
        ensInstance.wrapName('test.with-subnames.eth', {
          wrappedOwner: accounts[2],
          fuseOptions: {
            child: {
              named: ['CANNOT_UNWRAP', 'CANNOT_SET_TTL'],
            },
          },
          addressOrIndex: 1,
        }),
      ).rejects.toThrow()
    })
  })
})
