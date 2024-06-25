import { renderHook } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { makeMockUseBasicName } from '../../../test/mock/makeMockUseBasicName'
import { makeMockUseContractAddress } from '../../../test/mock/makeMockUseContractAddress'
import { useNameType } from './useNameType'

const mockBasicData = vi.fn()
vi.mock('@app/hooks/useBasicName', () => ({
  useBasicName: () => mockBasicData(),
}))

vi.mock('@app/hooks/chain/useContractAddress', () => ({
  // @ts-ignore
  useContractAddress: (args) => makeMockUseContractAddress(args),
}))

describe('useNameType', () => {
  describe('name level', () => {
    it('should return root', async () => {
      mockBasicData.mockReturnValue({
        ownerData: {
          ownershipLevel: 'namewrapper',
        },
        wrapperData: {
          fuses: {
            child: {
              CANNOT_UNWRAP: true,
            },
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
          },
        },
        pccExpired: true,
      })
      const { result } = renderHook(() => useNameType('[root]'))
      expect(result.current.data).toEqual('root')
    })

    it('should return tld', async () => {
      mockBasicData.mockReturnValue({
        ownerData: {
          ownershipLevel: 'namewrapper',
        },
        wrapperData: {
          fuses: {
            child: {
              CANNOT_UNWRAP: true,
            },
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
          },
        },
        pccExpired: true,
      })
      const { result } = renderHook(() => useNameType('eth'))
      expect(result.current.data).toEqual('tld')
    })

    it('should return 2ld', async () => {
      mockBasicData.mockReturnValue({
        ownerData: {
          ownershipLevel: 'nameWrapper',
        },
        wrapperData: {
          fuses: {
            child: {
              CANNOT_UNWRAP: true,
            },
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
          },
        },
        pccExpired: true,
      })
      const { result } = renderHook(() => useNameType('test.eth'))
      expect(result.current.data).toEqual('eth-locked-2ld')
    })

    it('should return dns type', async () => {
      mockBasicData.mockReturnValue({
        ownerData: {
          ownershipLevel: 'nameWrapper',
        },
        wrapperData: {
          fuses: {
            child: {
              CANNOT_UNWRAP: true,
            },
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
          },
        },
        pccExpired: true,
      })
      const { result } = renderHook(() => useNameType('sub.test.com'))
      expect(result.current.data).toEqual('dns-pcc-expired-subname')
    })
  })

  describe('wrap level', () => {
    it('should return unwrapped', async () => {
      mockBasicData.mockReturnValue(makeMockUseBasicName('eth-unwrapped-2ld'))
      const { result } = renderHook(() => useNameType('test.eth'))
      expect(result.current.data).toEqual('eth-unwrapped-2ld')
    })

    it('should return wrapped', async () => {
      mockBasicData.mockReturnValue(makeMockUseBasicName('eth-wrapped-subname'))
      const { result } = renderHook(() => useNameType('test.eth'))
      expect(result.current.data).toEqual('eth-wrapped-2ld')
    })

    it('should return emancipated', async () => {
      mockBasicData.mockReturnValue(makeMockUseBasicName('eth-emancipated-2ld'))
      const { result } = renderHook(() => useNameType('test.eth'))
      expect(result.current.data).toEqual('eth-emancipated-2ld')
    })

    it('should return locked', async () => {
      mockBasicData.mockReturnValue(makeMockUseBasicName('eth-locked-2ld'))
      const { result } = renderHook(() => useNameType('test.eth'))
      expect(result.current.data).toEqual('eth-locked-2ld')
    })

    it('should return unwrapped subname', async () => {
      mockBasicData.mockReturnValue(makeMockUseBasicName('eth-unwrapped-subname'))
      const { result } = renderHook(() => useNameType('sub.test.eth'))
      expect(result.current.data).toEqual('eth-unwrapped-subname')
    })

    it('should return pcc expired subname', async () => {
      mockBasicData.mockReturnValue({
        ...makeMockUseBasicName('eth-wrapped-subname'),
        pccExpired: true,
      })
      const { result } = renderHook(() => useNameType('sub.test.eth'))
      expect(result.current.data).toEqual('eth-pcc-expired-subname')
    })

    it('should return for grace period unwrapped', async () => {
      mockBasicData.mockReturnValue(makeMockUseBasicName('eth-unwrapped-2ld:grace-period'))
      const { result } = renderHook(() => useNameType('name.eth'))
      expect(result.current.data).toEqual('eth-unwrapped-2ld:grace-period')
    })

    it('should return for grace period emancipated', async () => {
      mockBasicData.mockReturnValue(makeMockUseBasicName('eth-emancipated-2ld:grace-period'))
      const { result } = renderHook(() => useNameType('name.eth'))
      expect(result.current.data).toEqual('eth-emancipated-2ld:grace-period')
    })

    it('should return for grace period licked', async () => {
      mockBasicData.mockReturnValue(makeMockUseBasicName('eth-locked-2ld:grace-period'))
      const { result } = renderHook(() => useNameType('name.eth'))
      expect(result.current.data).toEqual('eth-locked-2ld:grace-period')
    })
  })
})
