import { renderHook } from '@app/test-utils'

import { labelhash } from 'viem'
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

  // The grace-period tooltip says the name "can still be extended", which the app does not offer
  // for a short .eth 2LD.
  describe('grace-period tooltip', () => {
    const renderFor = (details: object) => {
      mockUseNameType.mockReturnValue({ data: 'eth-unwrapped-2ld', isLoading: false })
      return renderHook(() =>
        useExpiryDetails({
          name: 'test.eth',
          details: { expiryDate: new Date(3255803954000), isLoading: false, ...details } as any,
        }),
      )
    }

    it('should keep the extendable tooltip for a normal name', () => {
      const { result } = renderFor({
        name: 'test.eth',
        isValid: true,
        isETH: true,
        is2LD: true,
        isShort: false,
      })

      expect(result.current.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'grace-period',
            tooltip: 'tabs.ownership.sections.expiry.panel.grace-period.tooltip',
          }),
        ]),
      )
    })

    // An unhealed label reads as short, and the name behind it can in fact still be extended.
    it('should keep the extendable tooltip for a name whose label is an encoded labelhash', () => {
      const { result } = renderFor({
        name: `[${labelhash('nick').slice(2)}].eth`,
        isValid: true,
        isETH: true,
        is2LD: true,
        isShort: true,
      })

      expect(result.current.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'grace-period',
            tooltip: 'tabs.ownership.sections.expiry.panel.grace-period.tooltip',
          }),
        ]),
      )
    })

    it('should drop the extendable tooltip for a short name while keeping the date', () => {
      const { result } = renderFor({
        name: 'on.eth',
        isValid: true,
        isETH: true,
        is2LD: true,
        isShort: true,
      })

      const gracePeriod = result.current.data?.find(({ type }) => type === 'grace-period')
      expect(gracePeriod).toBeDefined()
      expect(gracePeriod).toEqual(expect.objectContaining({ tooltip: undefined }))
      expect((gracePeriod as { date?: Date })?.date).toBeInstanceOf(Date)
    })
  })
})
