import { BigNumber, utils } from 'ethers'
import { ENSArgs } from '..'
import { testable as fuseEnums } from '../utils/fuses'
import { namehash } from '../utils/normalise'

const NameSafety = [
  'Safe',
  'RegistrantNotWrapped',
  'ControllerNotWrapped',
  'SubdomainReplacementAllowed',
  'Expired',
]

const raw = async ({ contracts }: ENSArgs<'contracts'>, name: string) => {
  const nameWrapper = await contracts?.getNameWrapper()!
  return {
    to: nameWrapper.address,
    data: nameWrapper.interface.encodeFunctionData('getFuses', [
      namehash(name),
    ]),
  }
}

const decode = async (
  { contracts }: ENSArgs<'contracts'>,
  data: string,
  name: string,
) => {
  const nameWrapper = await contracts?.getNameWrapper()!
  try {
    const [fuses, vulnerability, vulnerableNode] =
      nameWrapper.interface.decodeFunctionResult('getFuses', data)

    const fuseObj = Object.fromEntries(
      Object.keys(fuseEnums).map((fuseEnum) => [
        fuseEnum
          .toLowerCase()
          .replace(/([-_][a-z])/g, (group: string) =>
            group.toUpperCase().replace('-', '').replace('_', ''),
          ),
        fuses.and(fuseEnums[fuseEnum as keyof typeof fuseEnums]).gt(0),
      ]),
    )

    if (fuses.eq(0)) {
      fuseObj.canDoEverything = true
    } else {
      fuseObj.canDoEverything = false
    }

    let returnVulnerableNode: string | null = null
    if (utils.hexStripZeros(vulnerableNode) !== '0x') {
      name.split('.').forEach((label, index, arr) => {
        const node = arr.slice(index).join('.')
        const nodehash = namehash(node)
        if (nodehash === vulnerableNode) {
          returnVulnerableNode = node
        }
      })
    }

    return {
      fuseObj,
      vulnerability: NameSafety[vulnerability] || vulnerability,
      vulnerableNode: returnVulnerableNode,
      rawFuses: fuses as BigNumber,
    }
  } catch {
    return
  }
}

export default {
  raw,
  decode,
}
