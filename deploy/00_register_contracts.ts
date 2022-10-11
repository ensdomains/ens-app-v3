/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { namehash } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const names = [
  {
    label: 'data',
    namedOwner: 'owner',
    data: [],
    reverseRecord: false,
    fuses: 0,
    subnames: [
      {
        label: 'eth-usd',
        namedOwner: 'owner',
        contract: 'DummyOracle',
      },
    ],
  },
]

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, network } = hre
  const allNamedAccts = await getNamedAccounts()

  const controller = await ethers.getContract('ETHRegistrarController')
  const publicResolver = await ethers.getContract('PublicResolver')

  await network.provider.send('anvil_setBlockTimestampInterval', [60])

  for (const { label, namedOwner, data, reverseRecord, fuses, subnames } of names) {
    const secret = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const owner = allNamedAccts[namedOwner]
    const resolver = publicResolver.address
    const duration = 31536000
    const wrapperExpiry = 1659467455 + duration

    const commitment = await controller.makeCommitment(
      label,
      owner,
      duration,
      secret,
      resolver,
      data,
      reverseRecord,
      fuses,
      wrapperExpiry,
    )

    const _controller = controller.connect(await ethers.getSigner(owner))
    const commitTx = await controller.commit(commitment)
    console.log(`Commiting commitment for ${label}.eth (tx: ${commitTx.hash})...`)
    await commitTx.wait()

    await network.provider.send('evm_mine')

    const [price] = await controller.rentPrice(label, duration)

    const registerTx = await _controller.register(
      label,
      owner,
      duration,
      secret,
      resolver,
      data,
      reverseRecord,
      fuses,
      wrapperExpiry,
      {
        value: price,
      },
    )
    console.log(`Registering name ${label}.eth (tx: ${registerTx.hash})...`)
    await registerTx.wait()

    if (subnames) {
      console.log(`Setting subnames for ${label}.eth...`)
      const nameWrapper = await ethers.getContract('NameWrapper')
      for (const {
        label: subnameLabel,
        namedOwner: namedSubnameOwner,
        contract: subnameContract,
      } of subnames) {
        const subnameOwner = allNamedAccts[namedSubnameOwner]
        const _nameWrapper = nameWrapper.connect(await ethers.getSigner(owner))
        const setSubnameTx = await _nameWrapper.setSubnodeRecord(
          namehash(`${label}.eth`),
          subnameLabel,
          subnameOwner,
          resolver,
          '0',
          '0',
          wrapperExpiry,
        )
        console.log(` - ${subnameLabel} (tx: ${setSubnameTx.hash})...`)
        await setSubnameTx.wait()

        if (subnameContract) {
          console.log('setting', subnameContract, 'contract for', `${subnameLabel}.${label}.eth`)
          const _publicResolver = publicResolver.connect(await ethers.getSigner(subnameOwner))

          const contract = await ethers.getContract(subnameContract)

          const hash = namehash(`${subnameLabel}.${label}.eth`)

          console.log('setting address records for ', `${subnameLabel}.${label}.eth`)

          const setAddrTx = await _publicResolver['setAddr(bytes32,uint256,bytes)'](
            hash,
            '60',
            contract.address,
          )
          console.log(` - ${subnameContract} ${contract.address} (tx: ${setAddrTx.hash})...`)
          await setAddrTx.wait()
        }
      }
    }
  }

  await network.provider.send('anvil_setBlockTimestampInterval', [1])

  return true
}

func.id = 'register-contracts'
func.tags = ['register-contracts']
func.dependencies = ['ETHRegistrarController']
func.runAtTheEnd = true

export default func
