import { formatsByName } from '@ensdomains/address-encoder'
import { validate } from '@ensdomains/ens-validation'

export const hasNonAscii = () => {
  const strs = window.location.pathname.split('/')
  const rslt = strs.reduce((accum, next) => {
    if (accum) return true
    if (!validate(next)) return true
    return accum
  }, false)
  return rslt
}

export const validateCryptoAddress =
  (coin: string) =>
  async (address: string): Promise<string | boolean> => {
    try {
      const coinTypeInstance = formatsByName[coin.toUpperCase()]
      coinTypeInstance.decoder(address)
      return true
    } catch (e: any) {
      if (typeof e === 'string') return e
      if (e.message) return e.message
      if (e.toString) return e.toString()
      return 'Invalid address'
    }
  }

const isIpfs = (url: string) => /^(ipfs|ipns):\/\//.test(url) || /\/(ipfs|ipns)\//.test(url)
const isOnion = (url: string) => /^(onion|onion3):\/\//.test(url)
const isSkynet = (url: string) => /^sia:\/\//.test(url)
const isArweave = (url: string) => /^arweave:\/\//.test(url)
const isSwarm = (url: string) => /^bzz:\/\//.test(url)
const isContentHash = (url: string) =>
  isIpfs(url) || isOnion(url) || isSkynet(url) || isArweave(url) || isSwarm(url)

export const validateContentHash =
  (protocol?: string) =>
  (url?: string): string | boolean => {
    const _url = url || ''
    if (protocol === 'ipfs') return isIpfs(_url) || 'Invalid url'
    if (protocol === 'onion') return isOnion(_url) || 'Invalid url'
    if (protocol === 'skynet') return isSkynet(_url) || 'Invalid url'
    if (protocol === 'arweave') return isArweave(_url) || 'Invalid url'
    if (protocol === 'swarm') return isSwarm(_url) || 'Invalid url'
    return isContentHash(_url) || 'Invalid url'
  }
