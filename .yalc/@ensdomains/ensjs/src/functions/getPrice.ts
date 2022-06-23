import { BigNumber, utils } from 'ethers'
import { ENSArgs } from '..'

const raw = async (
  { contracts, multicallWrapper }: ENSArgs<'contracts' | 'multicallWrapper'>,
  name: string,
  duration: number,
  legacy?: boolean,
) => {
  const controller = await contracts?.getEthRegistrarController()!

  const baseCall = {
    to: controller.address,
    data: controller.interface.encodeFunctionData('rentPrice', [
      name,
      duration,
    ]),
  }

  if (legacy) {
    return multicallWrapper.raw([
      baseCall,
      {
        to: controller.address,
        data: controller.interface.encodeFunctionData('rentPrice', [name, 0]),
      },
    ])
  }

  return baseCall
}

const decode = async (
  { contracts, multicallWrapper }: ENSArgs<'contracts' | 'multicallWrapper'>,
  data: string,
  _name: string,
  _number: number,
  legacy?: boolean,
) => {
  if (data === null) return
  const controller = await contracts?.getEthRegistrarController()!
  try {
    let base: BigNumber
    let premium: BigNumber
    if (legacy) {
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
      ;[base, premium] = controller.interface.decodeFunctionData(
        'rentPrice',
        data,
      ) as [BigNumber, BigNumber]
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
