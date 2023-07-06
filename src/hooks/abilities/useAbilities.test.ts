import { renderHook } from '@app/test-utils'

describe('useSelfAbilities', () => {
  it('should return false for all send abilities if CANNOT_TRANSFER has been burned', () => {
    mockUseBasicName.mockReturnValue({
      wrapperData: {
        child: {
          CANNOT_TRANSFER: true,
        },
      },
    })
    mockUseResolverIsAuthorized.mockReturnValue({ data: { isAuthorized: true, isValid: true } })
    const { result } = renderHook(() => useSelfAbilities(account, name))
    expect(result.current.canSend).toBe(false)
  })
  it('should return canEdit as true if resolver is authorised', () => {
    mockUseBasicName.mockReturnValue({
      ownerData: {
        owner: account,
      },
    })
    mockUseResolverIsAuthorized.mockReturnValue({ data: { isAuthorized: true, isValid: true } })

    const { result } = renderHook(() => useSelfAbilities(account, name))

    expect(result.current.canEdit).toBe(true)
  })
  it('should return canEdit as true if resolver is not authorised but CANNOT_SET_RESOLVER has not been burned', () => {
    mockUseBasicName.mockReturnValue({
      ownerData: {
        owner: account,
      },
    })
    mockUseResolverIsAuthorized.mockReturnValue({ data: { isAuthorized: false, isValid: true } })

    const { result } = renderHook(() => useSelfAbilities(account, name))

    expect(result.current.canEdit).toBe(true)
  })
  it('shold return canEdit as false if resolver is not authorised and CANNOT_SET_RESOLVER has been burned', () => {
    mockUseBasicName.mockReturnValue({
      ownerData: {
        owner: account,
      },
      wrapperData: {
        child: {
          CANNOT_SET_RESOLVER: true,
        },
      },
    })
    mockUseResolverIsAuthorized.mockReturnValue({ data: { isAuthorized: false, isValid: true } })

    const { result } = renderHook(() => useSelfAbilities(account, name))

    expect(result.current.canEdit).toBe(false)
  })
})
