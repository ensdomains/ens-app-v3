import { BigNumber, utils } from 'ethers'
import { ENSArgs } from '..'

const raw = async (
  { contracts, multicallWrapper }: ENSArgs<'contracts' | 'multicallWrapper'>,
  nameOrNames: string | string[],
  duration: number,
  legacy?: boolean,
) => {
  console.log('get price raw')
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]

  if (names.length > 1) {
    const bulkRenewal = await contracts?.getBulkRenewal()!
    console.log('bulkRenewal', bulkRenewal)
    console.log('names', names, 'duration', duration)
    return {
      to: bulkRenewal.address,
      data: bulkRenewal.interface.encodeFunctionData('rentPrice', [
        names,
        duration,
      ]),
    }
  }

  const controller = await contracts?.getEthRegistrarController()!

  const baseCall = {
    to: controller.address,
    data: controller.interface.encodeFunctionData('rentPrice', [
      names[0],
      duration,
    ]),
  }

  if (legacy) {
    return multicallWrapper.raw([
      baseCall,
      {
        to: controller.address,
        data: controller.interface.encodeFunctionData('rentPrice', [
          names[0],
          0,
        ]),
      },
    ])
  }
  console.log('baseCall', baseCall)
  return baseCall
}

const decode = async (
  { contracts, multicallWrapper }: ENSArgs<'contracts' | 'multicallWrapper'>,
  data: string,
  _nameOrNames: string | string[],
  _duration: number,
  legacy?: boolean,
) => {
  console.log('decode', data, _nameOrNames, _duration, legacy)
  if (data === null) return
  try {
    let base: BigNumber
    let premium: BigNumber
    if (Array.isArray(_nameOrNames) && _nameOrNames.length > 1) {
      const bulkRenewal = await contracts?.getBulkRenewal()!
      const result = bulkRenewal.interface.decodeFunctionResult(
        'rentPrice',
        data,
      )
      console.log('result', result)
      ;[base] = result
      premium = BigNumber.from(0)
    } else if (legacy) {
      const result = await multicallWrapper.decode(data)
      const [price] = utils.defaultAbiCoder.decode(
        ['uint256'],
        result[0].returnData,
      ) as [BigNumber]
      ;[premium] = utils.defaultAbiCoder.decode(
        ['uint256'],
        result[1].returnData,
      ) as [BigNumber]
      base = price.sub(premium)
    } else {
      const controller = await contracts?.getEthRegistrarController()!
      const result = controller.interface.decodeFunctionResult(
        'rentPrice',
        data,
      )
      console.log('result', result)
      ;[base, premium] = result[0] as [BigNumber, BigNumber]
    }
    return {
      base,
      premium,
    }
  } catch {
    return
  }
}

export default { raw, decode }
