import { mockFunction, renderHook, waitFor } from '@app/test-utils'
import { describe, it, vi } from 'vitest'
import { useVerificationOAuth } from './useVerificationOAuth'

vi.mock('./')

describe('useVerificationOAuthHandler', () => {
  it('hello world', async () => {
    const { result } = renderHook(() => useVerificationOAuth({

    }))
  })
})