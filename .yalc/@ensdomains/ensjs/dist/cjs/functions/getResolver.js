'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const ethers_1 = require('ethers')
const hexEncodedName_1 = require('../utils/hexEncodedName')
const raw = async ({ contracts }, name) => {
  const universalResolver = await contracts?.getUniversalResolver()
  return {
    to: universalResolver.address,
    data: universalResolver.interface.encodeFunctionData('findResolver', [
      (0, hexEncodedName_1.hexEncodeName)(name),
    ]),
  }
}
const decode = async ({ contracts }, data) => {
  const universalResolver = await contracts?.getUniversalResolver()
  const response = universalResolver.interface.decodeFunctionResult(
    'findResolver',
    data,
  )
  if (
    !response ||
    !response[0] ||
    ethers_1.ethers.utils.hexStripZeros(response[0]) === '0x'
  ) {
    return null
  }
  return response[0]
}
exports.default = { raw, decode }
