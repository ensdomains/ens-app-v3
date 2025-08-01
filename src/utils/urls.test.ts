import { holesky, mainnet, sepolia } from 'viem/chains'
import { describe, expect, it, vi } from 'vitest'

import { getL2PrimarySiteUrl } from './urls'

// Mock the getChainsFromUrl function
vi.mock('@app/constants/chains', () => ({
  getChainsFromUrl: vi.fn(),
}))

const mockGetChainsFromUrl = vi.mocked(
  await import('@app/constants/chains').then((m) => m.getChainsFromUrl),
)

describe('getL2PrimarySiteUrl', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return sepolia primary URL for sepolia chain', () => {
    mockGetChainsFromUrl.mockReturnValue([sepolia])
    
    const result = getL2PrimarySiteUrl('test.eth')
    
    expect(result).toBe('https://sepolia.primary.ens.domains/test.eth')
  })

  it('should return holesky primary URL for holesky chain', () => {
    mockGetChainsFromUrl.mockReturnValue([holesky])
    
    const result = getL2PrimarySiteUrl('test.eth')
    
    expect(result).toBe('https://holesky.primary.ens.domains/test.eth')
  })

  it('should return mainnet primary URL for mainnet chain', () => {
    mockGetChainsFromUrl.mockReturnValue([mainnet])
    
    const result = getL2PrimarySiteUrl('test.eth')
    
    expect(result).toBe('https://primary.ens.domains/test.eth')
  })

  it('should return mainnet primary URL for unknown chain', () => {
    const unknownChain = { id: 9999, name: 'Unknown' }
    mockGetChainsFromUrl.mockReturnValue([unknownChain as any])
    
    const result = getL2PrimarySiteUrl('test.eth')
    
    expect(result).toBe('https://primary.ens.domains/test.eth')
  })

  it('should work with ethereum address', () => {
    mockGetChainsFromUrl.mockReturnValue([mainnet])
    
    const address = '0x1234567890123456789012345678901234567890'
    const result = getL2PrimarySiteUrl(address)
    
    expect(result).toBe(`https://primary.ens.domains/${address}`)
  })

  it('should work with ENS name', () => {
    mockGetChainsFromUrl.mockReturnValue([sepolia])
    
    const result = getL2PrimarySiteUrl('vitalik.eth')
    
    expect(result).toBe('https://sepolia.primary.ens.domains/vitalik.eth')
  })

  it('should handle empty name/address', () => {
    mockGetChainsFromUrl.mockReturnValue([mainnet])
    
    const result = getL2PrimarySiteUrl('')
    
    expect(result).toBe('https://primary.ens.domains/')
  })
})