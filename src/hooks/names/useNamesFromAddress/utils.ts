import { match } from 'ts-pattern'

import type { Name } from '@ensdomains/ensjs/functions/getNames'

import { GRACE_PERIOD } from '@app/utils/constants'
import { validateExpiry } from '@app/utils/utils'

type ReturnedName = Name & {
  isController?: boolean
  isRegistrant?: boolean
  isWrappedOwner?: boolean
}

export const mergeNames = (names: Name[]) => {
  const nameMap = names.reduce((map, curr) => {
    // eslint-disable-next-line no-restricted-syntax
    if (curr.id === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      // eslint-disable-next-line no-param-reassign
      curr = {
        ...curr,
        name: '[root]',
        truncatedName: '[root]',
      }
    }
    const existingEntry = map[curr.name] || {}
    const isController = curr.type === 'domain'
    const isRegistrant = curr.type === 'registration'
    const isWrappedOwner = curr.type === 'wrappedDomain'
    const newMap = map
    newMap[curr.name] = {
      ...existingEntry,
      ...curr,
      isController: existingEntry.isController || isController,
      isRegistrant: existingEntry.isRegistrant || isRegistrant,
      isWrappedOwner: existingEntry.isWrappedOwner || isWrappedOwner,
    }
    const newItem: ReturnedName = newMap[curr.name]
    if (newItem.registration?.expiryDate) {
      newItem.expiryDate = new Date(newItem.registration.expiryDate)
    } else if (newItem.expiryDate) {
      // only add expiry date from wrapped name if PCC is burned
      newItem.expiryDate = validateExpiry(curr.name, newItem.fuses, new Date(newItem.expiryDate))
    }
    if (newItem.createdAt) newItem.createdAt = new Date(newItem.createdAt)
    if (newItem.registrationDate) newItem.registrationDate = new Date(newItem.registrationDate)
    return newMap
  }, {} as { [key: string]: ReturnedName })
  return Object.values(nameMap)
}

const isNameWithinGracePeriod = (blockTimestamp: number) => (name: ReturnedName) => {
  return !(
    name.expiryDate &&
    blockTimestamp &&
    name.expiryDate.getTime() < blockTimestamp - GRACE_PERIOD
  )
}

const isNotReverseAddress = (name: ReturnedName) => name.parent?.name !== 'addr.reverse'

export const isValidName =
  (blockTimestamp: number) =>
  (name: ReturnedName): boolean => {
    return isNameWithinGracePeriod(blockTimestamp)(name) && isNotReverseAddress(name)
  }

export const filterByType =
  (type?: 'registration' | 'domain' | 'wrappedDomain') => (name: ReturnedName) => {
    return match(type)
      .with('registration', () => !!name.isRegistrant)
      .with('domain', () => !!name.isController)
      .with('wrappedDomain', () => !!name.isWrappedOwner)
      .otherwise(() => true)
  }

export const filterBySearch = (search?: string) => (name: ReturnedName) =>
  !search || name.name.toLowerCase().indexOf(search.toLowerCase()) !== -1

export const sortByType = (
  type: 'labelName' | 'creationDate' | 'expiryDate',
  order: 'asc' | 'desc',
) => {
  return match({ type, order })
    .with(
      { type: 'labelName', order: 'asc' },
      () => (a: Name, b: Name) => (a.truncatedName || '').localeCompare(b.truncatedName || ''),
    )
    .with(
      { type: 'labelName' },
      () => (a: Name, b: Name) => (b.truncatedName || '').localeCompare(a.truncatedName || ''),
    )
    .with(
      { type: 'creationDate', order: 'asc' },
      () => (a: Name, b: Name) =>
        (a.registrationDate?.getTime() || a.createdAt?.getTime() || 0) -
        (b.registrationDate?.getTime() || b.createdAt?.getTime() || 0),
    )
    .with(
      { type: 'creationDate' },
      () => (a: Name, b: Name) =>
        (b.registrationDate?.getTime() || b.createdAt?.getTime() || 0) -
        (a.registrationDate?.getTime() || a.createdAt?.getTime() || 0),
    )
    .with(
      { type: 'expiryDate', order: 'asc' },
      () => (a: Name, b: Name) =>
        (a.expiryDate?.getTime() || Infinity) - (b.expiryDate?.getTime() || Infinity),
    )
    .with(
      { type: 'expiryDate' },
      () => (a: Name, b: Name) =>
        (b.expiryDate?.getTime() || Infinity) - (a.expiryDate?.getTime() || Infinity),
    )
    .exhaustive()
}
