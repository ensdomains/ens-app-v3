import { afterEach, describe, expect, it } from 'vitest'

import { stringify } from './persist'

import {
  CUSTOM_RPC_STORAGE_KEY,
  CustomRpcUrls,
  getCustomRpcForChain,
  getCustomRpcUrls,
} from './customRpc'

const seed = (urls: CustomRpcUrls) =>
  localStorage.setItem(CUSTOM_RPC_STORAGE_KEY, stringify(urls))

describe('customRpc storage', () => {
  afterEach(() => {
    localStorage.clear()
  })

  describe('getCustomRpcUrls', () => {
    it('returns an empty map when nothing is stored', () => {
      expect(getCustomRpcUrls()).toEqual({})
    })

    it('round-trips a stored map', () => {
      const urls: CustomRpcUrls = {
        1: { url: 'https://mainnet.example.com', exclusive: false },
        11155111: { url: 'https://sepolia.example.com', exclusive: true },
      }
      seed(urls)
      expect(getCustomRpcUrls()).toEqual(urls)
    })

    it('falls through to an empty map when the stored value is corrupt', () => {
      localStorage.setItem(CUSTOM_RPC_STORAGE_KEY, '{ not valid json')
      expect(getCustomRpcUrls()).toEqual({})
      expect(getCustomRpcForChain(1)).toBeUndefined()
    })
  })

  describe('getCustomRpcForChain', () => {
    it('returns the entry for the requested chain', () => {
      seed({ 1: { url: 'https://mainnet.example.com', exclusive: true } })
      expect(getCustomRpcForChain(1)).toEqual({
        url: 'https://mainnet.example.com',
        exclusive: true,
      })
    })

    it('returns undefined when the chain has no entry', () => {
      seed({ 1: { url: 'https://mainnet.example.com', exclusive: false } })
      expect(getCustomRpcForChain(11155111)).toBeUndefined()
    })

    it('returns undefined when the stored entry has an empty url', () => {
      seed({ 1: { url: '', exclusive: false } })
      expect(getCustomRpcForChain(1)).toBeUndefined()
    })

    it('accepts a pre-read map without hitting storage', () => {
      const urls: CustomRpcUrls = { 1: { url: 'https://a.example.com', exclusive: false } }
      expect(getCustomRpcForChain(1, urls)).toEqual(urls[1])
      expect(getCustomRpcForChain(2, urls)).toBeUndefined()
    })
  })
})
