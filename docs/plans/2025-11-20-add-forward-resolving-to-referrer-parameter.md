# Add Forward Resolution to Referrer Parameter Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable the referrer parameter to accept ENS names and automatically resolve them to addresses using forward resolution (ENS name → ETH address, with fallback to owner/registrant).

**Architecture:** Currently the referrer parameter only accepts hex values (addresses). This enhancement will add a utility function that performs forward resolution on ENS names: first attempting to get the ETH address record, then falling back to the owner/registrant address if no ETH address is set. The resolved address is then converted to the 32-byte hex format expected by smart contracts.

**Resolution Flow:**
1. `referrer=vitalik.eth` (ENS name)
2. Try `getAddressRecord('vitalik.eth')` → if exists, use address
3. If no address record, try `getOwner('vitalik.eth')` → use owner/registrant
4. Convert address to 32-byte hex: `0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045`

**Tech Stack:**
- **viem** - Ethereum address handling and hex conversion
- **@ensdomains/ensjs** - ENS resolution via `getAddressRecord` and `getOwner`
- **Vitest** - Unit testing
- **TypeScript** - Type safety with Address type

---

## Task 1: Add ENS Name Forward Resolution Utility

**Files:**
- Modify: `src/utils/referrer.ts`
- Test: `src/utils/referrer.test.ts`

### Step 1: Write the failing test for ENS name forward resolution

Add to `src/utils/referrer.test.ts` after line 64:

```typescript
import { describe, expect, it, vi } from 'vitest'
import { Address } from 'viem'

import { EMPTY_BYTES32 } from '@ensdomains/ensjs/utils'
import { getAddressRecord, getOwner } from '@ensdomains/ensjs/public'

import { getReferrerHex, resolveReferrerToHex } from './referrer'

// Mock ensjs functions
vi.mock('@ensdomains/ensjs/public', () => ({
  getAddressRecord: vi.fn(),
  getOwner: vi.fn(),
}))

describe('resolveReferrerToHex', () => {
  const mockClient = {} as any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should resolve ENS name to ETH address record and convert to hex', async () => {
    const ensName = 'vitalik.eth'
    const mockAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Address

    vi.mocked(getAddressRecord).mockResolvedValueOnce({
      value: mockAddress,
      coin: 60, // ETH
    } as any)

    const result = await resolveReferrerToHex(mockClient, ensName)

    expect(result).toBeDefined()
    expect(result?.length).toBe(66) // 32 bytes = 64 hex chars + '0x'
    expect(result?.startsWith('0x')).toBe(true)
    expect(vi.mocked(getAddressRecord)).toHaveBeenCalledWith(mockClient, { name: ensName })
    // Should not call getOwner if address record exists
    expect(vi.mocked(getOwner)).not.toHaveBeenCalled()
  })

  it('should fall back to owner when no ETH address record exists', async () => {
    const ensName = 'test.eth'
    const mockOwnerAddress = '0x1234567890123456789012345678901234567890' as Address

    // No address record
    vi.mocked(getAddressRecord).mockResolvedValueOnce(null)

    // Has owner
    vi.mocked(getOwner).mockResolvedValueOnce({
      owner: mockOwnerAddress,
      ownershipLevel: 'registrar',
    } as any)

    const result = await resolveReferrerToHex(mockClient, ensName)

    expect(result).toBeDefined()
    expect(result?.length).toBe(66)
    expect(vi.mocked(getAddressRecord)).toHaveBeenCalledWith(mockClient, { name: ensName })
    expect(vi.mocked(getOwner)).toHaveBeenCalledWith(mockClient, { name: ensName })
  })

  it('should return null when ENS name has neither address record nor owner', async () => {
    vi.mocked(getAddressRecord).mockResolvedValueOnce(null)
    vi.mocked(getOwner).mockResolvedValueOnce(null)

    const result = await resolveReferrerToHex(mockClient, 'nonexistent.eth')
    expect(result).toBeNull()
  })

  it('should pass through valid hex addresses without resolution', async () => {
    const hexAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

    const result = await resolveReferrerToHex(mockClient, hexAddress)

    // Should not call ENS resolution functions for hex addresses
    expect(vi.mocked(getAddressRecord)).not.toHaveBeenCalled()
    expect(vi.mocked(getOwner)).not.toHaveBeenCalled()
    expect(result?.length).toBe(66)
  })

  it('should handle empty or undefined referrer', async () => {
    const result1 = await resolveReferrerToHex(mockClient, undefined)
    expect(result1).toBeNull()

    const result2 = await resolveReferrerToHex(mockClient, '')
    expect(result2).toBeNull()
  })

  it('should handle resolution errors gracefully', async () => {
    vi.mocked(getAddressRecord).mockRejectedValueOnce(new Error('Network error'))

    const result = await resolveReferrerToHex(mockClient, 'test.eth')
    expect(result).toBeNull()
  })

  it('should handle owner with no address', async () => {
    vi.mocked(getAddressRecord).mockResolvedValueOnce(null)
    vi.mocked(getOwner).mockResolvedValueOnce({
      owner: undefined,
      ownershipLevel: 'registrar',
    } as any)

    const result = await resolveReferrerToHex(mockClient, 'test.eth')
    expect(result).toBeNull()
  })
})
```

**Expected behavior:** Tests should fail with "resolveReferrerToHex is not defined"

### Step 2: Run test to verify it fails

Run: `pnpm test src/utils/referrer.test.ts`

Expected: FAIL with "resolveReferrerToHex is not exported from './referrer'"

### Step 3: Implement ENS forward resolution function

Add to `src/utils/referrer.ts` after the existing `getReferrerHex` function (after line 21):

```typescript
import { Client } from 'viem'
import { getAddressRecord, getOwner } from '@ensdomains/ensjs/public'

/**
 * Resolves a referrer (ENS name or hex address) to a 32-byte hex value.
 *
 * Resolution flow for ENS names:
 * 1. Try to get ETH address record from the name
 * 2. If no address record, fall back to owner/registrant address
 * 3. Convert the resolved address to 32-byte hex
 *
 * @param client - Viem client for blockchain queries
 * @param referrer - ENS name (e.g., 'vitalik.eth') or hex address
 * @returns 32-byte hex string or null if resolution fails
 */
export const resolveReferrerToHex = async (
  client: Client,
  referrer: string | undefined,
): Promise<`0x${string}` | null> => {
  if (!referrer) return null

  // If it's already a valid hex string, just pad it
  if (isHex(referrer)) {
    const paddedHex = getReferrerHex(referrer)
    return paddedHex === EMPTY_BYTES32 ? null : paddedHex
  }

  // Try to resolve as ENS name
  try {
    // Step 1: Try to get ETH address record
    const addressRecord = await getAddressRecord(client, { name: referrer })

    if (addressRecord?.value) {
      // Found address record, convert to hex
      return getReferrerHex(addressRecord.value)
    }

    // Step 2: Fall back to owner/registrant
    const ownerData = await getOwner(client, { name: referrer })

    if (ownerData?.owner) {
      // Found owner, convert to hex
      return getReferrerHex(ownerData.owner)
    }

    // No address record and no owner
    return null
  } catch (error) {
    console.error('Failed to resolve referrer ENS name:', error)
    return null
  }
}
```

**Note:** Need to update imports at top of file:

```typescript
import { Client, isHex, pad } from 'viem'
import { getAddressRecord, getOwner } from '@ensdomains/ensjs/public'
import { EMPTY_BYTES32 } from '@ensdomains/ensjs/utils'
```

### Step 4: Run test to verify it passes

Run: `pnpm test src/utils/referrer.test.ts`

Expected: All tests should pass

### Step 5: Add import statement to test file

Make sure test file has proper imports:

```typescript
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { Address } from 'viem'

import { EMPTY_BYTES32 } from '@ensdomains/ensjs/utils'
import { getAddressRecord, getOwner } from '@ensdomains/ensjs/public'

import { getReferrerHex, resolveReferrerToHex } from './referrer'
```

### Step 6: Run tests again to confirm

Run: `pnpm test src/utils/referrer.test.ts`

Expected: All tests pass

### Step 7: Commit utility function

```bash
git add src/utils/referrer.ts src/utils/referrer.test.ts
git commit -m "feat: add ENS forward resolution for referrer parameter

- Resolves ENS names to addresses (address record → owner fallback)
- Converts resolved addresses to 32-byte hex format
- Handles invalid names and resolution errors gracefully"
```

---

## Task 2: Create Hook for Referrer Resolution

**Files:**
- Create: `src/hooks/useResolvedReferrer.ts`
- Create: `src/hooks/useResolvedReferrer.test.tsx`

### Step 1: Write the failing test for the hook

Create `src/hooks/useResolvedReferrer.test.tsx`:

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Address } from 'viem'

import { resolveReferrerToHex } from '@app/utils/referrer'

vi.mock('@app/utils/referrer', () => ({
  resolveReferrerToHex: vi.fn(),
}))

vi.mock('wagmi', () => ({
  usePublicClient: vi.fn(() => ({ chain: { id: 1 } })),
}))

import { useResolvedReferrer } from './useResolvedReferrer'

describe('useResolvedReferrer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return null when no referrer provided', () => {
    const { result } = renderHook(() => useResolvedReferrer(undefined))

    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('should resolve ENS name to hex', async () => {
    const mockHex = '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045' as Address
    vi.mocked(resolveReferrerToHex).mockResolvedValueOnce(mockHex)

    const { result } = renderHook(() => useResolvedReferrer('vitalik.eth'))

    await waitFor(() => {
      expect(result.current.data).toBe(mockHex)
      expect(result.current.isLoading).toBe(false)
    })

    expect(vi.mocked(resolveReferrerToHex)).toHaveBeenCalledWith(
      expect.anything(),
      'vitalik.eth'
    )
  })

  it('should handle resolution errors gracefully', async () => {
    vi.mocked(resolveReferrerToHex).mockRejectedValueOnce(new Error('Resolution failed'))

    const { result } = renderHook(() => useResolvedReferrer('invalid.eth'))

    await waitFor(() => {
      expect(result.current.data).toBeNull()
      expect(result.current.isError).toBe(true)
    })
  })

  it('should handle null resolution result', async () => {
    vi.mocked(resolveReferrerToHex).mockResolvedValueOnce(null)

    const { result } = renderHook(() => useResolvedReferrer('nonexistent.eth'))

    await waitFor(() => {
      expect(result.current.data).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should not query when client is unavailable', () => {
    // Mock missing client
    vi.mocked(require('wagmi').usePublicClient).mockReturnValueOnce(undefined)

    const { result } = renderHook(() => useResolvedReferrer('vitalik.eth'))

    expect(result.current.isLoading).toBe(false)
    expect(vi.mocked(resolveReferrerToHex)).not.toHaveBeenCalled()
  })
})
```

**Expected behavior:** Test fails with "useResolvedReferrer is not defined"

### Step 2: Run test to verify it fails

Run: `pnpm test src/hooks/useResolvedReferrer.test.tsx`

Expected: FAIL with "Cannot find module './useResolvedReferrer'"

### Step 3: Implement the hook

Create `src/hooks/useResolvedReferrer.ts`:

```typescript
import { useQuery } from '@tanstack/react-query'
import { Hex } from 'viem'
import { usePublicClient } from 'wagmi'

import { resolveReferrerToHex } from '@app/utils/referrer'

type UseResolvedReferrerResult = {
  data: Hex | null
  isLoading: boolean
  isError: boolean
  error: Error | null
}

/**
 * Hook to resolve a referrer (ENS name or hex address) to a 32-byte hex value.
 *
 * For ENS names, attempts to:
 * 1. Get ETH address record from the name
 * 2. Fall back to owner/registrant if no address record
 * 3. Convert resolved address to 32-byte hex
 *
 * @param referrer - ENS name or hex address to resolve
 * @returns Query result with resolved hex value
 */
export const useResolvedReferrer = (
  referrer: string | undefined,
): UseResolvedReferrerResult => {
  const publicClient = usePublicClient()

  const query = useQuery({
    queryKey: ['resolved-referrer', referrer],
    queryFn: async () => {
      if (!publicClient || !referrer) return null
      return resolveReferrerToHex(publicClient, referrer)
    },
    enabled: !!referrer && !!publicClient,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}
```

### Step 4: Run test to verify it passes

Run: `pnpm test src/hooks/useResolvedReferrer.test.tsx`

Expected: Tests should pass

### Step 5: Commit the hook

```bash
git add src/hooks/useResolvedReferrer.ts src/hooks/useResolvedReferrer.test.tsx
git commit -m "feat: add useResolvedReferrer hook

- React hook wrapping resolveReferrerToHex utility
- Uses React Query for caching with 5min stale time
- Returns loading/error states for UI integration"
```

---

## Task 3: Update ExtendNames Flow to Use Resolved Referrer

**Files:**
- Modify: `src/transaction-flow/input/ExtendNames/ExtendNames-flow.tsx`
- Modify: `src/transaction-flow/input/ExtendNames/ExtendNames-flow.test.tsx`

### Step 1: Write failing test for resolved referrer in ExtendNames

Add to `src/transaction-flow/input/ExtendNames/ExtendNames-flow.test.tsx` at the appropriate location:

```typescript
import { useResolvedReferrer } from '@app/hooks/useResolvedReferrer'

// Add mock for useResolvedReferrer
vi.mock('@app/hooks/useResolvedReferrer', () => ({
  useResolvedReferrer: vi.fn(() => ({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
  })),
}))

// Add test case
it('should resolve ENS name referrer to hex', async () => {
  const mockReferrerHex = '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045' as Hex

  // Mock useReferrer to return an ENS name
  vi.mocked(useReferrer).mockReturnValue('vitalik.eth')

  // Mock useResolvedReferrer to return resolved hex
  vi.mocked(useResolvedReferrer).mockReturnValue({
    data: mockReferrerHex,
    isLoading: false,
    isError: false,
    error: null,
  })

  // Render and test component
  // Specific implementation depends on existing test structure
  // Verify that the transaction uses the resolved hex value
})

it('should handle failed referrer resolution gracefully', async () => {
  vi.mocked(useReferrer).mockReturnValue('invalid.eth')
  vi.mocked(useResolvedReferrer).mockReturnValue({
    data: null,
    isLoading: false,
    isError: true,
    error: new Error('Resolution failed'),
  })

  // Should continue with transaction flow, just without referrer
  // Specific test implementation depends on structure
})
```

**Expected behavior:** Test fails because component doesn't use `useResolvedReferrer` yet

### Step 2: Run test to verify it fails

Run: `pnpm test src/transaction-flow/input/ExtendNames/ExtendNames-flow.test.tsx`

Expected: FAIL - test assertion fails or useResolvedReferrer not imported

### Step 3: Update ExtendNames-flow.tsx to use resolved referrer

In `src/transaction-flow/input/ExtendNames/ExtendNames-flow.tsx`, add import (around line 22):

```typescript
import { useResolvedReferrer } from '@app/hooks/useResolvedReferrer'
```

Remove the import for `getReferrerHex` (no longer needed directly):

```typescript
// Remove or comment out:
// import { getReferrerHex } from '@app/utils/referrer'
```

Then update the component to use the resolved referrer. Find where `useReferrer` is called and update:

```typescript
export const ExtendNamesFlow = ({ /* props */ }: Props) => {
  // ... existing code ...

  const referrerParam = useReferrer()
  const { data: referrerHex, isLoading: isReferrerResolving } = useResolvedReferrer(referrerParam)

  // ... rest of the code ...
}
```

Update the loading check to include referrer resolution (find `isBaseDataLoading`):

```typescript
const isBaseDataLoading =
  !isAccountConnected ||
  isBalanceLoading ||
  isExpiryEnabledAndLoading ||
  isEthPriceLoading ||
  isReferrerResolving
```

Make sure `referrerHex` is passed to the transaction (should already be in place around line 327):

```typescript
const transactions = createTransactionItem('extendNames', {
  names,
  duration: seconds,
  startDateTimestamp: expiryDate?.getTime(),
  displayPrice: makeCurrencyDisplay({
    eth: totalRentFee,
    ethPrice,
    bufferPercentage: CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE,
    currency: userConfig.currency === 'fiat' ? 'usd' : 'eth',
  }),
  referrer: referrerHex,
  hasWrapped,
})
```

### Step 4: Run test to verify it passes

Run: `pnpm test src/transaction-flow/input/ExtendNames/ExtendNames-flow.test.tsx`

Expected: Tests pass

### Step 5: Commit the changes

```bash
git add src/transaction-flow/input/ExtendNames/ExtendNames-flow.tsx src/transaction-flow/input/ExtendNames/ExtendNames-flow.test.tsx
git commit -m "feat: integrate ENS forward resolution in ExtendNames flow

- Use useResolvedReferrer hook to resolve ENS names
- Add loading state for referrer resolution
- Remove direct use of getReferrerHex utility"
```

---

## Task 4: Update Registration Flow to Use Resolved Referrer

**Files:**
- Modify: `src/components/pages/profile/[name]/registration/Registration.tsx`

### Step 1: Identify where referrer is used in Registration

Read the Registration component to understand current referrer usage:

Run: `cat src/components/pages/profile/[name]/registration/Registration.tsx | grep -A5 -B5 referrer`

### Step 2: Add import for useResolvedReferrer

In `src/components/pages/profile/[name]/registration/Registration.tsx`, add import:

```typescript
import { useResolvedReferrer } from '@app/hooks/useResolvedReferrer'
```

### Step 3: Update Registration.tsx to use resolved referrer

Update component to resolve referrer. Find where `useReferrer()` is called and update:

```typescript
export const Registration = ({ /* props */ }) => {
  // ... existing code ...

  const referrerParam = useReferrer()
  const { data: resolvedReferrerHex } = useResolvedReferrer(referrerParam)

  // Update referrer in registration data when resolved
  useEffect(() => {
    if (resolvedReferrerHex && selectedItemProperties) {
      dispatch({
        name: 'setReferrer',
        selected: selectedItemProperties,
        payload: resolvedReferrerHex,
      })
    }
  }, [resolvedReferrerHex, selectedItemProperties, dispatch])

  // ... rest of code ...
}
```

Make sure to add React import if not present:

```typescript
import { useEffect } from 'react'
```

### Step 4: Run type checking

Run: `pnpm lint:types`

Expected: No type errors

### Step 5: Commit changes

```bash
git add src/components/pages/profile/[name]/registration/Registration.tsx
git commit -m "feat: integrate ENS forward resolution in registration flow

- Use useResolvedReferrer to resolve ENS names to addresses
- Update registration reducer with resolved hex value
- Automatic resolution on component mount and when referrer changes"
```

---

## Task 5: Update DesyncedMessage Component (if needed)

**Files:**
- Check: `src/components/@molecules/DesyncedMessage/DesyncedMessage.tsx`

### Step 1: Check if DesyncedMessage uses getReferrerHex

Run: `cat src/components/@molecules/DesyncedMessage/DesyncedMessage.tsx | grep -C5 getReferrerHex`

### Step 2: Update if it uses referrer

If it uses `getReferrerHex`, update to use `useResolvedReferrer` hook instead.

Follow same pattern as ExtendNames flow:
- Add import for `useResolvedReferrer`
- Replace `getReferrerHex(referrerParam)` with hook usage
- Add loading state if needed

### Step 3: Run tests

Run: `pnpm test src/components/@molecules/DesyncedMessage/`

Expected: Tests pass

### Step 4: Commit if changes made

```bash
git add src/components/@molecules/DesyncedMessage/DesyncedMessage.tsx
git commit -m "feat: update DesyncedMessage to use resolved referrer"
```

---

## Task 6: Add Integration Tests

**Files:**
- Modify: `e2e/specs/stateless/extendNames.spec.ts`

### Step 1: Add E2E test for ENS name referrer in extend names

Add to `e2e/specs/stateless/extendNames.spec.ts`:

```typescript
test('should accept ENS name as referrer parameter for extending', async ({ page, login, makeName }) => {
  const name = await makeName({
    label: 'extend',
    type: 'legacy',
  })

  // Navigate with ENS name referrer
  await page.goto(`/${name}?referrer=vitalik.eth`)
  await login.connect()

  // Start extend flow
  await page.click('[data-testid="extend-button"]')

  // Verify the flow continues without error
  await expect(page.locator('[data-testid="extend-names-modal"]')).toBeVisible()

  // The referrer resolution should happen in background
  // Transaction should be created with resolved hex value
})
```

### Step 2: Add E2E test for hex referrer still working

```typescript
test('should still accept hex address as referrer for extending', async ({ page, login, makeName }) => {
  const name = await makeName({
    label: 'extend-hex',
    type: 'legacy',
  })

  await page.goto(`/${name}?referrer=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`)
  await login.connect()

  await page.click('[data-testid="extend-button"]')
  await expect(page.locator('[data-testid="extend-names-modal"]')).toBeVisible()
})
```

### Step 3: Add E2E test for registration with ENS referrer

Modify `e2e/specs/stateless/registerName.spec.ts`:

```typescript
test('should register with ENS name referrer', async ({ page, login }) => {
  const label = `registration-referrer-${Date.now()}`

  await page.goto(`/${label}.eth?referrer=vitalik.eth`)
  await login.connect()

  // Start registration
  // ... existing registration flow ...

  // Verify registration completes successfully
})
```

### Step 4: Run E2E tests

Run: `pnpm denv` (start local environment)
Run: `pnpm e2e e2e/specs/stateless/extendNames.spec.ts`
Run: `pnpm e2e e2e/specs/stateless/registerName.spec.ts`

Expected: Tests pass

### Step 5: Commit E2E tests

```bash
git add e2e/specs/stateless/extendNames.spec.ts e2e/specs/stateless/registerName.spec.ts
git commit -m "test: add E2E tests for ENS name referrer resolution"
```

---

## Task 7: Update Documentation

**Files:**
- Modify: `README.md` or create docs file

### Step 1: Document referrer parameter enhancement

Add documentation section about referrer parameter:

```markdown
## Referrer Parameter

The `referrer` URL parameter supports both hex addresses and ENS names:

### Usage Examples

**Hex Address:**
```
?referrer=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

**ENS Name:**
```
?referrer=vitalik.eth
```

### Resolution Logic

When an ENS name is provided:

1. **Address Record Lookup**: First attempts to get the ETH address record set on the name
2. **Owner Fallback**: If no address record exists, falls back to the name's owner/registrant address
3. **Hex Conversion**: Converts the resolved address to a 32-byte hex value for the contract

If resolution fails at any step, the referrer parameter is ignored and the transaction proceeds normally.

### Technical Details

- Resolution is cached for 5 minutes to improve performance
- Invalid referrers (non-hex, non-ENS) are silently ignored
- Resolution happens asynchronously without blocking the UI
```

### Step 2: Commit documentation

```bash
git add README.md
git commit -m "docs: document ENS name support for referrer parameter"
```

---

## Task 8: Run Full Test Suite and Type Check

### Step 1: Run type checking

Run: `pnpm lint:types`

Expected: No type errors

### Step 2: Run all unit tests

Run: `pnpm test`

Expected: All tests pass

### Step 3: Run linting

Run: `pnpm lint`

Expected: No lint errors

### Step 4: Fix any issues found

If there are type errors, test failures, or lint issues:
- Review error messages carefully
- Fix issues one by one
- Re-run checks after each fix

### Step 5: Commit fixes if any

```bash
git add .
git commit -m "fix: address type errors and test failures"
```

---

## Task 9: Manual Testing

### Step 1: Start local development environment

Run: `pnpm denv`

Wait for environment to be ready, then in another terminal:

Run: `pnpm dev:glocal`

### Step 2: Test ENS name referrer in registration

1. Navigate to `localhost:3000/test-name-12345.eth?referrer=vitalik.eth`
2. Connect wallet
3. Start registration process
4. Open browser dev tools → Network tab
5. Verify referrer resolution request
6. Complete registration
7. Verify transaction includes resolved referrer hex

### Step 3: Test ENS name with no address record

1. Create or find ENS name with no address record
2. Navigate to registration with that name as referrer
3. Verify it falls back to owner address
4. Verify registration completes

### Step 4: Test hex address referrer still works

1. Navigate to `localhost:3000/test-name-67890.eth?referrer=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`
2. Start registration
3. Verify hex referrer works without resolution attempt
4. Complete registration

### Step 5: Test extend names with ENS referrer

1. Create a name that's already registered
2. Navigate to `localhost:3000/<name>?referrer=vitalik.eth`
3. Click extend button
4. Verify ENS name is resolved
5. Complete extension

### Step 6: Test invalid referrer handling

1. Navigate to `localhost:3000/test-invalid.eth?referrer=this-does-not-exist.eth`
2. Start registration
3. Verify flow continues without error
4. Verify no referrer is included in transaction

---

## Task 10: Final Review and Cleanup

### Step 1: Review all changes

Run: `git diff main`

Review all modifications to ensure:
- Code follows DRY principles (reuses `getReferrerHex` utility)
- No unnecessary code added (YAGNI - only ENS resolution, no extra features)
- Tests cover edge cases (address record, owner fallback, errors)
- TypeScript types are correct
- No console.logs or debug code left (except intentional error logging)

### Step 2: Check for unused imports

Run: `pnpm lint`

Fix any unused import warnings.

### Step 3: Run full build

Run: `pnpm build`

Expected: Build succeeds without errors or warnings

### Step 4: Create final cleanup commit if needed

```bash
git add .
git commit -m "chore: final cleanup for referrer resolution feature"
```

### Step 5: Verify git log

Run: `git log --oneline main..HEAD`

Review commit history:
- Each commit should be atomic
- Commit messages should be clear
- No WIP or temporary commits

---

## Verification Checklist

Before marking this feature complete, verify:

- ✅ Unit tests pass for `resolveReferrerToHex` utility
  - ✅ Address record resolution
  - ✅ Owner fallback
  - ✅ Hex passthrough
  - ✅ Error handling
- ✅ Unit tests pass for `useResolvedReferrer` hook
- ✅ ExtendNames flow resolves ENS names
- ✅ Registration flow resolves ENS names
- ✅ Hex addresses still work without resolution
- ✅ Invalid referrers handled gracefully
- ✅ Type checking passes (`pnpm lint:types`)
- ✅ All tests pass (`pnpm test`)
- ✅ E2E tests pass
- ✅ Build succeeds (`pnpm build`)
- ✅ Manual testing confirms:
  - ✅ ENS name → address record works
  - ✅ ENS name → owner fallback works
  - ✅ Hex addresses work
  - ✅ Invalid names handled
- ✅ Documentation updated

---

## Notes

**DRY (Don't Repeat Yourself):**
- Reuse `getReferrerHex` for hex padding in all cases
- Single `resolveReferrerToHex` function used by all flows
- Hook wraps utility for React integration

**YAGNI (You Aren't Gonna Need It):**
- Only implement ENS → Address resolution (address record + owner fallback)
- Don't add complex caching beyond React Query defaults
- Don't add UI loading indicators unless explicitly needed
- Don't add logging beyond error cases

**TDD (Test-Driven Development):**
- Each task follows RED (write test) → GREEN (make it pass) → REFACTOR pattern
- Tests written before implementation
- Edge cases covered in tests

**Frequent Commits:**
- Commit after each task completes
- Clear, descriptive commit messages following conventional commits
- Atomic commits for easy review and rollback if needed

**Forward Resolution Flow:**
1. Input: ENS name (e.g., `vitalik.eth`)
2. Try `getAddressRecord` → if has address, use it
3. If no address, try `getOwner` → use owner address
4. Convert address to 32-byte hex
5. Output: `0x000...000<address>`
