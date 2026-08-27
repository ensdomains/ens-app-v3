import { mockFunction, renderHook } from '@app/test-utils'

import { labelhash } from 'viem'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useDnsOwner } from './ensjs/dns/useDnsOwner'
import { useBasicName } from './useBasicName'
import { useNameDetails } from './useNameDetails'
import { useProfile } from './useProfile'

vi.mock('./useBasicName')
vi.mock('./useProfile')
vi.mock('./ensjs/dns/useDnsOwner')

const mockUseBasicName = mockFunction(useBasicName)
const mockUseProfile = mockFunction(useProfile)
const mockUseDnsOwner = mockFunction(useDnsOwner)

describe('useNameDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
    })
    mockUseDnsOwner.mockReturnValue({
      data: undefined,
      isLoading: false,
    })
  })
  it('should return an error message for an invalid name', () => {
    mockUseBasicName.mockReturnValue({
      isValid: false,
      name: 'invalid',
    })

    const { result } = renderHook(() => useNameDetails({ name: 'invalid' }))
    expect(result.current.error).toEqual(expect.objectContaining({ content: 'errors.invalidName' }))
  })
  it('should not enable useProfile when normalisedName is [root]', () => {
    mockUseBasicName.mockReturnValue({
      isValid: true,
      name: '[root]',
      normalisedName: '[root]',
    })
    renderHook(() => useNameDetails({ name: '[root]' }))
    expect(mockUseProfile).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }))
  })
  it('should return the minimum-length error for an unregistered short name', () => {
    mockUseBasicName.mockReturnValue({
      isValid: true,
      isShort: true,
      isETH: true,
      is2LD: true,
      name: '12.eth',
      normalisedName: '12.eth',
      registrationStatus: 'short',
      isLoading: false,
    })

    const { result } = renderHook(() => useNameDetails({ name: '12.eth' }))

    expect(result.current.error).toEqual({
      content: 'errors.shortName',
      type: 'error',
    })
  })
  it('should not report an error while short-name ownership is loading', () => {
    mockUseBasicName.mockReturnValue({
      isValid: true,
      isShort: true,
      isETH: true,
      is2LD: true,
      name: '12.eth',
      normalisedName: '12.eth',
      registrationStatus: undefined,
      isLoading: true,
    })

    const { result } = renderHook(() => useNameDetails({ name: '12.eth' }))

    expect(result.current.error).toBeNull()
  })
  it('should warn about the grace period ending with the standard copy for a normal name', () => {
    mockUseBasicName.mockReturnValue({
      isValid: true,
      isShort: false,
      isETH: true,
      is2LD: true,
      name: 'test.eth',
      normalisedName: 'test.eth',
      registrationStatus: 'gracePeriod',
      gracePeriodEndDate: new Date('2026-06-06T00:00:00.000Z'),
      isLoading: false,
    })

    const { result } = renderHook(() => useNameDetails({ name: 'test.eth' }))

    expect(result.current.error).toEqual(
      expect.objectContaining({ content: 'errors.expiringSoon' }),
    )
  })
  // The standard copy promises extension and then availability, and a short name gets neither.
  it('should warn with short-name copy instead of expiringSoon for a grace-period short name', () => {
    mockUseBasicName.mockReturnValue({
      isValid: true,
      isShort: true,
      isETH: true,
      is2LD: true,
      name: 'on.eth',
      normalisedName: 'on.eth',
      registrationStatus: 'gracePeriod',
      gracePeriodEndDate: new Date('2036-06-06T00:00:00.000Z'),
      isLoading: false,
    })

    const { result } = renderHook(() => useNameDetails({ name: 'on.eth' }))

    expect(result.current.error).toEqual(
      expect.objectContaining({
        title: 'errors.hasExpired',
        content: 'errors.expiringSoonShortName',
      }),
    )
  })
  // The minimum-length error is driven by the `short` status, and an unhealed label is never given
  // one: with no readable label there is no registerability answer to give, so the status model
  // reports `notOwned` and no error branch applies. Without that, a normal name whose label had not
  // been healed was told it "is not available for .eth names under 3 characters".
  it('should not report the minimum-length error for an unowned name whose label is an encoded labelhash', () => {
    const encodedName = `[${labelhash('nick').slice(2)}].eth`
    mockUseProfile.mockReturnValue({
      data: { isMigrated: true },
      isLoading: false,
    })
    mockUseBasicName.mockReturnValue({
      isValid: true,
      isShort: true,
      isETH: true,
      is2LD: true,
      name: encodedName,
      normalisedName: encodedName,
      registrationStatus: 'notOwned',
      isLoading: false,
    })

    const { result } = renderHook(() => useNameDetails({ name: encodedName }))

    expect(result.current.error).toBeNull()
  })
  // An unhealed label is reported as short by `parseInput` because there is nothing to measure, so
  // a name of any length can arrive here looking short. It gets the standard copy, which promises
  // the extension it can in fact have.
  it('should keep the standard grace-period copy for a name whose label is still an encoded labelhash', () => {
    const encodedName = `[${labelhash('nick').slice(2)}].eth`
    mockUseBasicName.mockReturnValue({
      isValid: true,
      isShort: true,
      isETH: true,
      is2LD: true,
      name: encodedName,
      normalisedName: encodedName,
      registrationStatus: 'gracePeriod',
      gracePeriodEndDate: new Date('2036-06-06T00:00:00.000Z'),
      isLoading: false,
    })

    const { result } = renderHook(() => useNameDetails({ name: encodedName }))

    expect(result.current.error).toEqual(
      expect.objectContaining({ content: 'errors.expiringSoon' }),
    )
  })
})
