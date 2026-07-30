import type { Address } from 'viem'

import type { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

const isSameAddress = (a?: string | null, b?: string | null) =>
  !!a && !!b && a.toLowerCase() === b.toLowerCase()

export const isSelfExtendable = ({
  ownerData,
  wrapperData,
  address,
}: {
  ownerData?: GetOwnerReturnType
  wrapperData?: GetWrapperDataReturnType
  address?: Address
}) => {
  return isSameAddress(ownerData?.registrant, address) || isSameAddress(wrapperData?.owner, address)
}

export const isNameOwnerOrManager = ({
  ownerData,
  wrapperData,
  address,
}: {
  ownerData?: GetOwnerReturnType
  wrapperData?: GetWrapperDataReturnType
  address?: Address
}) =>
  isSameAddress(ownerData?.owner, address) ||
  isSameAddress(ownerData?.registrant, address) ||
  isSameAddress(wrapperData?.owner, address)
