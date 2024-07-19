import { mockFunction, renderHook, waitFor } from '@app/test-utils'
import { describe } from 'vitest'
import { useVerificationOAuthHandler } from '../useVerificationOAuthHandler/useVerificationOAuthHandler'

describe('useVerificationOAuthHandler', () => {
  it('hello world', async () => {
    const { result } = renderHook(() => useVerificationOAuthHandler())
  })
})