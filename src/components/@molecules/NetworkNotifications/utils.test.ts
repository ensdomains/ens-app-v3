import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import * as chains from '@app/constants/chains'

import { shouldOpenModal } from './utils'

describe('shouldOpenModal', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('should return false when connectedChainId is not provided', () => {
    const result = shouldOpenModal(undefined, 1)
    expect(result).toBe(false)
  })

  it('should return false when accountChainId is not provided', () => {
    const result = shouldOpenModal(1, undefined)
    expect(result).toBe(false)
  })

  it('should return false when chain is not supported', () => {
    vi.spyOn(chains, 'getSupportedChainById').mockReturnValue(undefined)
    const result = shouldOpenModal(1, 999999)
    expect(result).toBe(false)
  })

  it('should return true when connected chain id is different from account chain id and account chain id is supported', () => {
    vi.spyOn(chains, 'getSupportedChainById').mockReturnValue({ id: 17000 } as any)
    const result = shouldOpenModal(1, 17000)
    expect(result).toBe(true)
  })
})
