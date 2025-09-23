# Revert isLegacyRegistration Implementation Plan

## Background
The `isLegacyRegistration` functionality was added in commit `b227233f8` (Author: storywithoutend, Date: Wed Jan 8 22:29:04 2025) to support legacy ETH registrar controller. We need to revert these changes and return to using only the standard `commitName` and `registerName` functions from ensjs.

## Original Implementation (Before Legacy Support)
The original implementation used only the standard ensjs functions without any conditional logic for legacy registration.

## To-Do List

### 1. ✅ Research Completed
- [x] Found commit that added isLegacyRegistration: `b227233f8`
- [x] Identified all files using isLegacyRegistration
- [x] Retrieved original implementation before legacy support

### 2. ✅ Core Transaction Files to Modify

#### [x] Update `src/transaction-flow/transaction/registerName.ts` ✅
**Completed:** Successfully reverted to standard registration

**Target state (revert to):**
```typescript
import type { TFunction } from 'react-i18next'

import { getPrice } from '@ensdomains/ensjs/public'
import { RegistrationParameters } from '@ensdomains/ensjs/utils'
import { registerName } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { calculateValueWithBuffer, formatDurationOfDates } from '@app/utils/utils'

type Data = RegistrationParameters
const now = Math.floor(Date.now())
const displayItems = (
  { name, duration }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: t('transaction.description.registerName'),
  },
  {
    label: 'duration',
    value: formatDurationOfDates({
      startDate: new Date(),
      endDate: new Date(now + duration * 1000),
      t,
    }),
  },
]

const transaction = async ({
  client,
  connectorClient,
  data,
}: TransactionFunctionParameters<Data>) => {
  const price = await getPrice(client, { nameOrNames: data.name, duration: data.duration })
  const value = price.base + price.premium
  const valueWithBuffer = calculateValueWithBuffer(value)

  return registerName.makeFunctionData(connectorClient, {
    ...data,
    value: valueWithBuffer,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
```

#### [x] Update `src/transaction-flow/transaction/commitName.ts` ✅
**Completed:** Successfully reverted to standard commitment

**Target state (revert to):**
```typescript
import type { TFunction } from 'react-i18next'

import { RegistrationParameters } from '@ensdomains/ensjs/utils'
import { commitName } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = RegistrationParameters & { name: string }

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: t('transaction.description.commitName'),
  },
  {
    label: 'info',
    value: t('transaction.info.commitName'),
  },
]

const transaction = async ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  return commitName.makeFunctionData(connectorClient, data)
}

export default { displayItems, transaction } satisfies Transaction<Data>
```

### 3. ⏳ Check Public Resolver References

#### [ ] Verify Public Resolver Usage
**Important:** Check that registration is using the latest public resolver from the updated ens-contracts package (1.6.0)
- Check which resolver is being referenced during name registration
- Ensure it's using the latest public resolver that was just added in ens-contracts
- Update any hardcoded resolver addresses if necessary
- Verify resolver is correctly set in registration parameters

### 4. ⏳ Hook Files to Modify

#### [ ] Update `src/hooks/gasEstimation/calculateTransactions.ts`
**Changes needed:**
- Remove imports: `isLegacyRegistration`, `makeLegacyRegistrationParams`, `makeLegacyCommitment`
- Remove the `isLegacy` variable and conditional logic
- Simplify state override to only use standard ETH registrar controller
- Use only `makeCommitment` instead of conditional `makeLegacyCommitment`

#### [ ] Update `src/hooks/registration/useSimulateRegistration.ts`
**Changes needed:**
- Remove imports: `isLegacyRegistration`, `makeLegacyRegistrationParams`, `legacyEthRegistrarControllerRegisterWithConfigSnippet`, `makeLegacyRegistrationWithConfigTuple`
- Remove `makeSimulateRegistrationParams` conditional logic
- Simplify to always use:
  - `ethRegistrarControllerRegisterSnippet`
  - `makeRegistrationTuple`
  - Standard ETH registrar controller address

### 5. ⏳ Files to Delete
- [ ] `src/utils/registration/isLegacyRegistration.ts`
- [ ] `src/utils/registration/isLegacyRegistration.test.ts`
- [ ] `src/utils/registration/makeLegacyRegistrationParams.ts`
- [ ] `src/utils/registration/makeLegacyRegistrationParams.test.ts`

### 6. ⏳ Additional Files to Check and Update

#### [ ] Update `src/components/pages/profile/[name]/registration/steps/Transactions.tsx`
- Remove any references to `isLegacyRegistration`

#### [ ] Update deploy scripts (if needed)
- `deploy/00_register_desynced.ts`

#### [ ] Update Playwright test fixtures (if needed)
- `playwright/fixtures/makeName/index.ts`
- `playwright/fixtures/makeName/generators/legacyWithConfigNameGenerator.ts`
- `playwright/fixtures/makeName/generators/legacyNameGenerator.ts`

### 7. ⏳ Additional Required Updates

#### [x] Update RegistrationReducerDataItem for Updated RegistrationParameters ✅
**Completed:** Successfully updated types and data flow
- Removed the `permissions` field from `RegistrationReducerDataItem` as it's not part of the standard `RegistrationParameters`
- Added `referrer` field to `RegistrationReducerDataItem` to support referral tracking
- Updated `useRegistrationReducer` to handle the new `referrer` field (default: '0x')
- Updated `useRegistrationParams` to properly receive and pass the `referrer` value
- Removed `CurrentChildFuses` import from types.ts
- Removed `childFuseObj` import from useRegistrationReducer.ts

#### [x] Add setReferrer Action to Registration Reducer ✅
**Completed:** Successfully added setReferrer action
- Added new action type `setReferrer` to `RegistrationReducerAction` in types.ts
- Implemented the `setReferrer` case in the reducer switch statement in useRegistrationReducer.ts
- This allows updating the referrer value during the registration flow
- The referrer can now be set from URL params, user input, or a default ENS referrer address

#### [x] Add Latest PublicResolver to Known Resolver List ✅
**Completed:** Manually updated by user
- The `KNOWN_RESOLVER_DATA` in `src/constants/resolverAddressData.ts` has been updated
- The latest PublicResolver is now recognized as a valid resolver

#### [x] Update IndexedDB version ✅
**Completed:** Version incremented from 3 to 4
- Updated `REGISTRATION_REDUCER_DATA_ITEM_VERSION` from 3 to 4 in useRegistrationReducer.ts
- This ensures clean migration from legacy registration data structure
- Existing stored data with version 3 will be invalidated and recreated with the new structure

#### [ ] Verify and Update RegistrationParameters compatibility
- Check if RegistrationParams used in registration transaction flow matches RegistrationParameters from ensjs
- If they match, update the following fields:
  - **reverseRecord**: Now uses type 0-2 instead of boolean
    - 0: No reverse record
    - 1: Set reverse record
    - 2: Set reverse record with primary name
  - **referrer**: Update referrer value handling

#### [x] Create QA Testing Notes ✅

## QA Testing Checklist

### Registration Flow Testing

#### Basic Registration Tests
- [ ] Register a new name with minimum duration (28 days)
- [ ] Register a new name with 1 year duration
- [ ] Register a new name with 5 year duration
- [ ] Register a name with special characters/numbers

#### Commitment & Transaction Tests
- [ ] Verify commitment transaction creates correct hash using `makeCommitment`
- [ ] Verify 60-second wait period is enforced after commitment
- [ ] Verify registration transaction uses `registerName` from ensjs
- [ ] Verify gas estimation works correctly for both transactions
- [ ] Test registration with insufficient funds (should show error)
- [ ] Test interrupting registration flow and resuming

#### Reverse Record Tests
- [ ] Test registration WITHOUT reverse record (value should be 0)
- [ ] Test registration WITH reverse record (value should be 2)
- [ ] Verify reverse record is correctly set on-chain after registration
- [ ] Test that primary name is set when reverse record is enabled

#### Resolver & Records Tests
- [ ] Verify the latest NameWrapperPublicResolver is used (not legacy resolver)
- [ ] Test registration with ETH address record
- [ ] Test registration with multiple records (ETH, BTC, email, etc.)
- [ ] Test registration with text records
- [ ] Verify all records are correctly set after registration

#### Edge Cases & Error Handling
- [ ] Test registration when name is already taken
- [ ] Test registration with expired commitment
- [ ] Test registration with network issues/delays
- [ ] Test switching accounts during registration
- [ ] Test registration on different networks (Sepolia, Holesky)

#### Legacy Code Verification
- [ ] Confirm NO references to `isLegacyRegistration` in code
- [ ] Confirm NO references to `makeLegacyRegistrationParams` in code
- [ ] Confirm NO legacy controller addresses are used
- [ ] Verify only standard ENS.js functions are called
- [ ] Check network requests to ensure correct contract calls

#### UI/UX Tests
- [ ] Verify pricing displays correctly
- [ ] Verify transaction status updates properly
- [ ] Test back navigation during registration
- [ ] Test error messages display correctly
- [ ] Verify success message after registration

### Technical Verification
- [ ] Check browser console for any errors during registration
- [ ] Verify IndexedDB stores registration data correctly
- [ ] Confirm transaction hashes are valid
- [ ] Verify events are emitted correctly
- [ ] Check that gas costs are reasonable

### Post-Registration Tests
- [ ] Verify name appears in user's name list
- [ ] Verify name can be managed (set records, etc.)
- [ ] Test name transfer functionality
- [ ] Test name renewal functionality

### 8. ⏳ Verification Steps
- [ ] Run `pnpm lint` to check for linting errors
- [ ] Run `pnpm lint:types` to check for TypeScript errors
- [ ] Run `pnpm test` to ensure unit tests pass
- [ ] Run `pnpm build` to ensure the project builds successfully
- [ ] Test registration flow manually in development environment

## Progress Update

### ✅ Completed Tasks
1. **registerName.ts** - Successfully reverted to standard `registerName` function
   - Removed all legacy imports
   - Removed conditional logic
   - Now uses only `registerName.makeFunctionData()`

2. **commitName.ts** - Successfully reverted to standard `commitName` function
   - Removed all legacy imports
   - Removed conditional logic
   - Now uses only `commitName.makeFunctionData()`

3. **calculateTransactions.ts** - Updated to remove legacy logic
   - Removed `isLegacyRegistration`, `makeLegacyRegistrationParams`, `makeLegacyCommitment` imports
   - Removed `legacyEthRegistrarControllerAddress` parameter
   - Simplified to use only standard ETH registrar controller

4. **useSimulateRegistration.ts** - Updated to use standard registration only
   - Now uses `makeRegistrationCallData` instead of `makeRegistrationTuple`
   - Removed all legacy controller references
   - Simplified to use only `ethRegistrarControllerRegisterSnippet`

5. **Transactions.tsx** - Removed legacy registration imports
   - Removed `isLegacyRegistration` and `makeLegacyRegistrationParams` imports
   - Updated `useExistingCommitment` call to remove `isLegacyCommit` parameter

6. **useExistingCommitment.ts** - Removed legacy commitment logic
   - Deleted entire `getExistingLegacyCommitmentQueryFn` function (125 lines)
   - Removed `isLegacyCommit` parameter from type definitions
   - Simplified to use only wrapped commitment flow

7. **Deleted legacy utility files**
   - ✅ Deleted `src/utils/registration/isLegacyRegistration.ts`
   - ✅ Deleted `src/utils/registration/isLegacyRegistration.test.ts`
   - ✅ Deleted `src/utils/registration/makeLegacyRegistrationParams.ts`
   - ✅ Deleted `src/utils/registration/makeLegacyRegistrationParams.test.ts`

### ⏳ Next Steps
- Update IndexedDB version to avoid conflicts
- Verify and update RegistrationParameters for reverseRecord and referrer
- Create QA testing notes
- Update remaining files (deploy scripts, playwright tests)
- Run verification tests

## Key Implementation Notes

### Registration Parameters Type
The `RegistrationParameters` type from `@ensdomains/ensjs/utils` should be used directly without any modifications or legacy variants.

### Value Calculation
The value calculation logic remains the same:
```typescript
const price = await getPrice(client, { nameOrNames: data.name, duration: data.duration })
const value = price.base + price.premium
const valueWithBuffer = calculateValueWithBuffer(value)
```

### Import Changes Summary
**Remove these imports across all files:**
- `isLegacyRegistration` from `@app/utils/registration/isLegacyRegistration`
- `makeLegacyRegistrationParams` from `@app/utils/registration/makeLegacyRegistrationParams`
- `legacyRegisterName` from `@ensdomains/ensjs/wallet`
- `legacyCommitName` from `@ensdomains/ensjs/wallet`
- `makeLegacyCommitment` from `@ensdomains/ensjs/utils`
- `makeLegacyRegistrationWithConfigTuple` from `@ensdomains/ensjs/utils`
- `legacyEthRegistrarControllerRegisterWithConfigSnippet` from `@ensdomains/ensjs/contracts`

**Keep these imports:**
- `registerName` from `@ensdomains/ensjs/wallet`
- `commitName` from `@ensdomains/ensjs/wallet`
- `makeCommitment` from `@ensdomains/ensjs/utils`
- `makeRegistrationTuple` from `@ensdomains/ensjs/utils`
- `ethRegistrarControllerRegisterSnippet` from `@ensdomains/ensjs/contracts`

## Files Affected (Complete List)
Based on grep search for `isLegacyRegistration|makeLegacy`:

1. Core transaction files:
   - `src/transaction-flow/transaction/registerName.ts`
   - `src/transaction-flow/transaction/commitName.ts`

2. Hook files:
   - `src/hooks/gasEstimation/calculateTransactions.ts`
   - `src/hooks/registration/useSimulateRegistration.ts`

3. Component files:
   - `src/components/pages/profile/[name]/registration/steps/Transactions.tsx`

4. Utility files (to be deleted):
   - `src/utils/registration/isLegacyRegistration.ts`
   - `src/utils/registration/isLegacyRegistration.test.ts`
   - `src/utils/registration/makeLegacyRegistrationParams.ts`
   - `src/utils/registration/makeLegacyRegistrationParams.test.ts`

5. Test/Deploy files:
   - `deploy/00_register_desynced.ts`
   - `playwright/fixtures/makeName/index.ts`
   - `playwright/fixtures/makeName/generators/legacyWithConfigNameGenerator.ts`
   - `playwright/fixtures/makeName/generators/legacyNameGenerator.ts`

## Git Commands for Reference
```bash
# View the commit that added legacy registration
git show b227233f8

# View files before the legacy registration was added
git show b227233f8^:src/transaction-flow/transaction/registerName.ts
git show b227233f8^:src/transaction-flow/transaction/commitName.ts

# Find all files containing isLegacyRegistration or makeLegacy
grep -r "isLegacyRegistration\|makeLegacy" src/ deploy/ playwright/
```

## Expected Outcome
After completing all changes:
- All name registrations will use the standard ENS.js `commitName` and `registerName` functions
- No conditional logic for determining registration type
- Cleaner, simpler codebase with less branching
- All legacy registration utility functions removed
- Tests and build should pass successfully