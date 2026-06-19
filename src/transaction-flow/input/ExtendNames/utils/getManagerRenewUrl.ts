export const MANAGER_BASE_URL = 'https://app.ens.dev'

/**
 * When the legacy ETHRegistrarController has been removed as a controller of
 * BaseRegistrarImplementation (e.g. Sepolia post ENS v2 beta), renewals via
 * the v1 controller revert on-chain. For a single name we deep-link to the
 * new Manager renewal page; for bulk renewal (which the new Manager does not
 * yet support) we fall back to the Manager homepage.
 *
 * The Manager renewal route is `/renew/$name` (see the apps-monorepo manager
 * app: `apps/manager/src/routes/renew/$name.tsx`). The reversed form
 * `/$name/renew` does not exist and 404s, so keep the order as `/renew/<name>`.
 */
export const getManagerRenewUrl = (names: string[]) =>
  names.length === 1 ? `${MANAGER_BASE_URL}/renew/${names[0]}` : MANAGER_BASE_URL
