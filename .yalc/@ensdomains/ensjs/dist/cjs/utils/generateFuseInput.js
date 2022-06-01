'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const ethers_1 = require('ethers')
const fuses_1 = __importDefault(require('./fuses'))
exports.default = (fuseOptions) => {
  const fuseKeys = Object.keys(fuseOptions)
    .filter((opt) => fuseOptions[opt] === true)
    .map((opt) =>
      opt
        .split(/(?=[A-Z])/)
        .join('_')
        .toUpperCase(),
    )
  const bigNumberFuses = fuseKeys.reduce((prev, curr) => {
    return prev.or(fuses_1.default[curr])
  }, ethers_1.ethers.BigNumber.from(0))
  return bigNumberFuses.toHexString()
}
