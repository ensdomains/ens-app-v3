# ENS.js Overrides

Temporary overrides for ENS.js functions to support interim contract deployment strategy.

## Why These Exist

During the transition to ENS contracts v1.6.0, some functionality requires special handling:

1. **Wrapped names** - Temporarily use a separate renewal contract (`0xdbC43Ba45381e02825b14322cDdd15eC4B3164E6`)
2. **Bulk renewals** - Use legacy `StaticBulkRenewal` contract without referrer support

## Files

### `renewNames.ts`

Overrides the standard `renewNames` function from `@ensdomains/ensjs/wallet` with logic to:

- Route single wrapped name renewals to the wrapped name registrar controller
- Route bulk renewals to the legacy bulk renewal contract (omits referrer parameter)
- Route single unwrapped name renewals to standard ETHRegistrarController (with referrer support)

**Usage:**

```typescript
import renewNames from '@app/overrides/ensjs/renewNames'

// Instead of:
// import { renewNames } from '@ensdomains/ensjs/wallet'

const txRequest = renewNames.makeFunctionData(connectorClient, {
  nameOrNames: names,
  duration,
  value: priceWithBuffer,
  referrer,
  hasWrapped, // ← Additional parameter for wrapped name detection
})
```

## When to Remove

These overrides should be removed once:

1. ENS contracts v1.6.0 are fully deployed to all networks
2. The wrapped name registrar controller is integrated into the main controller
3. The bulk renewal contract supports referrals
4. ENS.js is updated to handle these cases natively

## Updating Contract Addresses

The wrapped name renewal contract address is currently hardcoded. To override it per-chain, you can:

1. Add it to the chain contracts configuration in `src/constants/chains.ts`
2. Pass `wrappedRenewalContract` parameter to `makeFunctionData`
