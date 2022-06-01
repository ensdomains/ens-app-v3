'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const ReverseRegistrar__factory_1 = require('../generated/factories/ReverseRegistrar__factory')
const defaultAddress = '0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC'
exports.default = (provider, address) =>
  ReverseRegistrar__factory_1.ReverseRegistrar__factory.connect(
    address || defaultAddress,
    provider,
  )
