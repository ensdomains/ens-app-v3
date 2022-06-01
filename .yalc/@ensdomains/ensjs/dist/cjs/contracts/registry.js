'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const ENSRegistry__factory_1 = require('../generated/factories/ENSRegistry__factory')
const defaultAddress = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e'
exports.default = (provider, address) =>
  ENSRegistry__factory_1.ENSRegistry__factory.connect(
    address || defaultAddress,
    provider,
  )
