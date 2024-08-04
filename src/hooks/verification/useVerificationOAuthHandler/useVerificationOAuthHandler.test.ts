import { mockFunction, renderHook} from '@app/test-utils'
import { describe, it, vi } from 'vitest'

import { useAccount } from 'wagmi'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useSearchParams } from 'next/navigation'

vi.mock('wagmi')
vi.mock('@app/hooks/useRouterWithHistory')
vi.mock('next/navigation')

const mockUseAccount = mockFunction(useAccount)

const mockPush = vi.fn()
const mockUseRouter = mockFunction(useRouterWithHistory)
const mockUseSearchParams = mockFunction(useSearchParams)


import { useVerificationOAuthHandler } from './useVerificationOAuthHandler'
import { DENTITY_ISS } from '@app/constants/verification'

describe('useVerificationOAuthHandler', () => {

  mockUseRouter.mockReturnValue({ push: mockPush })
  mockUseAccount.mockReturnValue({ address: '0x1234' })
  mockUseSearchParams.mockReturnValue({
    get: (key: string) => {
      return { iss: DENTITY_ISS, code: 'code'}[key]
    } 
  })


  it('hello world', async () => {
    const { result } = renderHook(() => useVerificationOAuthHandler())

  })
})