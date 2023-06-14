export type IntroType = 'noResolver' | 'invalidResolver' | 'updateEthAddress'

export const getIntroTranslation = (type: IntroType, part: 'title' | 'description') =>
  `intro.selectPrimaryName.${type}.${part}`

/**
 * Conditions:
 * 1. Reverse registry name is not set
 * 2. Reverse registry name is set but is not the same as the name being set as primary
 */
export const checkRequiresSetPrimaryNameTransaction = ({
  reverseRegistryName,
  name,
}: {
  reverseRegistryName?: string
  name?: string
}) => !reverseRegistryName || (!!reverseRegistryName && reverseRegistryName !== name)

/**
 * Conditions:
 * 1. Resolver is not authorized, hence the user can not update record
 * 2. Resolved address of the name is not the same as the users address. Otherwise name could be set as
 *    primary without updating the resolver
 */
export const checkRequiresUpdateResolverTransaction = ({
  resolvedAddress,
  address,
  isResolverAuthorized,
}: {
  resolvedAddress?: string
  address?: string
  isResolverAuthorized?: boolean
}) => resolvedAddress !== address && !isResolverAuthorized

/**
 * Conditions:
 * 1. Resolved address of the name is not the same as the users address. Otherwise name could be set as
 *    primary right away
 * 2. Resolver is authorized, hence the user can update record
 * 3. Resolver is not authorized so the change will be made on the latest resolver. Check that the latest
 *    resolver doesn't already have the users eth address set.
 */
export const checkRequiresUpdateEthAddressTransaction = ({
  resolvedAddress,
  address,
  isResolverAuthorized,
  isLatestResolverEthAddressSetToAddress,
}: {
  resolvedAddress?: string
  address?: string
  isResolverAuthorized?: boolean
  isLatestResolverEthAddressSetToAddress?: boolean
}) =>
  resolvedAddress !== address &&
  (isResolverAuthorized || (!isResolverAuthorized && !isLatestResolverEthAddressSetToAddress))
