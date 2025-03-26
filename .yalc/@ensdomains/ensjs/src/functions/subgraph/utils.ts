import { getAddress, type Address, type Hex } from 'viem'
import type { DateWithValue } from '../../types.js'
import { truncateFormat } from '../../utils/format.js'
import { decodeFuses, type DecodedFuses } from '../../utils/fuses.js'
import { decryptName } from '../../utils/labels.js'
import type { SubgraphDomain } from './fragments.js'

export type Name = {
  /** Id of the name, equal to namehash */
  id: Hex
  /** Name string */
  name: string | null
  /** Truncated name, formatted for display use only */
  truncatedName: string | null
  /** Label name for name */
  labelName: string | null
  /** Label hash of label for name */
  labelhash: Hex
  /** Migration status from old ENS registry */
  isMigrated: boolean
  /** Parent name string, null if name is root */
  parentName: string | null
  /** Initial name creation time */
  createdAt: DateWithValue<number>
  /** Registration date of name */
  registrationDate: DateWithValue<number> | null
  /** Expiry date of name */
  expiryDate: DateWithValue<number> | null
  /** Fuse values for name */
  fuses: DecodedFuses | null
  /** Owner address */
  owner: Address
  /** Registrant address */
  registrant: Address | null
  /** Wrapped owner address */
  wrappedOwner: Address | null
  /** ETH record on name */
  resolvedAddress: Address | null
}

export const getChecksumAddressOrNull = (
  address: string | undefined,
): Address | null => (address ? getAddress(address) : null)

export const makeNameObject = (domain: SubgraphDomain): Name => {
  const decrypted = domain.name ? decryptName(domain.name) : null
  const createdAt = parseInt(domain.createdAt) * 1000
  const registrationDate = domain.registration?.registrationDate
    ? parseInt(domain.registration?.registrationDate) * 1000
    : null
  const fuses = domain.wrappedDomain?.fuses
    ? decodeFuses(parseInt(domain.wrappedDomain.fuses))
    : null
  const expiryDateRef =
    domain.registration?.expiryDate ||
    (fuses?.parent.PARENT_CANNOT_CONTROL && domain.wrappedDomain?.expiryDate)
  const expiryDate = expiryDateRef ? parseInt(expiryDateRef) * 1000 : null
  return {
    id: domain.id,
    name: decrypted,
    truncatedName: decrypted ? truncateFormat(decrypted) : null,
    labelName: domain.labelName,
    labelhash: domain.labelhash,
    isMigrated: domain.isMigrated,
    parentName: domain.parent?.name ?? null,
    createdAt: {
      date: new Date(createdAt),
      value: createdAt,
    },
    registrationDate: registrationDate
      ? {
          date: new Date(registrationDate),
          value: registrationDate,
        }
      : null,
    expiryDate: expiryDate
      ? {
          date: new Date(expiryDate),
          value: expiryDate,
        }
      : null,
    fuses: domain.wrappedDomain?.fuses
      ? decodeFuses(parseInt(domain.wrappedDomain.fuses))
      : null,
    owner: getAddress(domain.owner.id),
    registrant: getChecksumAddressOrNull(domain.registrant?.id),
    wrappedOwner: getChecksumAddressOrNull(domain.wrappedOwner?.id),
    resolvedAddress: getChecksumAddressOrNull(domain.resolvedAddress?.id),
  }
}
