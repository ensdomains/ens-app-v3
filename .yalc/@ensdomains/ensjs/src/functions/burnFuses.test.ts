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

afterAll(async () => {
  await revert()
})

describe('burnFuses', () => {
  beforeEach(async () => {
    await revert()
  })
  describe('Array', () => {
    it('should return a burnFuses transaction from a named fuse array and succeed', async () => {
      const tx = await ensInstance.burnFuses('wrapped.eth', {
        namedFusesToBurn: [
          'CANNOT_UNWRAP',
          'CANNOT_CREATE_SUBDOMAIN',
          'CANNOT_SET_TTL',
        ],
        addressOrIndex: accounts[1],
      })
      expect(tx).toBeTruthy()
      await tx.wait()

      const nameWrapper = await ensInstance.contracts!.getNameWrapper()!
      const [, fuses] = await nameWrapper.getData(namehash('wrapped.eth'))
      expect(fuses).toBe(113)
    })
    it('should return a burnFuses transaction from an unnamed fuse array and succeed', async () => {
      const tx0 = await ensInstance.burnFuses('wrapped.eth', {
        namedFusesToBurn: ['CANNOT_UNWRAP'],
        addressOrIndex: accounts[1],
      })
      expect(tx0).toBeTruthy()
      await tx0.wait()

      const tx = await ensInstance.burnFuses('wrapped.eth', {
        unnamedFusesToBurn: [128, 256, 512],
        addressOrIndex: accounts[1],
      })
      expect(tx).toBeTruthy()
      await tx.wait()

      const nameWrapper = await ensInstance.contracts!.getNameWrapper()!
      const [, fuses] = await nameWrapper.getData(namehash('wrapped.eth'))
      expect(fuses).toBe(961)
    })
    it('should return a burnFuses transaction from both an unnamed and named fuse array and succeed', async () => {
      const tx = await ensInstance.burnFuses('wrapped.eth', {
        namedFusesToBurn: [
          'CANNOT_UNWRAP',
          'CANNOT_CREATE_SUBDOMAIN',
          'CANNOT_SET_TTL',
        ],
        unnamedFusesToBurn: [128, 256, 512],
        addressOrIndex: accounts[1],
      })
      expect(tx).toBeTruthy()
      await tx.wait()

      const nameWrapper = await ensInstance.contracts!.getNameWrapper()!
      const [, fuses] = await nameWrapper.getData(namehash('wrapped.eth'))
      expect(fuses).toBe(1009)
    })
    it('should throw an error when trying to burn a named fuse in an unnamed fuse array', async () => {
      try {
        await ensInstance.burnFuses('wrapped.eth', {
          unnamedFusesToBurn: [64] as any,
        })
        expect(false).toBeTruthy()
      } catch (e: any) {
        expect(e.message).toBe(
          '64 is not a valid unnamed fuse. If you are trying to burn a named fuse, use the namedFusesToBurn property.',
        )
      }
    })
    it('should throw an error when trying to burn an unnamed fuse in a named fuse array', async () => {
      try {
        await ensInstance.burnFuses('wrapped.eth', {
          namedFusesToBurn: ['COOL_SWAG_FUSE'] as any,
        })
        expect(false).toBeTruthy()
      } catch (e: any) {
        expect(e.message).toBe('COOL_SWAG_FUSE is not a valid named fuse.')
      }
    })
  })
  describe('Number', () => {
    it('should return a burnFuses transaction from a number and succeed', async () => {
      const tx = await ensInstance.burnFuses('wrapped.eth', {
        fuseNumberToBurn: 49,
        addressOrIndex: accounts[1],
      })
      expect(tx).toBeTruthy()
      await tx.wait()

      const nameWrapper = await ensInstance.contracts!.getNameWrapper()!
      const [, fuses] = await nameWrapper.getData(namehash('wrapped.eth'))
      expect(fuses).toBe(113)
    })
    it('should throw an error if the number is too high', async () => {
      try {
        await ensInstance.burnFuses('wrapped.eth', {
          fuseNumberToBurn: 4294967297,
        })
        expect(false).toBeTruthy()
      } catch (e: any) {
        expect(e.message).toBe(
          'Fuse number must be limited to uint32, 4294967297 was too high.',
        )
      }
    })
    it('should throw an error if the number is too low', async () => {
      try {
        await ensInstance.burnFuses('wrapped.eth', {
          fuseNumberToBurn: -1,
        })
        expect(false).toBeTruthy()
      } catch (e: any) {
        expect(e.message).toBe(
          'Fuse number must be limited to uint32, -1 was too low.',
        )
      }
    })
    it('should throw an error if the number is not an integer', async () => {
      try {
        await ensInstance.burnFuses('wrapped.eth', {
          fuseNumberToBurn: 7.5,
        })
        expect(false).toBeTruthy()
      } catch (e: any) {
        expect(e.message).toBe('Fuse number must be an integer, 7.5 was not.')
      }
    })
  })
})
