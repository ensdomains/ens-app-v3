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
const hexEncodedName_1 = require('../utils/hexEncodedName')
async function wrapETH(
  { contracts },
  labels,
  wrappedOwner,
  decodedFuses,
  resolverAddress,
  signer,
  address,
) {
  const nameWrapper = await contracts?.getNameWrapper()
  const baseRegistrar = (await contracts?.getBaseRegistrar()).connect(signer)
  const labelhash = ethers_1.ethers.utils.solidityKeccak256(
    ['string'],
    [labels[0]],
  )
  const data = ethers_1.ethers.utils.defaultAbiCoder.encode(
    ['string', 'address', 'uint96', 'address'],
    [labels[0], wrappedOwner, decodedFuses, resolverAddress],
  )
  return baseRegistrar['safeTransferFrom(address,address,uint256,bytes)'](
    address,
    nameWrapper.address,
    labelhash,
    data,
  )
}
async function wrapOther(
  { contracts },
  name,
  wrappedOwner,
  decodedFuses,
  resolverAddress,
  address,
) {
  const nameWrapper = await contracts?.getNameWrapper()
  const registry = await contracts?.getRegistry()
  const hasApproval = await registry.isApprovedForAll(
    address,
    nameWrapper.address,
  )
  if (!hasApproval) {
    throw new Error(
      'NameWrapper must have approval to wrap a name from this address.',
    )
  }
  return nameWrapper.wrap(
    (0, hexEncodedName_1.hexEncodeName)(name),
    wrappedOwner,
    decodedFuses,
    resolverAddress,
  )
}
async function default_1(
  { contracts, provider },
  name,
  wrappedOwner,
  fuseOptions,
  resolverAddress,
  options,
) {
  const signer = provider?.getSigner(options?.addressOrIndex)
  const address = await signer?.getAddress()
  if (!signer || !address) {
    throw new Error('No signer found')
  }
  let decodedFuses
  switch (typeof fuseOptions) {
    case 'object': {
      decodedFuses = (0, generateFuseInput_1.default)(fuseOptions)
      break
    }
    case 'number': {
      decodedFuses = fuseOptions.toString(16)
      break
    }
    case 'string': {
      decodedFuses = fuseOptions
      break
    }
    case 'undefined': {
      decodedFuses = '0'
      break
    }
    default: {
      throw new Error(`Invalid fuseOptions type: ${typeof fuseOptions}`)
    }
  }
  const publicResolver = await contracts?.getPublicResolver()
  if (!resolverAddress) resolverAddress = publicResolver.address
  const labels = name.split('.')
  if (labels.length < 3 && labels[labels.length - 1] === 'eth') {
    return wrapETH(
      { contracts },
      labels,
      wrappedOwner,
      decodedFuses,
      resolverAddress,
      signer,
      address,
    )
  } else {
    return wrapOther(
      { contracts },
      name,
      wrappedOwner,
      decodedFuses,
      resolverAddress,
      address,
    )
  }
}
exports.default = default_1
