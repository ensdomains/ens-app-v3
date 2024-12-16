import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { shouldOpenModal } from './utils'
import * as chains from '@app/constants/chains'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { shouldOpenModal } from './utils'
import * as chains from '@app/constants/chains'

describe('shouldOpenModal', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('should return undefined when connectedChainName is not provided', () => {
    const result = shouldOpenModal(undefined, 1)
    expect(result).toBeUndefined()
  })

  it('should return undefined when chain is not supported', () => {
    vi.spyOn(chains, 'getSupportedChainById').mockReturnValue(false)
    const result = shouldOpenModal('ethereum', 999999)
    expect(result).toBeUndefined()
  })

  it('should return undefined when no chain is found in URL', () => {
    vi.spyOn(chains, 'getSupportedChainById').mockReturnValue(true)
    vi.spyOn(chains, 'getChainsFromUrl').mockReturnValue(undefined)
    
    const result = shouldOpenModal('ethereum', 1)
    expect(result).toBeUndefined()
  })

  it('should return false when connected chain matches URL chain', () => {
    vi.spyOn(chains, 'getSupportedChainById').mockReturnValue(true)
    vi.spyOn(chains, 'getChainsFromUrl').mockReturnValue([{ id: 1 }])

    const result = shouldOpenModal('ethereum', 1)
    expect(result).toBe(false)
  })

  it('should return true when connected chain differs from URL chain', () => {
    vi.spyOn(chains, 'getSupportedChainById').mockReturnValue(true)
    vi.spyOn(chains, 'getChainsFromUrl').mockReturnValue([{ id: 1 }])

    const result = shouldOpenModal('polygon', 137)
    expect(result).toBe(true)
  })
})