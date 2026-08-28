type MigratableProfile = {
  texts?: readonly unknown[] | null
  coins?: readonly unknown[] | null
  contentHash?: unknown
  abi?: unknown
}

/**
 * Whether a fetched source profile carries anything worth migrating. The
 * migrate transactions refuse to proceed on an empty result: an empty source
 * read (e.g. the subgraph does not key the records by the supplied resolver
 * address) must fail visibly rather than write a blank profile or clear the
 * target for nothing.
 */
export const hasRecordsToMigrate = (profile: MigratableProfile): boolean =>
  (profile.texts?.length ?? 0) > 0 ||
  (profile.coins?.length ?? 0) > 0 ||
  !!profile.contentHash ||
  !!profile.abi
