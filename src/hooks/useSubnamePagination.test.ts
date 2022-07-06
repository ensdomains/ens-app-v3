import { mockFunction, renderHook } from '@app/test-utils'
import { useEns } from '@app/utils/EnsProvider'
import { act } from '@testing-library/react-hooks'
import { useQueryClient } from 'react-query'
import { useSubnamePagination } from './useSubnamePagination'

jest.mock('@app/utils/EnsProvider')

const mockUseEns = mockFunction(useEns)
const mockGetSubnames = jest.fn()

const makeNameItem = (_: any, index: number) => ({
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
  createdAt: new Date(Date.now() - 60 * 60 * 24 * 1000 * index),
})

describe('useSubnamePagination', () => {
  mockUseEns.mockReturnValue({
    getSubnames: mockGetSubnames,
  })
  it('should detect large queries', async () => {
    const firstSubnames = {
      subnames: Array.from({ length: 10 }, makeNameItem),
      subnameCount: 5000,
    }
    mockGetSubnames.mockResolvedValue(firstSubnames)
    const { result, waitForNextUpdate } = renderHook(() =>
      useSubnamePagination('test.eth'),
    )
    expect(mockGetSubnames).toBeCalledWith(
      expect.objectContaining({
        isLargeQuery: false,
      }),
    )
    await waitForNextUpdate()
    act(() => {
      result.current.setPage(1)
    })
    expect(mockGetSubnames).toBeCalledWith(
      expect.objectContaining({
        isLargeQuery: true,
      }),
    )
  })
  describe('should correctly calculate max and total pages', () => {
    test('more than 4999 subnames', async () => {
      const firstSubnames = {
        subnames: Array.from({ length: 10 }, makeNameItem),
        subnameCount: 5000,
      }
      mockGetSubnames.mockResolvedValue(firstSubnames)
      const { result, waitForNextUpdate } = renderHook(() =>
        useSubnamePagination('test.eth'),
      )
      await waitForNextUpdate()
      expect(result.current.max).toBe(2)
      expect(result.current.totalPages).toBe(500)
    })
    test('less than 5000 subnames', async () => {
      const firstSubnames = {
        subnames: Array.from({ length: 10 }, makeNameItem),
        subnameCount: 4999,
      }
      mockGetSubnames.mockResolvedValue(firstSubnames)
      const { result, waitForNextUpdate } = renderHook(() =>
        useSubnamePagination('test.eth'),
      )
      await waitForNextUpdate()
      expect(result.current.max).toBe(5)
      expect(result.current.totalPages).toBe(500)
    })
  })
  it('should remove queries on unmount', () => {
    const { unmount } = renderHook(() => useSubnamePagination('test.eth'))
    const { result } = renderHook(() => useQueryClient())
    unmount()
    expect(
      result.current.getQueryCache().findAll({ active: true }),
    ).toStrictEqual([])
  })
})
