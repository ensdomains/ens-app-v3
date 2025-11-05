/**
 * Metadata query cache-busting expiry storage
 *
 * This module stores expiry timestamps used for cache-busting ENS metadata queries.
 * Implements LRU (Least Recently Used) eviction to prevent unbounded memory growth.
 * Persists expiry timestamps to localStorage with 1-hour TTL to survive page refreshes.
 *
 * Note: We store the expiry time (when the cache-bust expires), not the creation time.
 * This simplifies expiry checks and automatically handles expired entries at runtime.
 */

const MAX_CACHE_SIZE = 100 // Maximum number of URLs to track
const STORAGE_KEY = 'ens-metadata-cache-expiries'
export const TTL_MS = 60 * 60 * 1000 // 1 hour

/**
 * Loads cache-bust expiry timestamps from localStorage
 * Filters out expired entries automatically
 */
const loadExpiriesFromStorage = (): Map<string, number> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return new Map()

    const entries: [string, number][] = JSON.parse(stored)
    const now = Date.now()

    // Filter out expired entries
    const validEntries = entries.filter(([, expiry]) => expiry > now)

    return new Map(validEntries)
  } catch (err) {
    console.error('Failed to load metadata cache timestamps from localStorage:', err)
    return new Map()
  }
}

/**
 * Saves cache-bust expiry timestamps to localStorage
 */
const saveExpiriesToStorage = (expiries: Map<string, number>) => {
  try {
    const entries: [string, number][] = Array.from(expiries.entries())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch (err) {
    console.error('Failed to save metadata cache expiries to localStorage:', err)
  }
}

// Initialize cache from localStorage
const cacheBustExpiries = loadExpiriesFromStorage()

/**
 * Gets the cache-bust expiry time for a given URL
 * Returns undefined if the URL has no expiry or if it has expired
 */
export const getCacheBustExpiry = (url: string | null): number | undefined => {
  if (!url) return undefined

  const expiry = cacheBustExpiries.get(url)
  if (expiry === undefined) return undefined

  // Check if expired
  if (expiry <= Date.now()) {
    // Remove expired entry
    cacheBustExpiries.delete(url)
    saveExpiriesToStorage(cacheBustExpiries)
    return undefined
  }

  // Update access order for LRU
  cacheBustExpiries.delete(url)
  cacheBustExpiries.set(url, expiry)

  // Return the expiry time for cache-busting
  return expiry
}

/**
 * Sets a new cache-bust expiry time for a given URL
 * Implements LRU eviction when cache exceeds MAX_CACHE_SIZE
 * Persists to localStorage automatically
 *
 * @param url - The metadata URL to cache-bust
 * @param timestamp - The current timestamp (will be converted to expiry time)
 */
export const setCacheBustExpiry = (url: string, timestamp: number): void => {
  // Calculate expiry time
  const expiry = timestamp + TTL_MS

  // If at capacity, remove oldest entry (first in Map)
  if (cacheBustExpiries.size >= MAX_CACHE_SIZE) {
    const oldestKey = cacheBustExpiries.keys().next().value
    if (oldestKey) {
      cacheBustExpiries.delete(oldestKey)
    }
  }

  // Delete and re-add to ensure this entry is newest
  cacheBustExpiries.delete(url)
  cacheBustExpiries.set(url, expiry)

  // Persist to localStorage
  saveExpiriesToStorage(cacheBustExpiries)
}

/**
 * Clears all cached expiries (useful for testing)
 */
export const clearCacheBustExpiries = (): void => {
  cacheBustExpiries.clear()
}
