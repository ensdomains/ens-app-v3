'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const ethers_1 = require('ethers')
const generateFuseInput_1 = __importDefault(
  require('../utils/generateFuseInput'),
)
async function default_1({ contracts, provider }, name, fusesToBurn) {
  const signer = provider?.getSigner()
  if (!signer) {
    throw new Error('No signer found')
  }
  const nameWrapper = (await contracts?.getNameWrapper()).connect(signer)
  const namehash = ethers_1.ethers.utils.namehash(name)
  const encodedFuses = (0, generateFuseInput_1.default)(fusesToBurn)
  return nameWrapper.burnFuses(namehash, encodedFuses)
}
exports.default = default_1
