import { networkName } from './constants'

export const getSupportedNetworkName = (networkId: number) =>
  networkName[`${networkId}` as keyof typeof networkName] || 'unknown'

// eslint-disable-next-line consistent-return
export function imageUrlUnknownRecord(name: string, network: number) {
  const supported = getSupportedNetworkName(network)

  return `https://metadata.ens.domains/${supported}/avatar/${name}`
}

export function ensNftImageUrl(name: string, network: number, regAddr: string) {
  const supported = getSupportedNetworkName(network)

  return `https://metadata.ens.domains/${supported}/${regAddr}/${name}/image`
}

export const shortenAddress = (
  address = '',
  maxLength = 10,
  leftSlice = 5,
  rightSlice = 5,
) => {
  if (address.length < maxLength) {
    return address
  }

  return `${address.slice(0, leftSlice)}...${address.slice(-rightSlice)}`
}

export const secondsToDays = (seconds: number) =>
  Math.floor(seconds / (60 * 60 * 24))

export const yearsToSeconds = (years: number) => years * 60 * 60 * 24 * 365

export const formatExpiry = (expiry: Date) => `
${expiry.toLocaleDateString(undefined, {
  month: 'long',
})} ${expiry.getDate()}, ${expiry.getFullYear()}`

export const makeEtherscanLink = (hash: string, network?: string) =>
  `https://${
    !network || network === 'ethereum' ? '' : `${network}.`
  }etherscan.io/tx/${hash}`
