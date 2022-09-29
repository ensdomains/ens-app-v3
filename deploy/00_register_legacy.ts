/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { namehash } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

import { labelhash } from '@ensdomains/ensjs/utils/labels'

type Name = {
  label: string
  namedOwner: string
  namedAddr: string
  namedController?: string
  records?: {
    text?: {
      key: string
      value: string
    }[]
    addr?: {
      key: number
      value: string
    }[]
    contenthash?: string
  }
  subnames?: {
    label: string
    namedOwner: string
  }[]
  customDuration?: number
}

const names: Name[] = [
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
  {
    label: 'with-subnames',
    namedOwner: 'owner',
    namedAddr: 'owner',
    subnames: [
      { label: 'test', namedOwner: 'owner' },
      { label: 'legacy', namedOwner: 'deployer' },
      { label: 'xyz', namedOwner: 'owner' },
      { label: 'addr', namedOwner: 'owner' },
    ],
  },
  {
    label: 'name-with-premium',
    namedOwner: 'owner',
    namedAddr: 'owner',
    customDuration: 2419200,
  },
]

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, network } = hre
  const allNamedAccts = await getNamedAccounts()

  const registry = await ethers.getContract('ENSRegistry')
  const controller = await ethers.getContract('LegacyETHRegistrarController')
  const publicResolver = await ethers.getContract('LegacyPublicResolver')


  const makeData = ({ namedOwner, namedController, namedAddr, customDuration, ...rest }: Name) => {
    const secret = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const registrant = allNamedAccts[namedOwner]
    const owner = namedController ? allNamedAccts[namedController] : undefined
    const addr = allNamedAccts[namedAddr]
    const resolver = publicResolver.address
    const duration = customDuration || 31536000

    return {
      ...rest,
      secret,
      registrant,
      owner,
      addr,
      resolver,
      duration,
    }
  }

  const makeCommitment =
    (nonce: number) =>
    async (
      { label, registrant, secret, resolver, addr }: ReturnType<typeof makeData>,
      index: number,
    ) => {
      const commitment = await controller.makeCommitmentWithConfig(
        label,
        registrant,
        secret,
        resolver,
        addr,
      )

      const _controller = controller.connect(await ethers.getSigner(registrant))
      const commitTx = await _controller.commit(commitment, { nonce: nonce + index })
      console.log(`Commiting commitment for ${label}.eth (tx: ${commitTx.hash})...`)

      return 1
    }

  const makeRegistration =
    (nonce: number) =>
    async (
      { label, registrant, secret, resolver, addr, duration }: ReturnType<typeof makeData>,
      index: number,
    ) => {
      const price = await controller.rentPrice(label, duration)

      const _controller = controller.connect(await ethers.getSigner(registrant))

      const registerTx = await _controller.registerWithConfig(
        label,
        registrant,
        duration,
        secret,
        resolver,
        addr,
        {
          value: price,
          nonce: nonce + index,
        },
      )
      console.log(`Registering name ${label}.eth (tx: ${registerTx.hash})...`)

      return 1
    }

  const makeRecords =
    (nonce: number) =>
    async (
      { label, records: _records, registrant }: ReturnType<typeof makeData>,
      index: number,
    ) => {
      const records = _records!
      let nonceRef = nonce + index
      const _publicResolver = publicResolver.connect(await ethers.getSigner(registrant))

      const hash = namehash(`${label}.eth`)
      console.log(`Setting records for ${label}.eth...`)
      if (records.text) {
        console.log('TEXT')
        for (const { key, value } of records.text) {
          const setTextTx = await _publicResolver.setText(hash, key, value, { nonce: nonceRef })
          console.log(` - ${key} ${value} (tx: ${setTextTx.hash})...`)
          nonceRef += 1
        }
      }
      if (records.addr) {
        console.log('ADDR')
        for (const { key, value } of records.addr) {
          const setAddrTx = await _publicResolver['setAddr(bytes32,uint256,bytes)'](
            hash,
            key,
            value,
            {
              nonce: nonceRef,
            },
          )
          console.log(` - ${key} ${value} (tx: ${setAddrTx.hash})...`)
          nonceRef += 1
        }
      }
      if (records.contenthash) {
        console.log('CONTENTHASH')
        const setContenthashTx = await _publicResolver.setContenthash(hash, records.contenthash, {
          nonce: nonceRef,
        })
        console.log(` - ${records.contenthash} (tx: ${setContenthashTx.hash})...`)
        nonceRef += 1
      }

      return nonceRef - nonce
    }

    const makeSubnames = (subnames: Name['subnames']) => {
      console.log(`Setting subnames for ${label}.eth...`)
      for (const { label: subnameLabel, namedOwner: subnameOwner } of subnames) {
        const owner = allNamedAccts[subnameOwner]
        const _registry = registry.connect(await ethers.getSigner(registrant))
        const setSubnameTx = await _registry.setSubnodeRecord(
          namehash(`${label}.eth`),
          labelhash(subnameLabel),
          owner,
          resolver,
          '0',
        )
        console.log(` - ${subnameLabel} (tx: ${setSubnameTx.hash})...`)
        await setSubnameTx.wait()
      }
    }

  const makeController =
    (nonce: number) =>
    async ({ label, owner, registrant }: ReturnType<typeof makeData>, index: number) => {
      const _registry = registry.connect(await ethers.getSigner(registrant))
      const setControllerTx = await _registry.setOwner(namehash(`${label}.eth`), owner, {
        nonce: nonce + index,
      })
      console.log(
        `Setting controller for ${label}.eth to ${owner} (tx: ${setControllerTx.hash})...`,
      )

      return 1
    }

  const allNameData = names.map(makeData)

  const getNonceAndApply = async (
    property: keyof ReturnType<typeof makeData>,
    _func: typeof makeCommitment,
    filter?: (data: ReturnType<typeof makeData>) => boolean,
    nonceMap?: Record<string, number>,
  ) => {
    const newNonceMap = nonceMap || {}
    for (const account of Object.values(allNamedAccts)) {
      const namesWithAccount = allNameData.filter(
        (data) => data[property] === account && (filter ? filter(data) : true),
      )
      if (!newNonceMap[account]) {
        const nonce = await ethers.provider.getTransactionCount(account)
        newNonceMap[account] = nonce
      }
      let usedNonces = 0

      for (let i = 0; i < namesWithAccount.length; i += 1) {
        const data = namesWithAccount[i]
        usedNonces += await _func(newNonceMap[account])(data, i)
      }
      newNonceMap[account] += usedNonces
    }
    return newNonceMap
  }

  await network.provider.send('evm_setAutomine', [false])
  await getNonceAndApply('registrant', makeCommitment)
  await network.provider.send('evm_mine')
  const oldTimestamp = (await ethers.provider.getBlock('latest')).timestamp
  await network.provider.send('evm_setNextBlockTimestamp', [oldTimestamp + 60])
  await network.provider.send('evm_mine')
  await getNonceAndApply('registrant', makeRegistration)
  await network.provider.send('evm_mine')
  const tempNonces = await getNonceAndApply('registrant', makeRecords, (data) => !!data.records)
  await getNonceAndApply('registrant', makeController, (data) => !!data.owner, tempNonces)
  await network.provider.send('evm_mine')

  // Skip forward 28 + 90 days so that minimum exp names go into premium
  await network.provider.send('anvil_setBlockTimestampInterval', [2419200 + 7776000])
  await network.provider.send('evm_mine')

  await network.provider.send('evm_setAutomine', [true])
  await network.provider.send('anvil_setBlockTimestampInterval', [1])
  await network.provider.send('evm_mine')

  return true
}

func.id = 'register-unwrapped-names'
func.tags = ['register-unwrapped-names']
func.dependencies = ['LegacyETHRegistrarController']
func.runAtTheEnd = true

export default func
