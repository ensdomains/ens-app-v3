# Temporary DNS root key rollover bridge

The normal ENSJS `getDnsImportData` path always runs first. Until 22 October
2026 at 00:00 UTC, a `NoMatchingProof` revert on mainnet or Sepolia can retry
with the root DNSKEY set signed by key 20326 on 1 October. That set includes
38696 and the old oracle already trusts 20326. Only the root link is replaced;
the TLD, zone and TXT records stay live. The adapted chain must pass the configured
on-chain oracle's `verifyRRSet`, the ENSJS inception check and the final record
comparison before the app uses it. No transaction is sent by this module.

After expiry, requests use only the normal ENSJS path. Transaction preparation
also rejects cached proofs containing the expired historical root. The on-chain
oracle remains responsible for checking every signature and its validity period.
The bridge can stop working earlier if live proofs require keys absent from the
historical root; verification will reject those proofs.

Fixture provenance:

- https://gist.github.com/estmcmxci/93fd3f760d16867144a2d4e7f321663e
- Original ENS fixture: https://github.com/ensdomains/ens-contracts/blob/f8624b26a9bcb04c145cb92cc085e739f7babeb7/test/dnssec-oracle/TestDNSSEC.test.ts

This affects app imports, claims and DNS manager syncs. Gasless resolution through
the external gateway is outside this module.

## Removal

Once the configured oracles accept live proofs:

1. In `src/hooks/ensjs/dns/useDnsImportData.ts`, restore the `getDnsImportData`
   import from `@ensdomains/ensjs/dns` and call it directly.
2. Remove the `assertDnsImportProofNotExpired` imports and calls from
   `src/transaction-flow/transaction/{importDnsName,claimDnsName,syncManager}.ts`.
3. Delete this directory.
4. Remove the direct `@ensdomains/dnsprovejs` dependency and its importer entry
   from the lockfile. Keep the existing dnsprovejs trust-anchor/DoH patch: ENSJS
   still uses it transitively.
