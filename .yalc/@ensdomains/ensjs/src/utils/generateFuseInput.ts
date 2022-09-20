import { ethers } from 'ethers'
import { FuseOptions } from '../@types/FuseOptions'
import fuses from './fuses'

export default (fuseOptions: FuseOptions) => {
  const fuseKeys = Object.keys(fuseOptions)
    .filter((opt) => fuseOptions[opt as keyof FuseOptions] === true)
    .map((opt) =>
      opt
        .split(/(?=[A-Z])/)
        .join('_')
        .toUpperCase(),
    )
  const bigNumberFuses = fuseKeys.reduce((prev, curr) => {
    return prev.or(fuses[curr as keyof typeof fuses])
  }, ethers.BigNumber.from(0))
  return bigNumberFuses.toHexString()
}
