'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
async function default_1(
  { contracts, provider, transferSubname },
  name,
  contract,
  options,
) {
  return transferSubname(
    name,
    contract,
    '0x0000000000000000000000000000000000000000',
    options,
  )
}
exports.default = default_1
