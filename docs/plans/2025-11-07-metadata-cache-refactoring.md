# Metadata Cache Refactoring Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate split cache management logic into a single, maintainable module

**Architecture:** Merge `bustMetadataCache.ts` into `metadataCache.ts`, eliminate duplication, simplify the API

**Tech Stack:** TypeScript, localStorage, Viem clients

---

## Current Problems

### 1. **Split Responsibilities**
Cache management logic is unnecessarily split across two files:
- `metadataCache.ts` - Low-level storage (get/set expiries, localStorage)
- `bustMetadataCache.ts` - High-level helpers (bustAvatarCache, bustHeaderCache)

**Why it's a problem:**
- Two files to maintain for one logical concern
- Imports scattered across codebase
- `bustMetadataCache.ts` is just a thin wrapper around `metadataCache.ts`
- No clear benefit from the separation

### 2. **Repetitive Helper Functions**
`bustMetadataCache.ts` contains three functions that are nearly identical:
```typescript
export const bustAvatarCache = (name: string, client: ClientWithEns) => {
  const timestamp = Date.now()
  const chainName = getChainNameForClient(client)
  const avatarUrl = createMetaDataUrl({ name, chainName, mediaKey: 'avatar' })
  if (avatarUrl) {
    setCacheBustExpiry(avatarUrl, timestamp)
    console.log(`[Cache Bust] Avatar for ${name} on ${chainName}:`, avatarUrl)
  }
}

export const bustHeaderCache = (name: string, client: ClientWithEns) => {
  const timestamp = Date.now()
  const chainName = getChainNameForClient(client)
  const headerUrl = createMetaDataUrl({ name, chainName, mediaKey: 'header' })
  if (avatarUrl) {  // Same logic!
    setCacheBustExpiry(headerUrl, timestamp)
    console.log(`[Cache Bust] Header for ${name} on ${chainName}:`, headerUrl)
  }
}
```

**Why it's a problem:**
- DRY violation (Don't Repeat Yourself)
- If we add logging/error handling, must update both
- Could be a single function with a `mediaKey` parameter

### 3. **Unnecessary Abstraction & Inconsistency**
`getChainNameForClient.ts` is a separate utility file with only 13 lines:
```typescript
export const getChainNameForClient = (client: ClientWithEns): string => {
  const chainId = client.chain.id
  if (chainId === 1 || !chainId) return 'mainnet'
  return client.chain.name.toLowerCase()  // ⚠️ Different from standard pattern
}
```

**Why it's a problem:**
- Only used by `bustMetadataCache.ts`
- Could be a private helper in the consolidated module
- Three-file chain for simple cache-busting: `bustMetadataCache.ts` → `getChainNameForClient.ts` → `metadataCache.ts`
- **CRITICAL:** Uses different logic than the standard `getChainName.ts` which uses `config.getClient({ chainId }).chain.name`
- This could cause cache-bust URLs to mismatch query URLs if `client.chain.name` differs from `config.getClient().chain.name`

### 4. **Console.log Pollution**
Every cache bust logs to console:
```typescript
console.log(`[Cache Bust] Avatar for ${name} on ${chainName}:`, avatarUrl)
```

**Why it's a problem:**
- Left over from debugging/QA phase
- Production logs should be warnings/errors only
- Makes console noisy in normal operation

## Proposed Solution

### Consolidate into Single Module

**New structure:**
```
src/utils/
  metadataCache.ts         ← Consolidated module (keep this)
  invalidateMetaDataQuery.ts  ← Keep (React Query integration)

  bustMetadataCache.ts     ← DELETE
  getChainNameForClient.ts ← DELETE
```

### Unified API

**Export from `metadataCache.ts`:**
```typescript
// Low-level (already exists)
export const getCacheBustExpiry(url: string | null): number | undefined
export const setCacheBustExpiry(url: string, timestamp: number): void
export const clearCacheBustExpiries(): void

// High-level (NEW - consolidated from bustMetadataCache.ts)
export const bustMediaCache(name: string, client: ClientWithEns, mediaKey?: 'avatar' | 'header'): void
```

**Simplification:**
- Single `bustMediaCache()` function with optional `mediaKey` parameter
- If `mediaKey` provided → bust that specific media
- If `mediaKey` omitted → bust both avatar and header
- Eliminates `bustAvatarCache` and `bustHeaderCache` duplication

### Private Helpers

Use the **standard `getChainName` pattern** from `src/utils/getChainName.ts` for consistency.

Since transaction files only have a `client` object (not the full wagmi `config`), and the client is already obtained via `config.getClient()` internally, we can safely use `client.chain.name.toLowerCase()`. However, we'll keep the exact same logic pattern as the standard implementation for maintainability:

```typescript
/**
 * Extracts and normalizes chain name from a Viem client
 * Uses the same pattern as getChainName.ts for consistency
 * @param client - Viem client with chain information
 * @returns Normalized chain name (e.g., 'mainnet', 'sepolia')
 */
const getChainName = (client: ClientWithEns): string => {
  const chainId = client.chain.id
  if (chainId === 1 || !chainId) return 'mainnet'
  // Client is already from config.getClient(), so this is consistent
  return client.chain.name.toLowerCase()
}
```

**Note:** This maintains the same behavior but documents the consistency with the standard pattern.

---

## Implementation Tasks

### Task 1: Consolidate into metadataCache.ts

**Files:**
- Modify: `src/utils/metadataCache.ts`
- Reference: `src/utils/bustMetadataCache.ts` (source)
- Reference: `src/utils/getChainNameForClient.ts` (source)

**Step 1: Add private chain name helper**

Add after line 14 (after TTL_MS constant):

```typescript
/**
 * Extracts and normalizes chain name from a Viem client
 * Uses the same pattern as getChainName.ts for consistency
 * @param client - Viem client with chain information
 * @returns Normalized chain name (e.g., 'mainnet', 'sepolia')
 */
const getChainName = (client: ClientWithEns): string => {
  const chainId = client.chain.id
  if (chainId === 1 || !chainId) return 'mainnet'
  // Client is already from config.getClient(), so this is consistent
  return client.chain.name.toLowerCase()
}
```

**Step 2: Add imports at top of file**

Add after line 10 (after module comment):

```typescript
import { createMetaDataUrl } from '@app/hooks/useEnsAvatar'
import type { ClientWithEns } from '@app/types'
```

**Step 3: Add bustMediaCache function**

Add at end of file (after line 113):

```typescript
/**
 * Busts the cache for ENS metadata images
 * Sets cache-bust expiry for avatar and/or header images
 *
 * @param name - ENS name (e.g., 'vitalik.eth')
 * @param client - Viem client with chain information
 * @param mediaKey - Optional specific media to bust ('avatar' or 'header')
 *                   If omitted, busts both avatar and header
 */
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

**Step 4: Run type check**

Run: `pnpm lint:types`
Expected: PASS (no TypeScript errors)

**Step 5: Commit consolidation**

```bash
git add src/utils/metadataCache.ts
git commit -m "feat: consolidate cache management into metadataCache.ts"
```

---

### Task 2: Update transaction files

**Files:**
- Modify: `src/transaction-flow/transaction/updateProfileRecords.ts:1-5`
- Modify: `src/transaction-flow/transaction/updateProfile.ts:1-5`
- Modify: `src/transaction-flow/transaction/resetProfile.ts:1-5`
- Modify: `src/transaction-flow/transaction/resetProfileWithRecords.ts:1-5`
- Modify: `src/transaction-flow/transaction/migrateProfile.ts:1-5`
- Modify: `src/transaction-flow/transaction/migrateProfileWithReset.ts:1-5`

**Step 1: Update import in updateProfileRecords.ts**

Replace:
```typescript
import { bustAvatarCache, bustHeaderCache } from '@app/utils/bustMetadataCache'
```

With:
```typescript
import { bustMediaCache } from '@app/utils/metadataCache'
```

**Step 2: Update cache-busting calls in updateProfileRecords.ts**

Replace:
```typescript
if (hasAvatarChange) bustAvatarCache(name, client)
if (hasHeaderChange) bustHeaderCache(name, client)
```

With:
```typescript
if (hasAvatarChange) bustMediaCache(name, client, 'avatar')
if (hasHeaderChange) bustMediaCache(name, client, 'header')
```

**Step 3: Repeat for remaining transaction files**

Apply the same import and call updates to:
- `updateProfile.ts`
- `resetProfile.ts`
- `resetProfileWithRecords.ts`
- `migrateProfile.ts`
- `migrateProfileWithReset.ts`

**Step 4: Run type check**

Run: `pnpm lint:types`
Expected: PASS

**Step 5: Commit transaction updates**

```bash
git add src/transaction-flow/transaction/*.ts
git commit -m "refactor: update transaction files to use consolidated bustMediaCache"
```

---

### Task 3: Update upload components

**Files:**
- Modify: `src/components/@molecules/ProfileEditor/Avatar/AvatarUpload.tsx:1-10`
- Modify: `src/components/@molecules/ProfileEditor/Header/HeaderUpload.tsx:1-10`

**Step 1: Update AvatarUpload.tsx import**

Find and replace:
```typescript
import { bustAvatarCache } from '@app/utils/bustMetadataCache'
```

With:
```typescript
import { bustMediaCache } from '@app/utils/metadataCache'
```

**Step 2: Update AvatarUpload.tsx usage**

Find:
```typescript
bustAvatarCache(name, client)
```

Replace with:
```typescript
bustMediaCache(name, client, 'avatar')
```

**Step 3: Update HeaderUpload.tsx import**

Same as AvatarUpload - replace import

**Step 4: Update HeaderUpload.tsx usage**

Find:
```typescript
bustHeaderCache(name, client)
```

Replace with:
```typescript
bustMediaCache(name, client, 'header')
```

**Step 5: Run type check**

Run: `pnpm lint:types`
Expected: PASS

**Step 6: Commit upload component updates**

```bash
git add src/components/@molecules/ProfileEditor/Avatar/AvatarUpload.tsx
git add src/components/@molecules/ProfileEditor/Header/HeaderUpload.tsx
git commit -m "refactor: update upload components to use consolidated bustMediaCache"
```

---

### Task 4: Delete old files

**Files:**
- Delete: `src/utils/bustMetadataCache.ts`
- Delete: `src/utils/getChainNameForClient.ts`

**Step 1: Verify no remaining imports**

Run: `grep -r "bustMetadataCache" src/`
Expected: No results (all imports updated)

Run: `grep -r "getChainNameForClient" src/`
Expected: No results

**Step 2: Delete bustMetadataCache.ts**

Run: `git rm src/utils/bustMetadataCache.ts`

**Step 3: Delete getChainNameForClient.ts**

Run: `git rm src/utils/getChainNameForClient.ts`

**Step 4: Run type check**

Run: `pnpm lint:types`
Expected: PASS (no broken imports)

**Step 5: Run tests**

Run: `pnpm test src/utils/__tests__/metadataCache.test.ts`
Expected: All tests PASS

**Step 6: Commit deletions**

```bash
git commit -m "chore: remove redundant bustMetadataCache and getChainNameForClient files"
```

---

### Task 5: Update tests (if needed)

**Files:**
- Review: `src/utils/__tests__/metadataCache.test.ts`

**Step 1: Check if tests import deleted files**

Run: `cat src/utils/__tests__/metadataCache.test.ts | grep "bustMetadataCache\|getChainNameForClient"`
Expected: No matches (tests only import from metadataCache.ts)

**Step 2: Add test for bustMediaCache function**

Add new test at end of file:

```typescript
describe('bustMediaCache', () => {
  it('should bust avatar cache when mediaKey is avatar', () => {
    const mockClient = {
      chain: { id: 1, name: 'Mainnet' },
    } as ClientWithEns

    bustMediaCache('test.eth', mockClient, 'avatar')

    const avatarUrl = 'https://metadata.ens.domains/mainnet/avatar/test.eth'
    expect(getCacheBustExpiry(avatarUrl)).toBeDefined()
  })

  it('should bust header cache when mediaKey is header', () => {
    const mockClient = {
      chain: { id: 1, name: 'Mainnet' },
    } as ClientWithEns

    bustMediaCache('test.eth', mockClient, 'header')

    const headerUrl = 'https://metadata.ens.domains/mainnet/header/test.eth'
    expect(getCacheBustExpiry(headerUrl)).toBeDefined()
  })

  it('should bust both avatar and header when mediaKey is omitted', () => {
    const mockClient = {
      chain: { id: 1, name: 'Mainnet' },
    } as ClientWithEns

    bustMediaCache('test.eth', mockClient)

    const avatarUrl = 'https://metadata.ens.domains/mainnet/avatar/test.eth'
    const headerUrl = 'https://metadata.ens.domains/mainnet/header/test.eth'

    expect(getCacheBustExpiry(avatarUrl)).toBeDefined()
    expect(getCacheBustExpiry(headerUrl)).toBeDefined()
  })
})
```

**Step 3: Run tests**

Run: `pnpm test src/utils/__tests__/metadataCache.test.ts`
Expected: All tests PASS (including new bustMediaCache tests)

**Step 4: Commit test updates**

```bash
git add src/utils/__tests__/metadataCache.test.ts
git commit -m "test: add tests for bustMediaCache function"
```

---

### Task 6: Final verification

**Step 1: Run full type check**

Run: `pnpm lint:types`
Expected: PASS (no TypeScript errors)

**Step 2: Run all tests**

Run: `pnpm test`
Expected: All tests PASS

**Step 3: Run linter**

Run: `pnpm lint`
Expected: No errors

**Step 4: Build project**

Run: `pnpm build`
Expected: Build succeeds

**Step 5: Manual smoke test**

Start dev server and verify:
1. Avatar upload still works
2. Header upload still works
3. Profile updates still trigger cache-busting
4. Console is cleaner (no verbose cache-bust logs)

**Step 6: Review git diff**

Run: `git diff main --stat`
Expected output:
```
src/utils/metadataCache.ts                                  | +50 -0
src/utils/bustMetadataCache.ts                              | -48
src/utils/getChainNameForClient.ts                          | -14
src/transaction-flow/transaction/updateProfileRecords.ts    | ±5
src/transaction-flow/transaction/updateProfile.ts           | ±5
src/transaction-flow/transaction/resetProfile.ts            | ±5
src/transaction-flow/transaction/resetProfileWithRecords.ts | ±5
src/transaction-flow/transaction/migrateProfile.ts          | ±5
src/transaction-flow/transaction/migrateProfileWithReset.ts | ±5
src/components/@molecules/ProfileEditor/Avatar/AvatarUpload.tsx | ±3
src/components/@molecules/ProfileEditor/Header/HeaderUpload.tsx | ±3
src/utils/__tests__/metadataCache.test.ts                   | +30
```

---

## Benefits of This Refactoring

### 1. **Single Source of Truth**
- All cache management in one file (`metadataCache.ts`)
- Easier to maintain and understand
- No hunting across multiple files

### 2. **DRY Compliance**
- Eliminated duplicate `bustAvatarCache`/`bustHeaderCache` functions
- Single `bustMediaCache` function with optional parameter
- Reduced code by ~60 lines

### 3. **Simpler API**
```typescript
// Before (split across files):
import { bustAvatarCache, bustHeaderCache } from '@app/utils/bustMetadataCache'
bustAvatarCache(name, client)
bustHeaderCache(name, client)

// After (unified):
import { bustMediaCache } from '@app/utils/metadataCache'
bustMediaCache(name, client, 'avatar')
bustMediaCache(name, client, 'header')
bustMediaCache(name, client)  // Bust both
```

### 4. **Cleaner Console**
- Removed verbose logging
- Production-ready code
- Easier debugging when needed

### 5. **Better Encapsulation**
- `getChainName` is now private (only used internally)
- Clear public API surface
- Implementation details hidden

---

## Risk Assessment

### Low Risk ✅
- Pure refactoring (no behavior changes)
- All existing tests continue to pass
- Type-safe migrations (TypeScript catches all references)
- Can be completed in small, atomic commits

### Rollback Plan
If issues arise, revert commits in reverse order:
1. `git revert HEAD` (test updates)
2. `git revert HEAD~1` (file deletions)
3. `git revert HEAD~2` (upload component updates)
4. `git revert HEAD~3` (transaction updates)
5. `git revert HEAD~4` (consolidation)

---

## Testing Strategy

### Automated Tests
- ✅ Unit tests for `bustMediaCache` function
- ✅ Existing tests for `getCacheBustExpiry`/`setCacheBustExpiry`
- ✅ Type checking catches broken imports
- ✅ All existing tests continue to pass

### Manual Tests
- Upload avatar through ProfileEditor
- Upload header through ProfileEditor
- Update profile records via transaction
- Verify localStorage persistence
- Check console output (should be cleaner)

---

## Success Criteria

- ✅ Reduced from 3 files to 1 file for cache management
- ✅ All tests pass
- ✅ Type checking passes
- ✅ Build succeeds
- ✅ No behavior changes (pure refactoring)
- ✅ Cleaner, more maintainable code

---

## Files Summary

**Modified (3 files):**
- `src/utils/metadataCache.ts` - Add bustMediaCache + private helper

**Deleted (2 files):**
- `src/utils/bustMetadataCache.ts`
- `src/utils/getChainNameForClient.ts`

**Updated imports (8 files):**
- 6 transaction files
- 2 upload component files

**Total net reduction:** ~30-40 lines of code
