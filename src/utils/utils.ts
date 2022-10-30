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

export const makeEtherscanLink = (hash: string, network?: string) =>
  `https://${!network || network === 'ethereum' ? '' : `${network}.`}etherscan.io/tx/${hash}`

export const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export const isDNSName = (name: string): boolean => {
  const labels = name?.split('.')

  return !!labels && labels[labels.length - 1] !== 'eth'
}

export const isASubname = (name: string) => name.split('.').length > 2
