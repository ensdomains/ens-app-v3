import { mockFunction, renderHook, waitFor } from '@app/test-utils'

import { useGlobalErrorDispatch } from '@app/utils/GlobalErrorProvider/GlobalErrorProvider'

import { useGlobalErrorFunc } from './useGlobalErrorFunc'

jest.mock('@app/utils/GlobalErrorProvider/GlobalErrorProvider')
const mockDispatch = mockFunction(useGlobalErrorDispatch)
mockDispatch.mockReturnValue(mockDispatch)

describe('useGlobalError', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
  })

  describe('register/unregister keys', () => {
    it('should dispatch register key when mounted', async () => {
      renderHook(() => useGlobalErrorFunc({ queryKey: ['test'], func: () => Promise.resolve({}) }))
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'REGISTER_KEY',
        payload: {
          key: ['test'],
        },
      })
    })

    it('should not dispatch register key when mounted and skip is true', async () => {
      renderHook(() =>
        useGlobalErrorFunc({ queryKey: ['test'], func: () => Promise.resolve({}), skip: true }),
      )
      expect(mockDispatch).not.toHaveBeenCalledWith({
        type: 'REGISTER_KEY',
        payload: {
          key: ['test'],
        },
      })
    })

    it('should dispatch unregister key when unmounted', async () => {
      const { unmount } = renderHook(() =>
        useGlobalErrorFunc({ queryKey: ['test'], func: () => Promise.resolve({}) }),
      )
      unmount()
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'UNREGISTER_KEY',
          payload: {
            key: ['test'],
          },
        })
      })
    })

    it('should dispatch unregister key when unmounted if skip is true', async () => {
      const { unmount } = renderHook(() =>
        useGlobalErrorFunc({ queryKey: ['test'], func: () => Promise.resolve({}), skip: true }),
      )
      unmount()
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'UNREGISTER_KEY',
          payload: {
            key: ['test'],
          },
        })
      })
    })
  })
})
