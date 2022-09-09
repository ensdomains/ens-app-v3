/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */

import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { namehash } from 'ethers/lib/utils'

const names = [
  {
    label: 'migrated-resolver-to-be-updated',
    namedOwner: 'owner',
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

  const publicResolver = await ethers.getContract('PublicResolver')

  await network.provider.send('anvil_setBlockTimestampInterval', [60])

  for (const { label, namedOwner, records } of names) {
    const registrant = allNamedAccts[namedOwner]
    const hash = namehash(`${label}.eth`)
    const _publicResolver = publicResolver.connect(await ethers.getSigner(registrant))

    console.log(`Migrating records for ${label}.eth...`)
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
        const setAddrTx = await _publicResolver['setAddr(bytes32,uint256,bytes)'](hash, key, value)
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

  await network.provider.send('anvil_setBlockTimestampInterval', [1])

  return true
}

func.id = 'migrate-legacy-records'
func.runAtTheEnd = true

export default func
