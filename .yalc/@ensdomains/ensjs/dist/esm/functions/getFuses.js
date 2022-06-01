import { ethers, utils } from 'ethers'
import { testable as fuseEnums } from '../utils/fuses'
const NameSafety = [
  'Safe',
  'RegistrantNotWrapped',
  'ControllerNotWrapped',
  'SubdomainReplacementAllowed',
  'Expired',
]
const raw = async ({ contracts }, name) => {
  const nameWrapper = await contracts?.getNameWrapper()
  return {
    to: nameWrapper.address,
    data: nameWrapper.interface.encodeFunctionData('getFuses', [
      ethers.utils.namehash(name),
    ]),
  }
}
const decode = async ({ contracts }, data, name) => {
  const nameWrapper = await contracts?.getNameWrapper()
  try {
    const [fuses, vulnerability, vulnerableNode] =
      nameWrapper.interface.decodeFunctionResult('getFuses', data)
    const fuseObj = Object.fromEntries(
      Object.keys(fuseEnums).map((fuseEnum) => [
        fuseEnum
          .toLowerCase()
          .replace(/([-_][a-z])/g, (group) =>
            group.toUpperCase().replace('-', '').replace('_', ''),
          ),
        fuses.and(fuseEnums[fuseEnum]).gt(0),
      ]),
    )
    if (fuses.eq(0)) {
      fuseObj.canDoEverything = true
    } else {
      fuseObj.canDoEverything = false
    }
    let returnVulnerableNode = null
    if (utils.hexStripZeros(vulnerableNode) !== '0x') {
      name.split('.').forEach((label, index, arr) => {
        const node = arr.slice(index).join('.')
        const nodehash = utils.namehash(node)
        if (nodehash === vulnerableNode) {
          returnVulnerableNode = node
        }
      })
    }
    return {
      fuseObj,
      vulnerability: NameSafety[vulnerability] || vulnerability,
      vulnerableNode: returnVulnerableNode,
      rawFuses: fuses,
    }
  } catch {
    return null
  }
}
export default {
  raw,
  decode,
}
