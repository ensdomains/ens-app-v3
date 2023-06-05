import { isAvailablePrimaryName, mergeNames } from './utils'

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
    expect(isAvailablePrimaryName('primary')(baseName)).toBe(true)
  })

  it('should return false if name is not migrated', () => {
    expect(isAvailablePrimaryName('primary')({ ...baseName, isMigrated: false })).toBe(false)
  })

  it('should return false if name is TLD', () => {
    expect(isAvailablePrimaryName('primary')({ ...baseName, name: 'eth' })).toBe(false)
  })

  it('should return false if name is not resolved address, managed name or wrapped name', () => {
    expect(
      isAvailablePrimaryName('primary')({
        ...baseName,
        isResolvedAddress: false,
        isController: false,
        isWrappedOwner: false,
      }),
    ).toBe(false)
  })

  it('should return true if name is not managed name or wrapped name', () => {
    expect(
      isAvailablePrimaryName('primary')({
        ...baseName,
        isController: false,
        isWrappedOwner: false,
      }),
    ).toBe(true)
  })

  it('should return true if name is not resolved address or wrapped name', () => {
    expect(
      isAvailablePrimaryName('primary')({
        ...baseName,
        isResolvedAddress: false,
        isWrappedOwner: false,
      }),
    ).toBe(true)
  })

  it('should return true if name is not resolved address, managed name', () => {
    expect(
      isAvailablePrimaryName('primary')({
        ...baseName,
        isResolvedAddress: false,
        isController: false,
      }),
    ).toBe(true)
  })

  it('should return false if name is primary name', () => {
    expect(
      isAvailablePrimaryName('primary.eth')({
        ...baseName,
        name: 'primary.eth',
      }),
    ).toBe(false)
  })

  it('should return false if name expiry date is less than now', () => {
    expect(
      isAvailablePrimaryName('primary')({
        ...baseName,
        expiryDate: new Date(1588994800000 - 1),
      }),
    ).toBe(false)
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
