/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { namehash } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const names = [
  {
    label: 'test123',
    namedOwner: 'owner',
    namedAddr: 'owner',
  },
  {
    label: 'to-be-wrapped',
    namedOwner: 'owner',
    namedAddr: 'owner',
  },
  {
    label: 'resume-and-wrap',
    namedOwner: 'owner',
    namedAddr: 'owner',
  },
  {
    label: 'other-registrant',
    namedOwner: 'deployer',
    namedAddr: 'deployer',
  },
  {
    label: 'other-eth-record',
    namedOwner: 'owner',
    namedAddr: 'deployer',
  },
  {
    label: 'from-settings',
    namedOwner: 'owner',
    namedAddr: 'owner',
  },
  {
    label: 'other-controller',
    namedOwner: 'owner',
    namedAddr: 'owner',
    namedController: 'deployer',
  },
  {
    label: 'migrated-resolver-to-be-updated',
    namedOwner: 'owner',
    namedAddr: 'owner',
    records: {
      text: [
        { key: 'description', value: 'Hello2' },
        { key: 'url', value: 'twitter.com' },
        { key: 'blankrecord', value: '' },
        { key: 'email', value: 'fakeemail@fake.com' },
      ],
      addr: [
        { key: 61, value: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' },
        { key: 0, value: '0x00149010587f8364b964fcaa70687216b53bd2cbd798' },
        { key: 2, value: '0x0000000000000000000000000000000000000000' },
      ],
      contenthash: '0xe301017012204edd2984eeaf3ddf50bac238ec95c5713fb40b5e428b508fdbe55d3b9f155ffe',
    },
  },
]

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, network } = hre
  const allNamedAccts = await getNamedAccounts()

  const registry = await ethers.getContract('ENSRegistry')
  const controller = await ethers.getContract('LegacyETHRegistrarController')
  const publicResolver = await ethers.getContract('LegacyPublicResolver')

  await network.provider.send('anvil_setBlockTimestampInterval', [60])

  for (const { label, namedOwner, namedAddr, records } of names) {
    const secret = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const registrant = allNamedAccts[namedOwner]
    const resolver = publicResolver.address
    const addr = allNamedAccts[namedAddr]
    const duration = 31536000

    const commitment = await controller.makeCommitmentWithConfig(
      label,
      registrant,
      secret,
      resolver,
      addr,
    )

    const _controller = controller.connect(await ethers.getSigner(registrant))
    const commitTx = await _controller.commit(commitment)
    console.log(`Commiting commitment for ${label}.eth (tx: ${commitTx.hash})...`)
    await commitTx.wait()

    await network.provider.send('evm_mine')

    const price = await controller.rentPrice(label, duration)

    const registerTx = await _controller.registerWithConfig(
      label,
      registrant,
      duration,
      secret,
      resolver,
      addr,
      {
        value: price,
      },
    )
    console.log(`Registering name ${label}.eth (tx: ${registerTx.hash})...`)
    await registerTx.wait()

    if (records) {
      const _publicResolver = publicResolver.connect(await ethers.getSigner(registrant))

      const hash = namehash(`${label}.eth`)
      console.log(`Setting records for ${label}.eth...`)
      if (records.text) {
        console.log('TEXT')
        for (const { key, value } of records.text) {
          const setTextTx = await _publicResolver.setText(hash, key, value)
          console.log(` - ${key} ${value} (tx: ${setTextTx.hash})...`)
          await setTextTx.wait()
        }
      }
      if (records.addr) {
        console.log('ADDR')
        for (const { key, value } of records.addr) {
          const setAddrTx = await _publicResolver['setAddr(bytes32,uint256,bytes)'](
            hash,
            key,
            value,
          )
          console.log(` - ${key} ${value} (tx: ${setAddrTx.hash})...`)
          await setAddrTx.wait()
        }
      }
      if (records.contenthash) {
        console.log('CONTENTHASH')
        const setContenthashTx = await _publicResolver.setContenthash(hash, records.contenthash)
        console.log(` - ${records.contenthash} (tx: ${setContenthashTx.hash})...`)
        await setContenthashTx.wait()
      }
    }
  }

  await network.provider.send('anvil_setBlockTimestampInterval', [1])

  for (const { label, namedController, namedOwner } of names.filter((n) => n.namedController)) {
    const registrant = allNamedAccts[namedOwner]
    const owner = allNamedAccts[namedController!]

    const _registry = registry.connect(await ethers.getSigner(registrant))
    const setControllerTx = await _registry.setOwner(namehash(`${label}.eth`), owner)
    console.log(`Setting controller for ${label}.eth to ${owner} (tx: ${setControllerTx.hash})...`)
    await setControllerTx.wait()
  }

  return true
}

func.id = 'register-unwrapped-names'
func.tags = ['register-unwrapped-names']
func.dependencies = ['LegacyETHRegistrarController']
func.runAtTheEnd = true

export default func
