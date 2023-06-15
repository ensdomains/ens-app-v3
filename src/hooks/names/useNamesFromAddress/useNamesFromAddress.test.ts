import { mockFunction, renderHook } from '@app/test-utils'

import { useEns } from '@app/utils/EnsProvider'

import { useNamesFromAddress } from './useNamesFromAddress'

jest.mock('@app/hooks/useBlockTimestamp', () => ({
  useBlockTimestamp: () => ({
    isLoading: false,
    data: 100,
  }),
}))

jest.mock('@app/utils/EnsProvider')

const mockUseEns = mockFunction(useEns)

const mockGetNames = jest.fn()

const makeNameItem = (isSubname: boolean) => (_: any, index: number) => {
  const base = {
    id: index,
    labelName: String(index),
    truncatedName: String(index),
    labelhash: '0x123',
    isMigrated: true,
    name: `${index}.eth`,
    parent: {
      name: 'eth',
    },
    type: 'domain',
  }
  if (isSubname) {
    return {
      ...base,
      createdAt: new Date(Date.now() - 60 * 60 * 24 * 1000 * index),
    }
  }
  return {
    ...base,
    registrationDate: new Date(Date.now() - 60 * 60 * 24 * 1000 * index),
    expiryDate: new Date(Date.now() + 60 * 60 * 24 * 1000 * index),
  }
}

describe('useNamesFromAddress', () => {
  mockUseEns.mockReturnValue({
    ready: true,
    getNames: mockGetNames,
  })
  it('should return the correct amount of result per page', async () => {
    const names = Array.from({ length: 10 }, makeNameItem(false))

    mockGetNames.mockResolvedValue(names)

    const { result, waitForNextUpdate } = renderHook(() =>
      useNamesFromAddress({
        page: 1,
        resultsPerPage: 5,
        sort: {
          orderDirection: 'desc',
          type: 'expiryDate',
        },
        address: '0x123',
      }),
    )
    await waitForNextUpdate()
    expect(result.current.data!.names).toHaveLength(5)
    expect(result.current.data!.pageCount).toBe(2)
  })
  describe('should correctly sort names', () => {
    it('should sort by creation date', async () => {
      const names = [
        ...Array.from({ length: 10 }, makeNameItem(false)),
        ...Array.from({ length: 10 }, makeNameItem(true)),
      ]

      mockGetNames.mockResolvedValue(names)

      const { result, waitForNextUpdate } = renderHook(() =>
        useNamesFromAddress({
          page: 1,
          resultsPerPage: 5,
          sort: {
            orderDirection: 'asc',
            type: 'creationDate',
          },
          address: '0x123',
        }),
      )
      await waitForNextUpdate()
      const first = result.current.data!.names[0]
      const last = result.current.data!.names[4]
      expect(first.registrationDate?.getDate()).toBe(
        new Date(Date.now() - 60 * 60 * 24 * 1000 * 9).getDate(),
      )
      expect(last.registrationDate?.getDate()).toBe(
        new Date(Date.now() - 60 * 60 * 24 * 1000 * 5).getDate(),
      )
    })
    it('should sort by expiry date (descending)', async () => {
      const names = [...Array.from({ length: 9 }, makeNameItem(false)), makeNameItem(true)(null, 9)]

      mockGetNames.mockResolvedValue(names)

      const { result, waitForNextUpdate } = renderHook(() =>
        useNamesFromAddress({
          page: 1,
          resultsPerPage: 5,
          sort: {
            orderDirection: 'desc',
            type: 'expiryDate',
          },
          address: '0x123',
        }),
      )
      await waitForNextUpdate()
      const first = result.current.data!.names[0]
      const second = result.current.data!.names[1]
      const last = result.current.data!.names[4]
      expect(first.expiryDate).toBeUndefined()
      expect(second.expiryDate?.getDate()).toBe(
        new Date(Date.now() + 60 * 60 * 24 * 1000 * 8).getDate(),
      )
      expect(last.expiryDate?.getDate()).toBe(
        new Date(Date.now() + 60 * 60 * 24 * 1000 * 5).getDate(),
      )
    })
    it('should show names without expiry at top when sorting by asc expiryDate', async () => {
      const names = [...Array.from({ length: 9 }, makeNameItem(false)), makeNameItem(true)(null, 9)]

      mockGetNames.mockResolvedValue(names)

      const { result, waitForNextUpdate } = renderHook(() =>
        useNamesFromAddress({
          page: 1,
          resultsPerPage: 5,
          sort: {
            orderDirection: 'asc',
            type: 'expiryDate',
          },
          address: '0x123',
        }),
      )
      await waitForNextUpdate()
      const first = result.current.data!.names![0]
      const last = result.current.data!.names![4]
      expect(first.expiryDate?.getDate()).toBe(
        new Date(Date.now() + 60 * 60 * 24 * 1000 * 0).getDate(),
      )
      expect(last.expiryDate?.getDate()).toBe(
        new Date(Date.now() + 60 * 60 * 24 * 1000 * 4).getDate(),
      )
    })
    it('should sort by label name', async () => {
      const names = Array.from({ length: 10 }, makeNameItem(false))

      mockGetNames.mockResolvedValue(names)

      const { result, waitForNextUpdate } = renderHook(() =>
        useNamesFromAddress({
          page: 1,
          resultsPerPage: 5,
          sort: {
            orderDirection: 'desc',
            type: 'labelName',
          },
          address: '0x123',
        }),
      )
      await waitForNextUpdate()
      const first = result.current.data!.names[0]
      const last = result.current.data!.names![4]
      expect(first.labelName).toBe('9')
      expect(last.labelName).toBe('5')
    })
  })
  describe('should correctly filter names', () => {
    it('should filter by registration', async () => {
      const names = Array.from({ length: 10 }, makeNameItem(false))
      names[0].type = 'registration'

      mockGetNames.mockResolvedValue(names)

      const { result, waitForNextUpdate } = renderHook(() =>
        useNamesFromAddress({
          page: 1,
          resultsPerPage: 5,
          sort: {
            orderDirection: 'desc',
            type: 'expiryDate',
          },
          filter: 'registration',
          address: '0x123',
        }),
      )
      await waitForNextUpdate()
      expect(result.current.data!.names).toHaveLength(1)
    })
    it('should filter by domain', async () => {
      const names = Array.from({ length: 10 }, makeNameItem(false)).map((name) => ({
        ...name,
        type: 'registration',
      }))
      names[0].type = 'domain'

      mockGetNames.mockResolvedValue(names)

      const { result, waitForNextUpdate } = renderHook(() =>
        useNamesFromAddress({
          page: 1,
          resultsPerPage: 5,
          sort: {
            orderDirection: 'desc',
            type: 'expiryDate',
          },
          filter: 'domain',
          address: '0x123',
        }),
      )
      await waitForNextUpdate()
      expect(result.current.data!.names).toHaveLength(1)
    })
  })
  it('should return the correct page length', async () => {
    const names = Array.from({ length: 25 }, makeNameItem(false))

    mockGetNames.mockResolvedValue(names)

    const { result, waitForNextUpdate } = renderHook(() =>
      useNamesFromAddress({
        page: 1,
        resultsPerPage: 5,
        sort: {
          orderDirection: 'desc',
          type: 'expiryDate',
        },
        address: '0x123',
      }),
    )
    await waitForNextUpdate()
    expect(result.current.data!.pageCount).toBe(5)
  })
  it('should correctly merge data', async () => {
    const names = [
      ...Array.from({ length: 10 }, makeNameItem(false)),
      ...Array.from({ length: 10 }, makeNameItem(false)).map((name) => ({
        ...name,
        type: 'registration',
      })),
    ]

    mockGetNames.mockResolvedValue(names)

    const { result, waitForNextUpdate } = renderHook(() =>
      useNamesFromAddress({
        page: 1,
        resultsPerPage: 5,
        sort: {
          orderDirection: 'desc',
          type: 'expiryDate',
        },
        address: '0x123',
      }),
    )
    await waitForNextUpdate()
    expect(result.current.data!.nameCount).toBe(10)
    expect(result.current.data!.names![0].isRegistrant).toBe(true)
    expect(result.current.data!.names![0].isController).toBe(true)
  })
  it('should use registration expiry for wrapped domains', async () => {
    const names = [
      {
        ...makeNameItem(true)(null, 0),
        type: 'wrappedDomain',
        expiryDate: new Date(0),
        registration: {
          registrationDate: new Date(Date.now() - 60 * 60 * 24 * 1000 * 6),
          expiryDate: new Date(Date.now() + 60 * 60 * 24 * 1000 * 6),
        },
      },
    ]

    mockGetNames.mockResolvedValue(names)
    const { result, waitForNextUpdate } = renderHook(() =>
      useNamesFromAddress({
        page: 1,
        resultsPerPage: 5,
        sort: {
          orderDirection: 'desc',
          type: 'expiryDate',
        },
        address: '0x123',
      }),
    )
    await waitForNextUpdate()
    expect(result.current.data!.names[0].expiryDate!.getTime()).toBe(
      names[0].registration.expiryDate.getTime(),
    )
  })
  it('should add name to root domain', async () => {
    const names = [
      {
        id: '0x0000000000000000000000000000000000000000000000000000000000000000',
        labelName: null,
        labelhash: null,
        truncatedName: null,
        name: null,
        isMigrated: true,
        parent: null,
        type: 'domain',
      },
    ]

    mockGetNames.mockResolvedValue(names)
    const { result, waitForNextUpdate } = renderHook(() =>
      useNamesFromAddress({
        page: 1,
        resultsPerPage: 5,
        sort: {
          orderDirection: 'desc',
          type: 'expiryDate',
        },
        address: '0x123',
      }),
    )
    await waitForNextUpdate()
    expect(result.current.data!.names[0].name).toBe('[root]')
  })
})
