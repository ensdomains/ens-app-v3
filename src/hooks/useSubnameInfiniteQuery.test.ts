import { mockFunction, renderHook } from '@app/test-utils'

import { useEns } from '@app/utils/EnsProvider'

import { useSubnameInfiniteQuery } from './useSubnameInfiniteQuery'

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
  it('should use page param', async () => {
    const firstSubnames = {
      subnames: Array.from({ length: 10 }, makeNameItem),
      subnameCount: 5000,
    }
    mockGetSubnames.mockResolvedValue(firstSubnames)
    const { result, waitFor, rerender } = renderHook(() => useSubnameInfiniteQuery('test.eth'), {
      initialProps: 1,
    })
    expect(mockGetSubnames).toBeCalled()
    rerender(2)
    await waitFor(() => !result.current.isFetching)
    expect(mockGetSubnames).toBeCalledWith(
      expect.objectContaining({
        lastSubnames: firstSubnames.subnames,
      }),
    )
  })
})
