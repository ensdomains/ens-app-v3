/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
import crypto from 'crypto'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { namehash } from 'ethers/lib/utils'

const names = [
  {
    label: 'resolver-migrated-not-updated',
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
    migrate: true,
  },
]

const randomSecret = () => {
  return `0x${crypto.randomBytes(32).toString('hex')}`
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, network } = hre
  const allNamedAccts = await getNamedAccounts()

  const controller = await ethers.getContract('LegacyETHRegistrarController')
  const publicResolver = await ethers.getContract('LegacyPublicResolver')

  for (const { label, namedOwner, namedAddr, records, migrate } of names) {
    const secret = randomSecret()
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

    await network.provider.send('evm_increaseTime', [60])
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

      if (migrate) {
        const latestPublicResolver = await ethers.getContract('PublicResolver')
        const _latestPublicResolver = latestPublicResolver.connect(
          await ethers.getSigner(registrant),
        )

        console.log(`Setting records for ${label}.eth...`)
        if (records.text) {
          console.log('TEXT')
          for (const { key, value } of records.text) {
            const setTextTx = await _latestPublicResolver.setText(hash, key, value)
            console.log(` - ${key} ${value} (tx: ${setTextTx.hash})...`)
            await setTextTx.wait()
          }
        }
        if (records.addr) {
          console.log('ADDR')
          for (const { key, value } of records.addr) {
            const setAddrTx = await _latestPublicResolver['setAddr(bytes32,uint256,bytes)'](
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
          const setContenthashTx = await _latestPublicResolver.setContenthash(
            hash,
            records.contenthash,
          )
          console.log(` - ${records.contenthash} (tx: ${setContenthashTx.hash})...`)
          await setContenthashTx.wait()
        }
      }
    }
  }

  return true
}

func.id = 'register-other-names'
func.tags = ['register-other-names']
func.dependencies = ['LegacyETHRegistrarController']
func.runAtTheEnd = true

export default func
