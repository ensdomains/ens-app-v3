import { renderHook } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { checkETH2LDFromName } from '@app/utils/utils'

import { useExpiryDetails } from './useExpiryDetails'

const mockUseNameType = vi.fn()
vi.mock('@app/hooks/nameType/useNameType', () => ({
  useNameType: () => mockUseNameType(),
}))

const mockUseBasicName = vi.fn()
vi.mock('@app/hooks/useBasicName', () => ({
  useBasicName: ({ enabled }: any) => {
    return enabled ? mockUseBasicName() : { isLoading: false }
  },
}))

const mockUseRegistrationData = vi.fn().mockReturnValue({
  data: {
    registrationDate: new Date(3255803954000),
    transactionHash: '0xhash',
  },
  isLoading: false,
})
vi.mock('@app/hooks/useRegistrationData', () => ({
  default: ({ name, enabled }: any) =>
    enabled && checkETH2LDFromName(name) ? mockUseRegistrationData() : { isLoading: false },
}))

vi.mock('@app/hooks/chain/useChainName', () => ({
  useChainName: () => 'goerli',
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useExpiryDetails', () => {
  describe('eth 2lds', () => {
    ;['eth-unwrapped-2ld', 'eth-emancipated-2ld', 'eth-locked-2ld'].forEach((nameType) => {
      it(`should return expiry, grace-period and `, () => {
        mockUseNameType.mockReturnValue({
          data: nameType,
          isLoading: false,
        })
        const { result } = renderHook(() =>
          useExpiryDetails({
            name: 'test.eth',
            details: {
              expiryDate: new Date(3255803954000),
              isLoading: false,
            } as any,
          }),
        )

        expect(mockUseRegistrationData).toHaveBeenCalled()
        expect(mockUseBasicName).not.toHaveBeenCalled()
        expect(result.current.data).toEqual(
          expect.arrayContaining([expect.objectContaining({ type: 'expiry' })]),
        )
        expect(result.current.data).toEqual(
          expect.arrayContaining([expect.objectContaining({ type: 'grace-period' })]),
        )
        expect(result.current.data).toEqual(
          expect.arrayContaining([expect.objectContaining({ type: 'registration' })]),
        )
      })
    })
  })

  describe('pcc burned eth subnamess', () => {
    ;['eth-emancipated-subname', 'eth-locked-subname'].forEach((nameType) => {
      it(`should return expiry, grace-period and `, () => {
        mockUseNameType.mockReturnValue({
          data: nameType,
          isLoading: false,
        })
        mockUseBasicName.mockReturnValue({
          wrapperData: {
            expiry: { date: new Date(3255803954000) },
          },
          isLoading: false,
        })

        const { result } = renderHook(() =>
          useExpiryDetails({
            name: 'sub.test.eth',
            details: {
              wrapperData: {
                expiry: { date: new Date(3255803954000) },
              },
              isLoading: false,
            } as any,
          }),
        )

        expect(mockUseRegistrationData).not.toHaveBeenCalled()
        expect(mockUseBasicName).toHaveBeenCalled()
        expect(result.current.data).toEqual(
          expect.arrayContaining([expect.objectContaining({ type: 'expiry' })]),
        )
        expect(result.current.data).toEqual(
          expect.arrayContaining([expect.objectContaining({ type: 'parent-expiry' })]),
        )
      })
    })
  })

  describe('pcc not burned eth subnamess', () => {
    ;['eth-unwrapped-subname', 'eth-wrapped-subname', 'eth-pcc-expired-subname'].forEach(
      (nameType) => {
        it(`should return expiry, grace-period and `, () => {
          mockUseNameType.mockReturnValue({
            data: nameType,
            isLoading: false,
          })
          mockUseBasicName.mockReturnValue({
            expiryDate: new Date(3255803954000),
            isLoading: false,
          })

          const { result } = renderHook(() =>
            useExpiryDetails({
              name: 'sub.test.eth',
              details: {
                expiryDate: new Date(3255803954000),
                isLoading: false,
              } as any,
            }),
          )

          expect(mockUseRegistrationData).not.toHaveBeenCalled()
          expect(mockUseBasicName).toHaveBeenCalled()
          expect(result.current.data).toEqual(
            expect.arrayContaining([expect.objectContaining({ type: 'parent-grace-period' })]),
          )
          expect(result.current.data).toEqual(
            expect.arrayContaining([expect.objectContaining({ type: 'parent-expiry' })]),
          )
        })
      },
    )
  })
})
