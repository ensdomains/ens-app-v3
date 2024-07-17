import type { TFunction } from 'react-i18next'
import { toBytes, type Address } from 'viem'

import { Eth2ldName } from '@ensdomains/ensjs/dist/types/types'
import { GetPriceReturnType } from '@ensdomains/ensjs/public'
import { DecodedFuses } from '@ensdomains/ensjs/utils'

import { KNOWN_RESOLVER_DATA } from '@app/constants/resolverAddressData'

import { CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE } from './constants'
import { ONE_DAY, ONE_YEAR } from './time'

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
  price: GetPriceReturnType
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

export const formatDuration = (duration: number, t: TFunction) => {
  const currentDate = new Date()
  const month = getMonthDifferenceDuration(currentDate)

  if (duration >= ONE_YEAR) {
    const years = Math.floor(duration / ONE_YEAR)
    const { months } = getMonthsFromDuration(currentDate, duration - years * ONE_YEAR)
    if (months !== 0)
      return `${t('unit.years', { count: years, ns: 'common' })}, ${t('unit.months', {
        count: months,
        ns: 'common',
      })}`

    return t('unit.years', { count: years, ns: 'common' })
  }
  if (duration >= month) {
    const { months, secLeft } = getMonthsFromDuration(currentDate, duration)
    const days = Math.floor(secLeft / ONE_DAY)

    if (days > 0)
      return `${t('unit.months', { count: months, ns: 'common' })}, ${t('unit.days', {
        count: days,
        ns: 'common',
      })}`

    return t('unit.months', { count: months, ns: 'common' })
  }
  if (duration >= ONE_DAY) {
    const days = Math.floor(duration / ONE_DAY)
    return t('unit.days', { count: days, ns: 'common' })
  }

  return t('unit.invalid_date', { ns: 'common' })
}

export const getMonthsFromDuration = (currentDate: Date, duration: number) => {
  /*  Calculates the amount of months based on each additional month from today's date due to the amount 
      of different days in a month until duration is negative or less than the month's duration time 
      meaning there are days left.  Can have the opportunity to return the left over time to be used as day calculation
  */
  let monthCount = 0
  let durationLeft = duration

  if (duration > 0) {
    let startDate = currentDate
    startDate
    let oneMonthDate = new Date(
      startDate.getMonth() + 2 + '/' + startDate.getDate() + '/' + startDate.getFullYear(),
    )
    let monthDuration = getTimeDifferenceDuration(oneMonthDate, startDate)
    while (durationLeft > 0 && durationLeft >= monthDuration && monthCount < 12) {
      durationLeft -= monthDuration
      monthCount++
      startDate = oneMonthDate
      oneMonthDate = new Date(
        startDate.getMonth() + 2 + '/' + startDate.getDate() + '/' + startDate.getFullYear(),
      )
      monthDuration = getTimeDifferenceDuration(oneMonthDate, startDate)
    }
  }

  return { months: monthCount, secLeft: durationLeft }
}

export const getMonthDifferenceDuration = (startDate: Date) => {
  /* Determines the difference in seconds for one month from the start date */
  const oneMonthDate = new Date(
    startDate.getMonth() + 2 + '/' + startDate.getDate() + '/' + startDate.getFullYear(),
  )
  return Math.round((oneMonthDate.getTime() - startDate.getTime()) / 1000)
}

export const getTimeDifferenceDuration = (endDate: Date, startDate: Date) => {
  /* Determines the time difference in seconds between the start and end date */
  return Math.round((endDate.getTime() - startDate.getTime()) / 1000)
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

export const checkDNS2LDFromName = (name?: string) => {
  const labels = name?.split('.')
  if (!labels) return false
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

/*
  Following types are based on this solution: https://stackoverflow.com/questions/53173203/typescript-recursive-function-composition/53175538#53175538
  Best to just move on and not try to understand it. (This is copilot's opintion!)
*/
type Lookup<T, K extends keyof any, Else = never> = K extends keyof T ? T[K] : Else

type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never

type Func1 = (arg: any) => any
type ArgType<F, Else = never> = F extends (arg: infer A) => any ? A : Else
type AsChain<F extends [Func1, ...Func1[]], G extends Func1[] = Tail<F>> = {
  [K in keyof F]: (arg: ArgType<F[K]>) => ArgType<Lookup<G, K, any>, any>
}

type Last<T extends any[]> = T extends [...any, infer L] ? L : never
type LaxReturnType<F> = F extends (...args: any) => infer R ? R : never

export const thread = <F extends [(arg: any) => any, ...Array<(arg: any) => any>]>(
  arg: ArgType<F[0]>,
  ...f: F & AsChain<F>
): LaxReturnType<Last<F>> => f.reduce((acc, fn) => fn(acc), arg) as LaxReturnType<Last<F>>
