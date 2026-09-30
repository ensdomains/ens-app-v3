# Official composite-resolver allowlist

**Branch:** `fix/untrusted-composite-resolver` (off `origin/main` = `89f8681d5`)

**Goal:** Stop ENS Manager from treating an arbitrary `ICompositeResolver` self-report as an official ENSv2 mirror. Only unwrap when the _outer_ registry resolver is an ENS-deployed composite for the active chain.

**Do not** implement a mock composite on denv as the official mirror. Do not pull contracts-v2 into `ens-test-env`. Do not use a Tenderly fork for this fix.

---

## Context

PR #1164 (`getUnderlyingResolver` / `useEffectiveResolverAddress`) probes any unknown registry resolver for ERC-165 `ICompositeResolver` (`0xeea330f9`) and substitutes `getResolver()` as the address to judge, display, and write through.

That is correct **only** for ENS’s own mirrors (`ENSV1Resolver`, etc.). ERC-165 is a self-report. An attacker can:

1. Deploy a contract that returns `true` for `supportsInterface(0xeea330f9)` and names the Public Resolver from `getResolver`
2. `setResolver` on a name they own, then transfer it
3. The manager hides the spoof, labels Public Resolver as `latest`, writes records to Public Resolver, and disables “Use latest resolver”
4. Canonical resolution still follows the registry (spoof)

Official ENSv2 composites are **Sepolia-only** today. Before this fix, the app probed unknown registry resolvers on mainnet and other supported non-local chains. The localhost regression fixture remains untrusted and is not added to the official allowlist.

Immunefi #91649. Valid bug; Critical/direct-theft is inflated. Fix is the allowlist.

apps-monorepo never unwraps via ERC-165; it allowlists official resolvers by address. Match that trust model.

---

## Implementation status

The allowlist and its unit, component, and end-to-end regression coverage are implemented on this branch.

### Regression coverage

| File                                                                               | Assertion                                                                                             |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/hooks/resolver/useEffectiveResolverAddress.test.ts`                           | Do not probe `0xa11ce…`. Do not substitute Public Resolver when the probe names it.                   |
| `src/hooks/resolver/useResolverType.test.ts`                                       | Unknown outer that names Public Resolver stays `custom`                                               |
| `src/hooks/resolver/resolverAbstraction.test.ts`                                   | `effectiveResolverAddress` stays the attacker; not `hasLatestResolver`; not the editor-as-latest view |
| `src/transaction-flow/input/EditResolver/EditResolver.untrustedComposite.test.tsx` | Latest-resolver radio enabled and preselected                                                         |
| `e2e/specs/stateless/untrustedCompositeResolver.spec.ts`                           | More tab shows spoof, not Public Resolver                                                             |

Attacker address used in unit tests: `0xa11ce000000000000000000000000000000a11ce`

### Updated happy-path coverage

The following tests previously treated a random `0x1111…` / `0x1000…` outer as an official abstraction by mocking `useUnderlyingResolver` to return the Public Resolver:

- `useEffectiveResolverAddress.test.ts` — “return the underlying resolver when the registry resolver is an abstraction”
- `useEffectiveResolverAddress.test.ts` — “should still look up a resolver that is not a known one”
- `useResolverType.test.ts` — abstraction → `latest` / `outdated` / in-flight
- `resolverAbstraction.test.ts` — ready-to-edit / write-through / wrapped / unusable underlying
- `EditResolver.test.tsx` — abstracted name already on latest

Their happy paths now use an allowlisted outer address or explicitly mock the allowlist policy. Unknown outer addresses remain untrusted.

`getUnderlyingResolver` itself stays a decoder. Do **not** put the allowlist there unless you also pass chain/allowlist in; policy belongs in `useEffectiveResolverAddress`.

---

## Implemented design

### 1. Official composite list

[`src/constants/resolverAddressData.ts`](../../src/constants/resolverAddressData.ts) owns the active-chain allowlist and its address literals. These entries are deliberately separate from `KNOWN_RESOLVER_DATA`: known public resolvers skip the probe, while allowlisted composites are the only probe targets.

### 2. Gate `useEffectiveResolverAddress`

[`src/hooks/resolver/useEffectiveResolverAddress.ts`](../../src/hooks/resolver/useEffectiveResolverAddress.ts) probes and consumes underlying-resolver data only when the outer address is allowlisted for the active chain. Known public resolvers and unknown contracts are not probed. `useUnderlyingResolver` and `getUnderlyingResolver` remain shape-only mechanisms; they do not authenticate the outer address.

### 3. Fix existing happy-path tests

Wherever an outer `0x1111…` / `0x1000…` represented the official mirror, the test now:

- sets `useChainId` to `11155111` when the test file mocks it; and
- uses Sepolia `ENSV1Resolver` as the outer address or mocks `isOfficialCompositeResolver` for the fixture.

The former “should still look up a resolver that is not a known one” case is split into:

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
