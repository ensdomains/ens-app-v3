'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const UniversalResolver__factory_1 = require('../generated/factories/UniversalResolver__factory')
const defaultAddress = '0x454b1F7d4C741A2f86AF7eF19b44B2A6EE179443'
exports.default = (provider, address) =>
  UniversalResolver__factory_1.UniversalResolver__factory.connect(
    address || defaultAddress,
    provider,
  )
