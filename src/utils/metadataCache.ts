/**
 * Metadata query cache-busting timestamp storage
 *
 * This module stores timestamps used for cache-busting ENS metadata queries.
 * Implements LRU (Least Recently Used) eviction to prevent unbounded memory growth.
 */

const MAX_CACHE_SIZE = 100 // Maximum number of URLs to track
const cacheBustTimestamps = new Map<string, number>()

/**
 * Gets the current cache-bust timestamp for a given URL
 */
export const getCacheBustTimestamp = (url: string | null): number | undefined => {
  if (!url) return undefined

  // Get the timestamp and update access order for LRU
  const timestamp = cacheBustTimestamps.get(url)
  if (timestamp !== undefined) {
    // Re-insert to update position (LRU pattern)
    cacheBustTimestamps.delete(url)
    cacheBustTimestamps.set(url, timestamp)
  }

  return timestamp
}

/**
 * Sets a new cache-bust timestamp for a given URL
 * Implements LRU eviction when cache exceeds MAX_CACHE_SIZE
 */
export const setCacheBustTimestamp = (url: string, timestamp: number): void => {
  // If at capacity, remove oldest entry (first in Map)
  if (cacheBustTimestamps.size >= MAX_CACHE_SIZE) {
    const oldestKey = cacheBustTimestamps.keys().next().value
    if (oldestKey) {
      cacheBustTimestamps.delete(oldestKey)
    }
  }

  // Delete and re-add to ensure this entry is newest
  cacheBustTimestamps.delete(url)
  cacheBustTimestamps.set(url, timestamp)
}

/**
 * Clears all cached timestamps (useful for testing)
 */
export const clearCacheBustTimestamps = (): void => {
  cacheBustTimestamps.clear()
}
