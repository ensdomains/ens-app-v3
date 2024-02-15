import { renderHook } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { useNameType } from './useNameType'

const mockBasicData = vi.fn()
vi.mock('@app/hooks/useBasicName', () => ({
  useBasicName: () => mockBasicData(),
}))

vi.mock('@app/hooks/chain/useContractAddress', () => ({
  useContractAddress: () => '0xnamewrapper',
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
      mockBasicData.mockReturnValue({
        ownerData: {},
        wrapperData: {
          fuses: {
            child: {},
            parent: {},
          },
        },
        pccExpired: true,
      })
      const { result } = renderHook(() => useNameType('test.eth'))
      expect(result.current.data).toEqual('eth-unwrapped-2ld')
    })

    it('should return wrapped', async () => {
      mockBasicData.mockReturnValue({
        ownerData: {
          ownershipLevel: 'nameWrapper',
        },
        wrapperData: {
          fuses: {
            child: {},
            parent: {},
          },
        },
        pccExpired: true,
      })
      const { result } = renderHook(() => useNameType('test.eth'))
      expect(result.current.data).toEqual('eth-wrapped-2ld')
    })

    it('should return emancipated', async () => {
      mockBasicData.mockReturnValue({
        ownerData: {
          ownershipLevel: 'nameWrapper',
        },
        wrapperData: {
          fuses: {
            child: {},
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
          },
        },
        pccExpired: true,
      })
      const { result } = renderHook(() => useNameType('test.eth'))
      expect(result.current.data).toEqual('eth-emancipated-2ld')
    })

    it('should return locked', async () => {
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

    it('should return unwrapped subname', async () => {
      mockBasicData.mockReturnValue({
        ownerData: {
          ownershipLevel: 'registry',
        },
        wrapperData: {
          fuses: {
            child: {
              CANNOT_UNWRAP: false,
            },
            parent: {
              PARENT_CANNOT_CONTROL: false,
            },
          },
        },
        pccExpired: false,
      })
      const { result } = renderHook(() => useNameType('sub.test.eth'))
      expect(result.current.data).toEqual('eth-unwrapped-subname')
    })

    it('should return pcc expired subname', async () => {
      mockBasicData.mockReturnValue({
        ownerData: {
          ownershipLevel: 'nameWrapper',
        },
        wrapperData: {
          fuses: {
            child: {
              CANNOT_UNWRAP: false,
            },
            parent: {
              PARENT_CANNOT_CONTROL: false,
            },
          },
        },
        pccExpired: true,
      })
      const { result } = renderHook(() => useNameType('sub.test.eth'))
      expect(result.current.data).toEqual('eth-pcc-expired-subname')
    })
  })
})
