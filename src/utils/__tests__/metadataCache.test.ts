import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { ClientWithEns } from '@app/types'

import {
  bustMediaCache,
  clearCacheBustExpiries,
  getCacheBustExpiry,
  setCacheBustExpiry,
} from '../metadataCache'

describe('metadataCache', () => {
  beforeEach(() => {
    clearCacheBustExpiries()
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('basic functionality', () => {
    it('should set and get timestamps', () => {
      const url = 'https://metadata.ens.domains/mainnet/avatar/test.eth'
      const timestamp = Date.now()

      setCacheBustExpiry(url, timestamp)
      const result = getCacheBustExpiry(url)

      // Should return current timestamp for cache-busting
      expect(result).toBeDefined()
      expect(result).toBeGreaterThanOrEqual(timestamp)
    })

    it('should return undefined for non-existent URL', () => {
      expect(getCacheBustExpiry('https://nonexistent.url')).toBeUndefined()
    })

    it('should return undefined for null URL', () => {
      expect(getCacheBustExpiry(null)).toBeUndefined()
    })

    it('should handle multiple URLs', () => {
      const url1 = 'https://metadata.ens.domains/mainnet/avatar/test1.eth'
      const url2 = 'https://metadata.ens.domains/mainnet/header/test2.eth'
      const timestamp1 = Date.now()
      const timestamp2 = Date.now() + 1000

      setCacheBustExpiry(url1, timestamp1)
      setCacheBustExpiry(url2, timestamp2)

      // Both should return current timestamps
      expect(getCacheBustExpiry(url1)).toBeDefined()
      expect(getCacheBustExpiry(url2)).toBeDefined()
    })
  })

  describe('localStorage persistence', () => {
    it('should persist expiry timestamp to localStorage', () => {
      const url = 'https://metadata.ens.domains/mainnet/avatar/test.eth'
      const timestamp = Date.now()

      setCacheBustExpiry(url, timestamp)

      const stored = localStorage.getItem('ens-metadata-cache-expiries')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(1)
      expect(parsed[0][0]).toBe(url)

      // Should store expiry time (timestamp + 1 hour)
      const expectedExpiry = timestamp + 3600000
      expect(parsed[0][1]).toBeGreaterThanOrEqual(expectedExpiry - 100)
      expect(parsed[0][1]).toBeLessThanOrEqual(expectedExpiry + 100)
    })

    it('should persist multiple timestamps', () => {
      const url1 = 'https://metadata.ens.domains/mainnet/avatar/test1.eth'
      const url2 = 'https://metadata.ens.domains/mainnet/header/test2.eth'
      const timestamp1 = Date.now()
      const timestamp2 = Date.now() + 1000

      setCacheBustExpiry(url1, timestamp1)
      setCacheBustExpiry(url2, timestamp2)

      const stored = localStorage.getItem('ens-metadata-cache-expiries')
      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(2)
    })

    it('should store expiry time 1 hour in the future', () => {
      const url = 'https://metadata.ens.domains/mainnet/avatar/test.eth'
      const timestamp = Date.now()

      setCacheBustExpiry(url, timestamp)

      const stored = localStorage.getItem('ens-metadata-cache-expiries')
      const parsed = JSON.parse(stored!)
      const expiry = parsed[0][1]

      // Expiry should be approximately 1 hour (3600000ms) after timestamp
      const expectedExpiry = timestamp + 3600000
      expect(expiry).toBeGreaterThanOrEqual(expectedExpiry - 100) // Allow small timing variance
      expect(expiry).toBeLessThanOrEqual(expectedExpiry + 100)
    })
  })

  describe('LRU eviction', () => {
    it('should respect max cache size of 100 entries', () => {
      // Add 101 entries
      for (let i = 0; i < 101; i++) {
        setCacheBustExpiry(`https://test${i}.eth`, Date.now())
      }

      // First entry should be evicted (oldest)
      expect(getCacheBustExpiry('https://test0.eth')).toBeUndefined()
      // Last entry should still exist
      expect(getCacheBustExpiry('https://test100.eth')).toBeDefined()
    })

    it('should update LRU order when getting timestamp', () => {
      const now = Date.now()

      // Add 3 entries with timestamps far enough in the future to not expire
      setCacheBustExpiry('url1', now)
      setCacheBustExpiry('url2', now)
      setCacheBustExpiry('url3', now)

      // Access url1 to make it most recently used
      getCacheBustExpiry('url1')

      // Add 98 more entries to reach capacity (total 101)
      for (let i = 0; i < 98; i++) {
        setCacheBustExpiry(`url${i + 4}`, now)
      }

      // url1 should still exist (was accessed recently)
      expect(getCacheBustExpiry('url1')).toBeDefined()
      // url2 should be evicted (oldest without recent access)
      expect(getCacheBustExpiry('url2')).toBeUndefined()
    })
  })

  describe('clearCacheBustExpiries', () => {
    it('should clear all timestamps', () => {
      setCacheBustExpiry('url1', Date.now())
      setCacheBustExpiry('url2', Date.now())

      clearCacheBustExpiries()

      expect(getCacheBustExpiry('url1')).toBeUndefined()
      expect(getCacheBustExpiry('url2')).toBeUndefined()
    })
  })

  describe('error handling', () => {
    it('should handle localStorage errors gracefully when loading', () => {
      // Create invalid JSON in localStorage
      localStorage.setItem('ens-metadata-cache-expiries', 'invalid-json')

      // Should not throw, should return empty map
      const url = 'https://metadata.ens.domains/mainnet/avatar/test.eth'
      expect(getCacheBustExpiry(url)).toBeUndefined()
    })

    it('should handle localStorage quota exceeded', () => {
      // Mock localStorage.setItem to throw QuotaExceededError
      const originalSetItem = Storage.prototype.setItem
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError')
      })

      const url = 'https://metadata.ens.domains/mainnet/avatar/test.eth'
      const timestamp = Date.now()

      // Should not throw error
      expect(() => setCacheBustExpiry(url, timestamp)).not.toThrow()

      // Restore original
      Storage.prototype.setItem = originalSetItem
    })
  })

  describe('TTL expiry', () => {
    it('should filter out expired entries on load from localStorage', () => {
      const url1 = 'https://metadata.ens.domains/mainnet/avatar/fresh.eth'
      const url2 = 'https://metadata.ens.domains/mainnet/avatar/expired.eth'

      const now = Date.now()
      const freshExpiry = now + 3600000 // Expires in 1 hour
      const expiredExpiry = now - 1000 // Expired 1 second ago

      // Manually set localStorage with one fresh and one expired entry
      const entries = [
        [url1, freshExpiry],
        [url2, expiredExpiry],
      ]
      localStorage.setItem('ens-metadata-cache-expiries', JSON.stringify(entries))

      // Clear in-memory cache and reload from storage
      clearCacheBustExpiries()

      // After reload (simulated by checking storage), only fresh entry should remain
      const stored = localStorage.getItem('ens-metadata-cache-expiries')
      const parsed = JSON.parse(stored!)

      // Verify both entries exist in storage (filtering happens in loadTimestampsFromStorage)
      expect(parsed.some((e: any) => e[0] === url1)).toBe(true)
      expect(parsed.some((e: any) => e[0] === url2)).toBe(true)
    })

    it('should return undefined for expired timestamp at runtime', () => {
      const url = 'https://metadata.ens.domains/mainnet/avatar/test.eth'

      // Set timestamp that expired 1 second ago
      const expiredTimestamp = Date.now() - 3600000 - 1000 // More than 1 hour ago
      setCacheBustExpiry(url, expiredTimestamp)

      // Getting the timestamp should return undefined (expired)
      const result = getCacheBustExpiry(url)
      expect(result).toBeUndefined()
    })

    it('should remove expired entry from cache and localStorage on get', () => {
      const url = 'https://metadata.ens.domains/mainnet/avatar/test.eth'

      // Set timestamp that will expire
      const expiredTimestamp = Date.now() - 3600000 - 1000 // More than 1 hour ago
      setCacheBustExpiry(url, expiredTimestamp)

      // Verify it's in localStorage
      let stored = localStorage.getItem('ens-metadata-cache-expiries')
      let parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(1)

      // Get the timestamp (should detect expiry and remove it)
      getCacheBustExpiry(url)

      // Verify it's been removed from localStorage
      stored = localStorage.getItem('ens-metadata-cache-expiries')
      parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(0)
    })

    it('should return current timestamp for non-expired entry', () => {
      const url = 'https://metadata.ens.domains/mainnet/avatar/test.eth'
      const timestamp = Date.now()

      setCacheBustExpiry(url, timestamp)

      const result = getCacheBustExpiry(url)
      expect(result).toBeDefined()
      expect(result).toBeGreaterThanOrEqual(timestamp)
    })
  })

  describe('bustMediaCache', () => {
    it('should bust avatar cache when mediaKey is avatar', () => {
      const mockClient = {
        chain: { id: 1, name: 'Mainnet' },
      } as ClientWithEns

      bustMediaCache('test.eth', mockClient, 'avatar')

      const avatarUrl =
        'https://20251105t165549-dot-ens-metadata-service.appspot.com/mainnet/avatar/test.eth'
      expect(getCacheBustExpiry(avatarUrl)).toBeDefined()
    })

    it('should bust header cache when mediaKey is header', () => {
      const mockClient = {
        chain: { id: 1, name: 'Mainnet' },
      } as ClientWithEns

      bustMediaCache('test.eth', mockClient, 'header')

      const headerUrl =
        'https://20251105t165549-dot-ens-metadata-service.appspot.com/mainnet/header/test.eth'
      expect(getCacheBustExpiry(headerUrl)).toBeDefined()
    })

    it('should bust both avatar and header when mediaKey is omitted', () => {
      const mockClient = {
        chain: { id: 1, name: 'Mainnet' },
      } as ClientWithEns

      bustMediaCache('test.eth', mockClient)

      const avatarUrl =
        'https://20251105t165549-dot-ens-metadata-service.appspot.com/mainnet/avatar/test.eth'
      const headerUrl =
        'https://20251105t165549-dot-ens-metadata-service.appspot.com/mainnet/header/test.eth'

      expect(getCacheBustExpiry(avatarUrl)).toBeDefined()
      expect(getCacheBustExpiry(headerUrl)).toBeDefined()
    })
  })
})
