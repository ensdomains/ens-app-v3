# Patch Issues To Address

## 1. Viem Patch Version Mismatch

### Issue

The patch file `patches/viem@2.19.4.patch` was created for viem 2.19.4 but viem has been upgraded to 2.34.0. The patch needs to be updated.

### What the Patch Does

The patch adds an optional `key` parameter to `getEnsAvatar` so it can fetch and parse other ENS image records (like `header` or `banner`), not just the hardcoded `avatar` key.

**Original behavior:** Always fetches the `'avatar'` text record
**Patched behavior:** Fetches `key || 'avatar'`, allowing any image record to use the avatar parsing pipeline

### Why It's Needed

Upstream viem (as of 2.34.0) still does not support this feature. The `getEnsAvatar` function hardcodes `key: 'avatar'` in the call to `getEnsText`.

### Action Required

1. Rename `patches/viem@2.19.4.patch` to `patches/viem@2.34.0.patch`
2. Verify the patch applies cleanly (line numbers may have shifted)
3. If it doesn't apply, regenerate the patch against viem 2.34.0 source files:
   - `actions/ens/getEnsAvatar.ts`
   - `_esm/actions/ens/getEnsAvatar.js`
   - `_cjs/actions/ens/getEnsAvatar.js`
4. Remove the `pnpm-lock.yaml` section from the patch (it was accidentally included)

### Files Modified by Patch

- `actions/ens/getEnsAvatar.ts` - TypeScript source
- `_esm/actions/ens/getEnsAvatar.js` - ESM build output
- `_cjs/actions/ens/getEnsAvatar.js` - CJS build output

---

## 2. Viem Patch May Be Unused

### Issue

The patched `getEnsAvatar` function from viem is **not imported or used anywhere in the codebase**. The app uses a custom `useEnsAvatar` hook in `src/hooks/useEnsAvatar.ts` that fetches from the ENS metadata service (`https://metadata.ens.domains/`) instead of using viem's implementation.

### Investigation Needed

- Determine if the viem patch is actually needed
- If not needed, the patch can be deleted entirely
- If it was intended for future use, document why it exists

---

## 3. Ox Patch (Minor)

### Note

There's also a patch for `ox@0.8.7` (`patches/ox@0.8.7.patch`) which fixes an issue in `Authorization.fromTuple` where spreading an undefined signature would cause issues. This patch appears to be for the correct version currently in use.
