'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const DoNotCallOnChainUniversalResolverProxy__factory_1 = require('../generated/factories/DoNotCallOnChainUniversalResolverProxy__factory')
const defaultAddress = '0x17ED1CF9A6E57e3E9fC0832bee4a965eB6ee12E6'
exports.default = (provider, address) =>
  DoNotCallOnChainUniversalResolverProxy__factory_1.DoNotCallOnChainUniversalResolverProxy__factory.connect(
    address || defaultAddress,
    provider,
  )
