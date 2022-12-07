import { ethers } from 'ethers'
import fuses, { FuseOptions } from './fuses'

export default (fuseOptions: FuseOptions) => {
  const fuseKeys = Object.keys(fuseOptions).filter(
    (opt) => fuseOptions[opt as keyof FuseOptions] === true,
  )

  const bigNumberFuses = fuseKeys.reduce((prev, curr) => {
    return prev.or(fuses[curr as keyof typeof fuses])
  }, ethers.BigNumber.from(0))
  return bigNumberFuses.toHexString()
}
