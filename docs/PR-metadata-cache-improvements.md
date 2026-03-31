# PR Summary: Metadata Cache Improvements

## Overview

This PR enhances the metadata cache busting system to ensure avatar and header images are properly invalidated when profile records are updated. It adds cache busting to the `updateResolver` transaction and ensures all profile-modifying transactions properly invalidate React Query caches.

---

## Architecture Flow

### 1. How Avatar/Header Images Are Loaded

#### Step 1.1: Creating Metadata URLs

When a component needs to display an avatar or header, it starts by creating a metadata service URL:

**[`src/utils/metadataUrl.ts:17-28`](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/utils/metadataUrl.ts#L17-L28)**

```typescript
export const createMetaDataUrl = ({
  name,
  chainName,
  mediaKey = 'avatar',
}: {
  name?: string
  chainName: string
  mediaKey?: 'avatar' | 'header'
}): string | null => {
  if (!name || !chainName || !mediaKey) return null
  return `${META_DATA_BASE_URL}/${chainName}/${mediaKey}/${name}`
}
```

This generates URLs like:
- `https://metadata.ens.domains/mainnet/avatar/vitalik.eth`
- `https://metadata.ens.domains/mainnet/header/vitalik.eth`

#### Step 1.2: Fetching Images with Cache Busting

The `useEnsAvatar` hook fetches images and applies cache-busting when needed:

**[`src/hooks/useEnsAvatar.ts:35-44`](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/hooks/useEnsAvatar.ts#L35-L44)**

```typescript
export const useEnsAvatar = ({ name, key, staleTime, enabled = true }: UseEnsAvatarParameters) => {
  const chainName = useChainName()
  const url = createMetaDataUrl({ name, chainName, mediaKey: key })

  return useQuery({
    queryKey: [META_DATA_QUERY_KEY, url],
    queryFn: checkImageExists,
    staleTime: staleTime ?? STALE_TIME,
    enabled: enabled && !!url,
  })
}
```

**[`src/hooks/useEnsAvatar.ts:12-28`](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/hooks/useEnsAvatar.ts#L12-L28)**

```typescript
const checkImageExists = async (
  context: QueryFunctionContext<[string, string | null]>,
): Promise<null | string> => {
  const [, imageUrl] = context.queryKey
  if (!imageUrl) return null

  // Append expiry if present for cache-busting
  const cacheBustExpiry = getCacheBustExpiry(imageUrl)
  const imageUrlWithExpiry = cacheBustExpiry ? `${imageUrl}?expiry=${cacheBustExpiry}` : imageUrl

  try {
    const response = await fetch(imageUrlWithExpiry, { method: 'GET' })
    return response.ok ? imageUrlWithExpiry : null
  } catch (error) {
    return null
  }
}
```

When a cache-bust expiry exists, the URL becomes:
- `https://metadata.ens.domains/mainnet/avatar/vitalik.eth?expiry=1699564800000`

#### Step 1.3: Usage in Components

Components use the `useEnsAvatar` hook to display images:

**[`src/components/AvatarWithZorb.tsx:78-82`](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/components/AvatarWithZorb.tsx#L78-L82)**

```typescript
export const NameAvatar = ({ name, noCache = false, ...props }) => {
  const { data: avatar } = useEnsAvatar({
    name,
    gcTime: noCache ? 0 : undefined,
  })
  const zorb = useZorb(name, 'name')
  // ...
}
```

---

### 2. How Cache Busting Works When Records Change

#### Step 2.1: Transaction Execution with Cache Busting

When a user updates their profile (avatar, header, or other records), the transaction file busts the metadata cache:

**Example: [`src/transaction-flow/transaction/updateProfile.ts:62-78`](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/transaction-flow/transaction/updateProfile.ts#L62-L78)**

```typescript
const transaction = ({ client, connectorClient, data }: TransactionFunctionParameters<Data>) => {
  const { name, records } = data

  // Check if avatar or header are being modified in texts array
  const hasAvatarChange = records.texts?.some((t) => t.key === 'avatar')
  const hasHeaderChange = records.texts?.some((t) => t.key === 'header')

  // Bust cache for modified media records
  if (hasAvatarChange) bustMediaCache(name, client, 'avatar')
  if (hasHeaderChange) bustMediaCache(name, client, 'header')

  return setRecords.makeFunctionData(connectorClient, {
    name: data.name,
    resolverAddress: data.resolverAddress,
    ...recordsWithCointypeCoins(data.records),
  })
}
```

#### Step 2.2: Setting Cache-Bust Expiry

The `bustMediaCache` function stores an expiry timestamp:

**[`src/utils/metadataCache.ts:140-156`](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/utils/metadataCache.ts#L140-L156)**

```typescript
export const bustMediaCache = (
  name: string,
  client: ClientWithEns,
  mediaKey?: 'avatar' | 'header',
): void => {
  const timestamp = Date.now()
  const chainName = getChainName(client)

  const mediaKeys = mediaKey ? [mediaKey] : (['avatar', 'header'] as const)

  for (const key of mediaKeys) {
    const url = createMetaDataUrl({ name, chainName, mediaKey: key })
    if (url) {
      setCacheBustExpiry(url, timestamp)
    }
  }
}
```

**[`src/utils/metadataCache.ts:104-122`](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/utils/metadataCache.ts#L104-L122)**

```typescript
export const setCacheBustExpiry = (url: string, timestamp: number): void => {
  // Calculate expiry time
  const expiry = timestamp + TTL_MS  // TTL_MS = 1 hour

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
```

The cache-bust expiry is:
- Stored in memory (Map) for fast access
- Persisted to localStorage for survival across page refreshes
- Set to expire 1 hour after the transaction

#### Step 2.3: React Query Cache Invalidation

After a transaction completes, `TransactionNotifications` invalidates React Query caches:

**[`src/components/TransactionNotifications.tsx:61-71`](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/components/TransactionNotifications.tsx#L61-L71)**

```typescript
case 'updateProfileRecords':
case 'updateProfile':
case 'resetProfile':
case 'resetProfileWithRecords':
case 'migrateProfile':
case 'migrateProfileWithReset':
case 'updateResolver':
  // Cache busting now handled in transaction files
  // Still need to invalidate queries to trigger refetch
  queryClient.invalidateQueries({ queryKey: [META_DATA_QUERY_KEY] })
  break
```

This triggers React Query to refetch the image with the new cache-bust parameter.

---

### 3. Cache-Bust Expiry and Automatic Cleanup

#### Step 3.1: Checking for Expiry

When `getCacheBustExpiry` is called, it checks if the expiry time has passed:

**[`src/utils/metadataCache.ts:74-94`](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/utils/metadataCache.ts#L74-L94)**

```typescript
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
```

#### Step 3.2: LRU Eviction

The cache implements Least Recently Used (LRU) eviction with a max size of 100 entries:

**[`src/utils/metadataCache.ts:16-18`](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/utils/metadataCache.ts#L16-L18)**

```typescript
const MAX_CACHE_SIZE = 100 // Maximum number of URLs to track
const STORAGE_KEY = 'ens-metadata-cache-expiries'
export const TTL_MS = 60 * 60 * 1000 // 1 hour
```

When the cache reaches capacity, the oldest entry is removed before adding a new one.

#### Step 3.3: localStorage Persistence

Cache expiries are persisted to survive page refreshes:

**[`src/utils/metadataCache.ts:37-53`](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/utils/metadataCache.ts#L37-L53)**

```typescript
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
```

Expired entries are automatically filtered out when loading from localStorage.

---

## Changes in This PR

### 1. Added Cache Busting to `updateResolver` Transaction

**File: [`src/transaction-flow/transaction/updateResolver.ts`](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/transaction-flow/transaction/updateResolver.ts)**

**Problem:** When a user changes their resolver, the new resolver may have different avatar/header records. Without cache busting, stale images could be displayed.

**Solution:** Added cache busting for both avatar and header when the resolver is updated.

**Changes:**
- **[Line 7](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/transaction-flow/transaction/updateResolver.ts#L7)**: Import `bustMediaCache`
- **[Line 38](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/transaction-flow/transaction/updateResolver.ts#L38)**: Add `client` parameter to transaction function
- **[Lines 39-41](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/transaction-flow/transaction/updateResolver.ts#L39-L41)**: Call `bustMediaCache` to bust both avatar and header caches

### 2. Extended React Query Invalidation Coverage

**File: [`src/components/TransactionNotifications.tsx`](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/components/TransactionNotifications.tsx)**

**Problem:** Several profile-modifying transactions were not invalidating React Query caches, potentially causing stale data to persist in memory.

**Solution:** Added all profile-modifying transactions to the switch statement that invalidates React Query caches.

**Changes:**
- **[Lines 63-67](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/components/TransactionNotifications.tsx#L63-L67)**: Added cases for:
  - `resetProfile`
  - `resetProfileWithRecords`
  - `migrateProfile`
  - `migrateProfileWithReset`
  - `updateResolver`

### 3. Test File Colocation

**File Move:** `src/utils/__tests__/metadataCache.test.ts` → `src/utils/metadataCache.test.ts`

**Reason:** Colocate test file with source file following modern testing best practices.

---

## Transaction Coverage

All transactions that modify avatar or header records now properly implement dual-cache invalidation:

| Transaction | Metadata Cache Busting | React Query Invalidation |
|------------|----------------------|------------------------|
| `updateProfile` | ✅ (in transaction file) | ✅ (in TransactionNotifications) |
| `updateProfileRecords` | ✅ (in transaction file) | ✅ (in TransactionNotifications) |
| `resetProfile` | ✅ (in transaction file) | ✅ (in TransactionNotifications) |
| `resetProfileWithRecords` | ✅ (in transaction file) | ✅ (in TransactionNotifications) |
| `migrateProfile` | ✅ (in transaction file) | ✅ (in TransactionNotifications) |
| `migrateProfileWithReset` | ✅ (in transaction file) | ✅ (in TransactionNotifications) |
| `updateResolver` | ✅ **[NEW]** (in transaction file) | ✅ **[NEW]** (in TransactionNotifications) |

---

## Two-Level Cache Architecture

The system maintains two separate caches that must both be invalidated:

### 1. Metadata Service Cache (External)
- **What:** CDN/service-level cache for ENS metadata images
- **How to bust:** Append `?expiry={timestamp}` query parameter to URLs
- **Where:** Handled in transaction files via `bustMediaCache()`
- **Persistence:** Stored in localStorage with 1-hour TTL

### 2. React Query Cache (In-Memory)
- **What:** Client-side cache of fetched image URLs
- **How to bust:** Call `queryClient.invalidateQueries()`
- **Where:** Handled in `TransactionNotifications.tsx`
- **Persistence:** In-memory only (cleared on page refresh)

Both caches must be invalidated to ensure users see updated images immediately.

---

## Testing

The metadata cache system has comprehensive test coverage:

**Test File: [`src/utils/metadataCache.test.ts`](https://github.com/ensdomains/ens-app-v3/blob/feature/fet-2595-improve-metadata-performance/src/utils/metadataCache.test.ts)**

Test coverage includes:
- Basic functionality (get/set timestamps)
- localStorage persistence
- LRU eviction
- TTL expiry and automatic cleanup
- Error handling
- `bustMediaCache` function for avatar/header

---

## Benefits

1. **Correct Cache Busting:** Users will now see updated avatars/headers immediately after changing their resolver
2. **Complete Coverage:** All profile-modifying transactions now properly invalidate both cache layers
3. **Automatic Cleanup:** Cache-bust entries expire after 1 hour and are automatically cleaned up
4. **Memory Efficient:** LRU eviction prevents unbounded memory growth
5. **Persistent:** Cache-bust state survives page refreshes via localStorage
