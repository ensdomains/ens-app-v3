import { mockFunction, renderHook} from '@app/test-utils'
import { describe, it, vi } from 'vitest'

import { useAccount } from 'wagmi'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { fetchDentityVPToken } from '../useVerifiedRecords/utils/fetchDentityVPToken'
import { useSearchParams } from 'next/navigation'

const mockUseAccount = mockFunction(useAccount).mockImplementation(() => ({
  address: '0x123',
}))

const mockPush = vi.fn()
const mockUseRouter = mockFunction(useRouterWithHistory).mockReturnValue({
  push: mockPush
})

const mockFetchDentityVPToken = mockFunction(fetchDentityVPToken).mockResolvedValue({
  ens_name: 'name.eth',
  vp_token: []
})

const mockUseSearchParams = mockFunction(useSearchParams).mockReturnValue({
  get: (key: string) => {
    return { iss: DENTITY_ISS, code: 'code'}[key]
  } 
})



import { useVerificationOAuthHandler } from './useVerificationOAuthHandler'
import { DENTITY_ISS } from '@app/constants/verification'

describe('useVerificationOAuthHandler', () => {
  it('hello world', async () => {
    const { result } = renderHook(() => useVerificationOAuthHandler())

  })
})