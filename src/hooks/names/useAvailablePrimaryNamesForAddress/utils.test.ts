import { checkAvailablePrimaryName, mergeNames } from './utils'

describe('isAvailablePrimaryName', () => {
  jest.spyOn(Date, 'now').mockImplementation(() => 1588994800000)

  const baseName: any = {
    name: 'test.eth',
    isMigrated: true,
    isResolvedAddress: true,
    isController: true,
    isWrappedOwner: true,
    expiryDate: new Date(1588994800000 + 1),
  }

  it('should return true for base name', () => {
    expect(checkAvailablePrimaryName('primary')(baseName)).toBe(true)
  })

  it('should return false if name is not migrated', () => {
    expect(checkAvailablePrimaryName('primary')({ ...baseName, isMigrated: false })).toBe(false)
  })

  it('should return true if isMigrated is null', () => {
    expect(checkAvailablePrimaryName('primary')({ ...baseName, isMigrated: null })).toBe(true)
  })

  it('should return false if isMigrated is undefined', () => {
    expect(checkAvailablePrimaryName('primary')({ ...baseName, isMigrated: undefined })).toBe(false)
  })

  it('should return false if name is TLD', () => {
    expect(checkAvailablePrimaryName('primary')({ ...baseName, name: 'eth' })).toBe(false)
  })

  it('should return false if name is not resolved address, managed name or wrapped name', () => {
    expect(
      checkAvailablePrimaryName('primary')({
        ...baseName,
        isResolvedAddress: false,
        isController: false,
        isWrappedOwner: false,
      }),
    ).toBe(false)
  })

  it('should return true if name is not managed name or wrapped name', () => {
    expect(
      checkAvailablePrimaryName('primary')({
        ...baseName,
        isController: false,
        isWrappedOwner: false,
      }),
    ).toBe(true)
  })

  it('should return true if name is not resolved address or wrapped name', () => {
    expect(
      checkAvailablePrimaryName('primary')({
        ...baseName,
        isResolvedAddress: false,
        isWrappedOwner: false,
      }),
    ).toBe(true)
  })

  it('should return true if name is not resolved address, managed name', () => {
    expect(
      checkAvailablePrimaryName('primary')({
        ...baseName,
        isResolvedAddress: false,
        isController: false,
      }),
    ).toBe(true)
  })

  it('should return false if name is primary name', () => {
    expect(
      checkAvailablePrimaryName('primary.eth')({
        ...baseName,
        name: 'primary.eth',
      }),
    ).toBe(false)
  })

  it('should return false if name expiry date is less than now', () => {
    expect(
      checkAvailablePrimaryName('primary')({
        ...baseName,
        expiryDate: new Date(1588994800000 - 1),
      }),
    ).toBe(false)
  })

  describe('with optional resolver status paramter', () => {
    it('should return false if CSR is burned, is not resolved address, is wrapped owner and resolver is not authorized', () => {
      expect(
        checkAvailablePrimaryName('primary', { isAuthorized: false } as any)({
          ...baseName,
          isWrappedOwner: true,
          isResolvedAddress: false,
          fuses: { child: { CANNOT_SET_RESOLVER: true } },
        }),
      ).toBe(false)
    })

    it('should return true if CSR is not burned, is not resolved address, is wrapped owner and resolver is not authorized', () => {
      expect(
        checkAvailablePrimaryName('primary', { isAuthorized: false } as any)({
          ...baseName,
          isWrappedOwner: true,
          isResolvedAddress: false,
          fuses: { child: { CANNOT_SET_RESOLVER: false } },
        }),
      ).toBe(true)
    })

    it('should return true if CSR is burned, is not resolved address, is wrapped owner and resolver is authorized', () => {
      expect(
        checkAvailablePrimaryName('primary', { isAuthorized: true } as any)({
          ...baseName,
          isWrappedOwner: true,
          isResolvedAddress: false,
          fuses: { child: { CANNOT_SET_RESOLVER: true } },
        }),
      ).toBe(true)
    })

    it('should return true if CSR is burned, is not resolved address, is not wrapped owner and resolver is not authorized', () => {
      expect(
        checkAvailablePrimaryName('primary', { isAuthorized: false } as any)({
          ...baseName,
          isWrappedOwner: false,
          isResolvedAddress: false,
          fuses: { child: { CANNOT_SET_RESOLVER: true } },
        }),
      ).toBe(true)
    })

    it('should return true if CSR is burned, is resolved address, is wrapped owner and resolver is not authorized', () => {
      expect(
        checkAvailablePrimaryName('primary', { isAuthorized: false } as any)({
          ...baseName,
          isWrappedOwner: true,
          isResolvedAddress: true,
          fuses: { child: { CANNOT_SET_RESOLVER: true } },
        }),
      ).toBe(true)
    })
  })
})

describe('mergeName', () => {
  it('should merge names as expected', () => {
    expect(
      mergeNames(
        [
          {
            name: 'test.eth',
            isRegistrant: true,
            isController: true,
            isWrappedOwner: true,
            isResolvedAddress: true,
          },
        ] as any[],
        [
          {
            name: 'test.eth',
            isRegistrant: false,
            isController: false,
            isWrappedOwner: false,
            isResolvedAddress: false,
          },
        ] as any[],
      ),
    ).toEqual([
      {
        name: 'test.eth',
        isRegistrant: true,
        isController: true,
        isWrappedOwner: true,
        isResolvedAddress: true,
      },
    ])
  })

  it('should merge names as expected', () => {
    expect(
      mergeNames(
        [
          {
            name: 'test.eth',
            isRegistrant: false,
            isController: false,
            isWrappedOwner: false,
            isResolvedAddress: false,
          },
        ] as any[],
        [
          {
            name: 'test.eth',
            isRegistrant: true,
            isController: true,
            isWrappedOwner: true,
            isResolvedAddress: true,
          },
        ] as any[],
      ),
    ).toEqual([
      {
        name: 'test.eth',
        isRegistrant: true,
        isController: true,
        isWrappedOwner: true,
        isResolvedAddress: true,
      },
    ])
  })
})
