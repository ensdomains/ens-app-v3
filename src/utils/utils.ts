import { toUtf8Bytes } from '@ethersproject/strings/lib/utf8'

import { networkName } from './constants'

export const getSupportedNetworkName = (networkId: number) =>
  networkName[`${networkId}` as keyof typeof networkName] || 'unknown'

const baseMetadataURL = process.env.NEXT_PUBLIC_PROVIDER
  ? 'http://localhost:8080'
  : 'https://metadata.ens.domains'

// eslint-disable-next-line consistent-return
export function imageUrlUnknownRecord(name: string, network: number) {
  const supported = getSupportedNetworkName(network)

  return `${baseMetadataURL}/${supported}/avatar/${name}?timestamp=${Date.now()}`
}

export function ensNftImageUrl(name: string, network: number, regAddr: string) {
  const supported = getSupportedNetworkName(network)

  return `${baseMetadataURL}/${supported}/${regAddr}/${name}/image`
}

export const shortenAddress = (address = '', maxLength = 10, leftSlice = 5, rightSlice = 5) => {
  if (address.length < maxLength) {
    return address
  }

  return `${address.slice(0, leftSlice)}...${address.slice(-rightSlice)}`
}

export const secondsToDays = (seconds: number) => Math.floor(seconds / (60 * 60 * 24))

export const yearsToSeconds = (years: number) => years * 60 * 60 * 24 * 365

export const secondsToYears = (seconds: number) => seconds / (60 * 60 * 24 * 365)

export const formatExpiry = (expiry: Date) => `
${expiry.toLocaleDateString(undefined, {
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
  const timezoneString = date
    .toTimeString()
    .split('(')[1]
    .replace(/\b(\w)\w*[\s)]?/g, '$1')
  return `${baseFormatted} (${timezoneString})`
}

export const makeEtherscanLink = (hash: string, network?: string) =>
  `https://${!network || network === 'ethereum' ? '' : `${network}.`}etherscan.io/tx/${hash}`

export const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export const checkDNSName = (name: string): boolean => {
  const labels = name?.split('.')

  return !!labels && labels[labels.length - 1] !== 'eth'
}

export const checkETHName = (labels: string[]) => labels[labels.length - 1] === 'eth'

export const checkETH2LDName = (isDotETH: boolean, labels: string[], canBeShort?: boolean) =>
  isDotETH && labels.length === 2 && (canBeShort || labels[0].length >= 3)

export const checkETH2LDFromName = (name: string) => {
  const labels = name.split('.')
  return checkETH2LDName(checkETHName(labels), labels)
}

export const checkSubname = (name: string) => name.split('.').length > 2

export const isLabelTooLong = (label: string) => {
  const bytes = toUtf8Bytes(label)
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
