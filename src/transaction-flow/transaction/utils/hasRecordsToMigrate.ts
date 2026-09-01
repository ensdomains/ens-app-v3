import { profileHasRecords } from '@app/utils/profile'

type MigratableProfile = Parameters<typeof profileHasRecords>[0]

/**
 * Whether a fetched source profile carries anything worth migrating. The
 * migrate transactions refuse to proceed on an empty result: an empty source
 * read must fail visibly rather than write a blank profile or clear the target
 * for nothing.
 *
 * This is deliberately the same predicate the editor gates the migrate option
 * on (`profileHasRecords`). Judging contenthash by bare truthiness instead
 * would disagree with it: ensjs returns an object, not null, for a contenthash
 * it could not decode, so a name whose only record is a malformed contenthash
 * would pass here and fail there.
 */
export const hasRecordsToMigrate = (profile: MigratableProfile): boolean =>
  profileHasRecords(profile)
