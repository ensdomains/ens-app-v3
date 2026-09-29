# Official composite-resolver allowlist

**Branch:** `fix/untrusted-composite-resolver` (off `origin/main` = `89f8681d5`)

**Goal:** Stop ENS Manager from treating an arbitrary `ICompositeResolver` self-report as an official ENSv2 mirror. Only unwrap when the *outer* registry resolver is an ENS-deployed composite for the active chain.

**Do not** implement a mock composite on denv as the official mirror. Do not pull contracts-v2 into `ens-test-env`. Do not use a Tenderly fork for this fix.

---

## Context

PR #1164 (`getUnderlyingResolver` / `useEffectiveResolverAddress`) probes any unknown registry resolver for ERC-165 `ICompositeResolver` (`0xeea330f9`) and substitutes `getResolver()` as the address to judge, display, and write through.

That is correct **only** for ENS’s own mirrors (`ENSV1Resolver`, etc.). ERC-165 is a self-report. An attacker can:

1. Deploy a contract that returns `true` for `supportsInterface(0xeea330f9)` and names the Public Resolver from `getResolver`
2. `setResolver` on a name they own, then transfer it
3. The manager hides the spoof, labels Public Resolver as `latest`, writes records to Public Resolver, and disables “Use latest resolver”
4. Canonical resolution still follows the registry (spoof)

Official ENSv2 composites are **Sepolia-only** today (`ENSV1Resolver` `0xae66c62AcAE72098BdAc57d8E8AED53EF000b2Ba`). The app bug is live on **mainnet** because the probe runs on every chain except that we now also probe localhost (needed for denv e2e).

Immunefi #91649. Valid bug; Critical/direct-theft is inflated. Fix is the allowlist.

apps-monorepo never unwraps via ERC-165; it allowlists official resolvers by address. Match that trust model.

---

## Current branch (already done)

Two commits. Tests are **red** on purpose (TDD).

1. `853bb7d6a` — unit/component tests for untrusted composite claims
2. `9b3d65857` — denv e2e + localhost probe enabled

### Red tests (must go green)

| File | Assertion |
|---|---|
| `src/hooks/resolver/useEffectiveResolverAddress.test.ts` | Do not probe `0xa11ce…`. Do not substitute Public Resolver when the probe names it. |
| `src/hooks/resolver/useResolverType.test.ts` | Unknown outer that names Public Resolver stays `custom` |
| `src/hooks/resolver/resolverAbstraction.test.ts` | `effectiveResolverAddress` stays the attacker; not `hasLatestResolver`; not the editor-as-latest view |
| `src/transaction-flow/input/EditResolver/EditResolver.untrustedComposite.test.tsx` | Latest-resolver radio enabled and preselected |
| `e2e/specs/stateless/untrustedCompositeResolver.spec.ts` | More tab shows spoof, not Public Resolver |

Attacker address used in unit tests: `0xa11ce000000000000000000000000000000a11ce`

### Existing tests that will break unless updated

These treat a random `0x1111…` / `0x1000…` outer as an official abstraction (they mock `useUnderlyingResolver` returning the Public Resolver):

- `useEffectiveResolverAddress.test.ts` — “return the underlying resolver when the registry resolver is an abstraction”
- `useEffectiveResolverAddress.test.ts` — “should still look up a resolver that is not a known one”
- `useResolverType.test.ts` — abstraction → `latest` / `outdated` / in-flight
- `resolverAbstraction.test.ts` — ready-to-edit / write-through / wrapped / unusable underlying
- `EditResolver.test.tsx` — abstracted name already on latest

After the allowlist, `0x1111…` is **not** official. Happy-path tests must use an allowlisted outer address (Sepolia `ENSV1Resolver` + `chainId` 11155111, or mock `isOfficialCompositeResolver`).

`getUnderlyingResolver` itself stays a decoder. Do **not** put the allowlist there unless you also pass chain/allowlist in; policy belongs in `useEffectiveResolverAddress`.

---

## Implementation

### 1. Official composite list

Add next to `getKnownResolverData` in `src/constants/resolverAddressData.ts`.

These are **not** `KNOWN_RESOLVER_DATA` rows. Known public resolvers are never mirrors and must still skip the probe. Composites are the opposite: they *are* the probe targets.

```ts
export const OFFICIAL_COMPOSITE_RESOLVERS: Record<string, Address[] | undefined> = {
  '1': [], // ENSv2 mirrors not on mainnet yet
  '11155111': [
    '0xae66c62AcAE72098BdAc57d8E8AED53EF000b2Ba', // ENSV1Resolver (Sepolia)
    // Optionally also Sepolia ENSV2Resolver / DNSTLDResolver if the manager
    // can see them as a name's registry resolver. Prefer including them:
    // ENSV2Resolver 0x508cb4e4596429ca98a1bb3112d88d18f92456b5
    // DNSTLDResolver — look up current sepolia.md in contracts-v2
  ],
  '1337': [], // denv has no official mirror; spoof must stay off this list
}

export const isOfficialCompositeResolver = ({
  chainId,
  resolverAddress,
}: {
  chainId: number
  resolverAddress: string
}): boolean =>
  !!OFFICIAL_COMPOSITE_RESOLVERS[String(chainId)]?.some(
    (address) => address.toLowerCase() === resolverAddress.toLowerCase(),
  )
```

Checksum with `getAddress` when writing literals. Add a small unit test file for the helper (empty mainnet, sepolia hit, 1337 miss, attacker miss).

### 2. Gate `useEffectiveResolverAddress`

`src/hooks/resolver/useEffectiveResolverAddress.ts`

Probe **only** official composites. Ignore probe `data` unless the outer address is official (mocked `useUnderlyingResolver` can still return data when `enabled` is false).

```ts
const isOfficialComposite = isOfficialCompositeResolver({
  chainId,
  resolverAddress: resolverAddress ?? '',
})

const enabled =
  enabled_ && !!name && !reportedIsKnownResolver && isOfficialComposite

const underlyingResolverAddress = isOfficialComposite
  ? (underlyingResolver.data ?? undefined)
  : undefined
```

Keep using `underlyingResolverAddress ?? resolverAddress` for `data`, and `isAbstracted: !!underlyingResolverAddress`.

Update the comment: known public resolvers are never mirrors; unknown contracts are never trusted as mirrors; only the allowlist is probed.

`useUnderlyingResolver` / `getUnderlyingResolver` — no behaviour change required.

### 3. Fix existing happy-path tests

Wherever an outer `0x1111…` / `0x1000…` is meant to be the official mirror:

- Set `useChainId` to `11155111` if the test file mocks it
- Use Sepolia `ENSV1Resolver` as the outer address **or** mock `isOfficialCompositeResolver` to return true for that outer

“should still look up a resolver that is not a known one” currently expects a probe on unknown `0x1111…`. Change it to:

- unknown / attacker → `enabled: false`
- official composite (Sepolia address, chain 11155111) → `enabled: true`

### 4. Verify

```sh
pnpm exec vitest run \
  src/hooks/resolver/useEffectiveResolverAddress.test.ts \
  src/hooks/resolver/useResolverType.test.ts \
  src/hooks/resolver/resolverAbstraction.test.ts \
  src/transaction-flow/input/EditResolver/EditResolver.test.tsx \
  src/transaction-flow/input/EditResolver/EditResolver.untrustedComposite.test.tsx \
  src/utils/resolver/getUnderlyingResolver.test.ts
```

All previously red security tests must pass. All previously green abstraction tests must pass after the address/chain updates.

E2e (needs `pnpm denv` + app on :3000, Chromium installed):

```sh
pnpm exec playwright test e2e/specs/stateless/untrustedCompositeResolver.spec.ts --project=stateless --reporter=line
```

Expect More tab text = spoof, latest-resolver radio enabled.

Also run the rest of resolver unit tests if you touch shared mocks.

### 5. Lint / types

```sh
pnpm lint:types
pnpm exec eslint src/constants/resolverAddressData.ts src/hooks/resolver/useEffectiveResolverAddress.ts
```

No `any`. Follow existing comment style in these files.

---

## What not to do

- Do not allowlist the e2e spoof or `0xa11ce…`.
- Do not re-introduce `chainId !== localhost.id` as a probe skip.
- Do not put authenticity checks in `decodeUnderlyingResolver` (shape-only is correct).
- Do not deploy real `ENSV1Resolver` into denv / change `ens-test-env` for this ticket.
- Do not change `updateEthAddress` / write builders. They already pin whatever the hook judged; judging correctly is the fix.
- Do not claim Critical/direct theft in comments. This is “don’t trust ERC-165 as authenticity.”

---

## Done when

- Untrusted outer that names Public Resolver is `custom`, visible, writable-repair available (unit + e2e green).
- Official Sepolia `ENSV1Resolver` still unwraps (existing abstraction tests green with allowlisted outer).
- Known Public Resolver still skips the probe.
- Mainnet allowlist is empty until ENS ships the mirror there.

---

## Suggested commit

```
Only unwrap official ENS composite resolvers

ICompositeResolver is a self-report. Probe and substitute getResolver
only when the registry resolver is an ENS-deployed mirror for the
active chain. Unknown contracts stay the judged, displayed, and
write-target address.
```
