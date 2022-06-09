import throttle from 'lodash/throttle'
import { CID } from 'multiformats'
import { useEffect, useRef } from 'react'

// From https://github.com/0xProject/0x-monorepo/blob/development/packages/utils/src/address_utils.ts

export const emptyAddress = '0x0000000000000000000000000000000000000000'
export const MAINNET_DNSREGISTRAR_ADDRESS =
  '0x58774Bb8acD458A640aF0B88238369A167546ef2'
export const ROPSTEN_DNSREGISTRAR_ADDRESS =
  '0xdB328BA5FEcb432AF325Ca59E3778441eF5aa14F'

export const networkName = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '1': 'mainnet',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '5': 'goerli',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '4': 'rinkeby',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '3': 'ropsten',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '1337': 'local',
}

export const supportedAvatarProtocols = [
  'http://',
  'https://',
  'ipfs://',
  'eip155',
]

export const uniq = (a: any, param: any) =>
  a.filter(
    (item: any, pos: number) =>
      a.map((mapItem: any) => mapItem[param]).indexOf(item[param]) === pos,
  )

// export async function getEtherScanAddr() {
//   const networkId = await getNetworkId()
//   switch (networkId) {
//     case 1:
//     case '1':
//       return 'https://etherscan.io/'
//     case 3:
//     case '3':
//       return 'https://ropsten.etherscan.io/'
//     case 4:
//     case '4':
//       return 'https://rinkeby.etherscan.io/'
//     default:
//       return 'https://etherscan.io/'
//   }
// }

// export const checkLabels = (...labelHashes) =>
//   labelHashes.map(labelHash => checkLabelHash(labelHash) || null)

export function modulate(
  value: number,
  rangeA: any[],
  rangeB: any[],
  limit: boolean | null,
) {
  if (limit === null) {
    // eslint-disable-next-line no-param-reassign
    limit = false
  }
  const [fromLow, fromHigh] = rangeA
  const [toLow, toHigh] = rangeB
  const result =
    toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow)
  if (limit === true) {
    if (toLow < toHigh) {
      if (result < toLow) {
        return toLow
      }
      if (result > toHigh) {
        return toHigh
      }
    } else {
      if (result > toLow) {
        return toLow
      }
      if (result < toHigh) {
        return toHigh
      }
    }
  }
  return result
}

export function isElementInViewport(el: Element) {
  const rect = el.getBoundingClientRect()

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight ||
        document.documentElement.clientHeight) /* or $(window).height() */ &&
    rect.right <=
      (window.innerWidth ||
        document.documentElement.clientWidth) /* or $(window).width() */
  )
}

export function isShortName(term: any) {
  return [...term].length < 3
}

export const aboutPageURL = () => {
  const lang = window.localStorage.getItem('language') || ''

  return `https://ens.domains/${lang === 'en' ? '' : lang}`
}

export function isRecordEmpty(value: any) {
  return value === emptyAddress || value === ''
}

export const hasValidReverseRecord = (getReverseRecord: any) =>
  getReverseRecord?.name && getReverseRecord.name !== emptyAddress

export function usePrevious(value: any) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef()
  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current
}

export function isOwnerOfParentDomain(domain: any, account: any) {
  if (!account) return false
  if (domain.parentOwner !== emptyAddress) {
    return domain.parentOwner?.toLowerCase() === account.toLowerCase()
  }
  return false
}

export function prependUrl(url: string) {
  if (url && !url.match(/http[s]?:\/\//)) {
    return `https://${url}`
  }
  return url
}

export const getSupportedNetworkName = (networkId: number) =>
  networkName[`${networkId}` as keyof typeof networkName] || 'unknown'

// eslint-disable-next-line consistent-return
export function imageUrl(url: string, name: any, network: number) {
  // check if given uri is supported
  // provided network name is valid,
  // domain name is available
  const supported = getSupportedNetworkName(network)

  if (supported && name) {
    return `https://metadata.ens.domains/${supported}/avatar/${name}`
  }
  console.warn('Unsupported avatar', network, name, url)
}

// eslint-disable-next-line consistent-return
export function imageUrlUnknownRecord(name: string, network: number) {
  const supported = getSupportedNetworkName(network)

  return `https://metadata.ens.domains/${supported}/avatar/${name}`
}

export function ensNftImageUrl(name: string, network: number, regAddr: string) {
  const supported = getSupportedNetworkName(network)

  return `https://metadata.ens.domains/${supported}/${regAddr}/${name}/image`
}

export function isCID(hash: string | CID) {
  try {
    if (typeof hash === 'string') {
      return Boolean(CID.parse(hash))
    }

    return Boolean(CID.asCID(hash))
  } catch (e) {
    return false
  }
}

export function asyncThrottle(func: (arg0: any) => Promise<any>, wait: any) {
  const throttled = throttle((resolve: any, reject: any, args: any) => {
    func([...args])
      .then(resolve)
      .catch(reject)
  }, wait)
  return (...args: any) =>
    new Promise((resolve, reject) => {
      throttled(resolve, reject, args)
    })
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

export const formatExpiry = (expiry: Date) => `
${expiry.toLocaleDateString(undefined, {
  month: 'long',
})} ${expiry.getDate()}, ${expiry.getFullYear()}`

export const makeEtherscanLink = (hash: string, network?: string) =>
  `https://${
    !network || network === 'mainnet' ? '' : `${network}.`
  }etherscan.io/tx/${hash}`
