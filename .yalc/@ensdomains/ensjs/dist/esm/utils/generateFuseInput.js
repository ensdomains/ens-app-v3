import { ethers } from 'ethers'
import fuses from './fuses'
export default (fuseOptions) => {
  const fuseKeys = Object.keys(fuseOptions)
    .filter((opt) => fuseOptions[opt] === true)
    .map((opt) =>
      opt
        .split(/(?=[A-Z])/)
        .join('_')
        .toUpperCase(),
    )
  const bigNumberFuses = fuseKeys.reduce((prev, curr) => {
    return prev.or(fuses[curr])
  }, ethers.BigNumber.from(0))
  return bigNumberFuses.toHexString()
}
