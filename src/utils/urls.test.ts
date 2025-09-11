import { holesky, mainnet, sepolia } from 'viem/chains'
import { describe, expect, it, vi, afterEach } from 'vitest'

import { getL2PrimarySiteUrl } from './urls'

// Mock the getNetworkFromUrl function
vi.mock('@app/constants/chains', () => ({
  getNetworkFromUrl: vi.fn(),
}))

const mockGetNetworkFromUrl = vi.mocked(
  await import('@app/constants/chains').then((m) => m.getNetworkFromUrl),
)

describe('getL2PrimarySiteUrl', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return sepolia primary URL for sepolia chain', () => {
    mockGetNetworkFromUrl.mockReturnValue('sepolia')
    
    const result = getL2PrimarySiteUrl('test.eth')
    
    expect(result).toBe('https://sepolia.primary.ens.domains/test.eth')
  })

  it('should return primary URL for holesky chain', () => {
    mockGetNetworkFromUrl.mockReturnValue('holesky')
    
    const result = getL2PrimarySiteUrl('test.eth')
    
    expect(result).toBe('https://primary.ens.domains/test.eth')
  })

  it('should return mainnet primary URL for mainnet chain', () => {
    mockGetNetworkFromUrl.mockReturnValue('mainnet')
    
    const result = getL2PrimarySiteUrl('test.eth')
    
    expect(result).toBe('https://primary.ens.domains/test.eth')
  })

  it('should return mainnet primary URL for undefined chain', () => {
    mockGetNetworkFromUrl.mockReturnValue(undefined)
    
    const result = getL2PrimarySiteUrl('test.eth')
    
    expect(result).toBe('https://primary.ens.domains/test.eth')
  })



  it('should handle empty name/address', () => {
    mockGetNetworkFromUrl.mockReturnValue('mainnet')
    
    const result = getL2PrimarySiteUrl('')
    
    expect(result).toBe('https://primary.ens.domains/')
  })
})