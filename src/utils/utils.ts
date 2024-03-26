import { toBytes, type Address } from 'viem'

import { Eth2ldName } from '@ensdomains/ensjs/dist/types/types'
import { DecodedFuses } from '@ensdomains/ensjs/utils'

import { KNOWN_RESOLVER_DATA } from '@app/constants/resolverAddressData'

import { CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE } from './constants'
import { ONE_YEAR } from './time'

export * from './time'

export const shortenAddress = (address = '', maxLength = 10, leftSlice = 5, rightSlice = 5) => {
  if (address.length < maxLength) {
    return address
  }

  return `${address.slice(0, leftSlice)}...${address.slice(-rightSlice)}`
}

export const deriveYearlyFee = ({
  duration,
  price,
}: {
  duration: number
  price: { base: bigint }
}) => {
  const yearlyFee = (price.base * BigInt(ONE_YEAR)) / BigInt(duration)
  return yearlyFee
}

export const formatExpiry = (expiry: Date) =>
  `${expiry.toLocaleDateString(undefined, {
    month: 'long',
  })} ${expiry.getDate()}, ${expiry.getFullYear()}`

export const formatDateTime = (date: Date) => {
  const baseFormatted = date.toLocaleTimeString('en', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZoneName: 'short',
  })
  return `${baseFormatted}`
}

export const formatFullExpiry = (expiryDate?: Date) =>
  expiryDate ? `${formatExpiry(expiryDate)}, ${formatDateTime(expiryDate)}` : ''

export const formatExtensionPeriod = (duration: number) => {
  const minute = 60
  const hour = minute * 60
  const day = hour * 24
  const month = day * 30 // Assuming 30 days per month for simplicity
  const year = day * 365 // Assuming 365 days per year for simplicity

  if (duration >= year) {
    const years = Math.floor(duration / year)
    return `${years} year`
  }
  if (duration >= month) {
    const months = Math.floor(duration / month)
    return `${months} month`
  }
  if (duration >= day) {
    const days = Math.floor(duration / day)
    return `${days} day`
  }

  return 'Invalid Date'
}

export const makeEtherscanLink = (data: string, network?: string, route: string = 'tx') =>
  `https://${!network || network === 'mainnet' ? '' : `${network}.`}etherscan.io/${route}/${data}`

export const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export const checkDNSName = (name: string): boolean => {
  const labels = name?.split('.')

  return !!labels && labels[labels.length - 1] !== 'eth'
}

export const checkETH2LDFromName = (name: string): name is Eth2ldName => {
  const labels = name.split('.')
  if (labels.length !== 2) return false
  if (labels[1] !== 'eth') return false
  return true
}

export const checkDNS2LDFromName = (name: string) => {
  const labels = name.split('.')
  if (labels.length !== 2) return false
  if (labels[1] === 'eth') return false
  return true
}

export const checkSubname = (name: string) => name.split('.').length > 2

export const isLabelTooLong = (label: string) => {
  const bytes = toBytes(label)
  return bytes.byteLength > 255
}

export const getTestId = (props: any, fallback: string): string => {
  return props['data-testid'] ? String(props['data-testid']) : fallback
}

export const deleteProperty = <T extends Record<string, any>, K extends keyof T>(
  key: K,
  { [key]: _, ...newObj }: T,
): Omit<T, K> => newObj

export const deleteProperties = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> => {
  const newObj = { ...obj }
  for (const key of keys) {
    delete newObj[key]
  }
  return newObj
}

export const getLabelFromName = (name: string = '') => name.split('.')[0]

export const validateExpiry = ({
  name,
  fuses,
  expiry,
  pccExpired = false,
}: {
  name: string
  fuses: DecodedFuses | undefined | null
  expiry: Date | undefined
  pccExpired?: boolean
}) => {
  const isDotETH = checkETH2LDFromName(name)
  if (isDotETH) return expiry
  if (!fuses) return undefined
  return pccExpired || fuses.parent.PARENT_CANNOT_CONTROL ? expiry : undefined
}

export const getResolverWrapperAwareness = ({
  chainId,
  resolverAddress,
}: {
  chainId: number
  resolverAddress?: Address
}) =>
  !!resolverAddress &&
  !!KNOWN_RESOLVER_DATA[chainId]?.find((x) => x.address === resolverAddress)?.isNameWrapperAware

export const calculateValueWithBuffer = (value: bigint) =>
  (value * CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE) / 100n

const encodedLabelRegex = /\[[a-fA-F0-9]{64}\]/g
export const getEncodedLabelAmount = (name: string) => name.match(encodedLabelRegex)?.length || 0

export const createDateAndValue = <TValue extends bigint | number>(value: TValue) => ({
  date: new Date(Number(value)),
  value,
})
