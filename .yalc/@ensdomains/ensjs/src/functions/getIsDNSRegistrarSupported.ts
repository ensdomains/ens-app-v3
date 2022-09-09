import { BigNumber } from 'ethers'
import { ENSArgs } from '..'
import { namehash } from '../utils/normalise'
import {
  MAINNET_DNSREGISTRAR_ADDRESS,
  ROPSTEN_DNSREGISTRAR_ADDRESS,
  EMPTY_ADDRESS,
  interfaces,
} from '../utils/consts'
import { labelhash } from '../utils/labels'

/*
  async isDNSRegistrar(parentOwner) {
    const provider = await getProvider()
    const registrar = await getDnsRegistrarContract({ parentOwner, provider })
    let isDNSSECSupported = false,
      isOld = false,
      isNew = false
    try {
      isOld = await registrar['supportsInterface(bytes4)'](dnssecClaimOldId)
      isNew = await registrar['supportsInterface(bytes4)'](dnssecClaimNewId)
    } catch (e) {
      console.log({ e })
    }
    isDNSSECSupported = isOld || isNew
    return isDNSSECSupported
  }
*/

// async function setDNSSECTldOwner(ens, tld, networkId) {
//   //registry owner
//   let tldowner = (await ens.getOwner(tld)).toLocaleLowerCase()
//   if (parseInt(tldowner) !== 0) return tldowner
//   switch (networkId) {
//     case 1:
//       return MAINNET_DNSREGISTRAR_ADDRESS
//     case 3:
//       return ROPSTEN_DNSREGISTRAR_ADDRESS
//     default:
//       return EMPTY_ADDRESS
//   }
// }

const raw = async (
  { contracts, multicallWrapper }: ENSArgs<'contracts' | 'multicallWrapper'>,
  name: string,
) => {
  const baseRegistrar = await contracts?.getBaseRegistrar()

  const nameArray = name.split('.')
  if (nameArray.length !== 2 || nameArray[1] === 'eth') return {}
  const tld = nameArray[1]

  const isOldDNSRegistrarTx = {
    to: baseRegistrar?.address,
    data: baseRegistrar?.interface.encodeFunctionData('supportsInterface', [
      interfaces.DNSSEC_CLAIM_OLD,
    ]),
  }

  const isNewDNSRegistrarTx = {
    to: baseRegistrar?.address,
    data: baseRegistrar?.interface.encodeFunctionData('supportsInterface', [
      interfaces.DNSSEC_CLAIM_NEW,
    ]),
  }

  const tldOwnerTx = {
    to: baseRegistrar?.address,
    data: baseRegistrar?.interface.encodeFunctionData('ownerOf', [
      labelhash(tld),
    ]),
  }

  return multicallWrapper.raw([
    isOldDNSRegistrarTx,
    isNewDNSRegistrarTx,
    tldOwnerTx,
  ])
}

const decode = async (
  { contracts, multicallWrapper }: ENSArgs<'contracts' | 'multicallWrapper'>,
  data: string,
  name: string,
) => {
  //Find out if DNS registrar is supported
  const result = await multicallWrapper.decode(data)
  const baseRegistrar = await contracts?.getBaseRegistrar()!

  try {
    const [isOldDNSRegistrar] = baseRegistrar.interface.decodeFunctionResult(
      'supportsInterface',
      result[0].returnData,
    )
    const [isNewDNSRegistrar] = baseRegistrar.interface.decodeFunctionResult(
      'supportsInterface',
      result[1].returnData,
    )
    const [tldOwner] = baseRegistrar.interface.decodeFunctionResult(
      'ownerOf',
      result[1].returnData,
    )
    return {
      isOldDNSRegistrar,
      isNewDNSRegistrar,
      tldOwner,
    }
  } catch (e) {
    console.error('Error getting DNS entry details', e)
    return
  }
}

export default {
  raw,
  decode,
}
