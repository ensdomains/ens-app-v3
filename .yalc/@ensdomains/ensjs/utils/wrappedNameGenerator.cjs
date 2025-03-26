/* eslint-disable import/no-extraneous-dependencies */

const { BigNumber } = require('ethers')
const { namehash } = require('viem/ens')

const makeNameGenerator = async (hre, optionalNonceManager) => {
  const { getNamedAccounts } = hre
  const allNamedAccts = await getNamedAccounts()
  const controller = await ethers.getContract('ETHRegistrarController')
  const publicResolver = await ethers.getContract('PublicResolver')
  const nameWrapper = await ethers.getContract('NameWrapper')
  const nonceManager = optionalNonceManager ?? { getNonce: () => undefined }

  return {
    commit: async ({
      label,
      namedOwner,
      data = [],
      reverseRecord = false,
      fuses = 0,
      duration = 31536000,
    }) => {
      const secret =
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      const owner = allNamedAccts[namedOwner]
      const resolver = publicResolver.address
      const commitment = await controller.makeCommitment(
        label,
        owner,
        duration,
        secret,
        resolver,
        data,
        reverseRecord,
        fuses,
      )

      const _controller = controller.connect(await ethers.getSigner(owner))
      return _controller.commit(commitment, {
        nonce: nonceManager.getNonce(namedOwner),
      })
    },
    register: async ({
      label,
      namedOwner,
      data = [],
      reverseRecord = false,
      fuses = 0,
      duration = 31536000,
    }) => {
      const secret =
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      const owner = allNamedAccts[namedOwner]
      const resolver = publicResolver.address
      const [price] = await controller.rentPrice(label, duration)
      
      const priceWithBuffer = BigNumber.from(price).mul(105).div(100)
      const _controller = controller.connect(await ethers.getSigner(owner))
      return _controller.register(
        label,
        owner,
        duration,
        secret,
        resolver,
        data,
        reverseRecord,
        fuses,
        {
          value: priceWithBuffer,
          nonce: nonceManager.getNonce(namedOwner),
        },
      )
    },
    subname: async ({
      label,
      namedOwner,
      subnameLabel,
      namedSubnameOwner,
      subnameFuses = 0,
      subnameExpiry = BigNumber.from(2).pow(64).sub(1),
    }) => {
      const resolver = publicResolver.address
      const owner = allNamedAccts[namedOwner]
      const subnameOwner = allNamedAccts[namedSubnameOwner]
      const _nameWrapper = nameWrapper.connect(await ethers.getSigner(owner))
      return _nameWrapper.setSubnodeRecord(
        namehash(`${label}.eth`),
        subnameLabel,
        subnameOwner,
        resolver,
        '0',
        subnameFuses,
        subnameExpiry,
      )
    },
  }
}

module.exports = {
  makeNameGenerator,
}
