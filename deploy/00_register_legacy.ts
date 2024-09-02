/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import cbor from 'cbor'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import pako from 'pako'
import { labelhash, namehash, stringToBytes } from 'viem'

const dummyABI = [
  {
    type: 'event',
    anonymous: false,
    name: 'ABIChanged',
    inputs: [
      {
        type: 'bytes32',
        indexed: true,
      },
      {
        type: 'uint256',
        indexed: true,
      },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    name: 'VersionChanged',
    inputs: [
      {
        type: 'bytes32',
        indexed: true,
      },
      {
        type: 'uint64',
      },
    ],
  },
  {
    type: 'function',
    name: 'ABI',
    constant: true,
    stateMutability: 'view',
    payable: false,
    inputs: [
      {
        type: 'bytes32',
      },
      {
        type: 'uint256',
      },
    ],
    outputs: [
      {
        type: 'uint256',
      },
      {
        type: 'bytes',
      },
    ],
  },
  {
    type: 'function',
    name: 'clearRecords',
    constant: false,
    payable: false,
    inputs: [
      {
        type: 'bytes32',
      },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'recordVersions',
    constant: true,
    stateMutability: 'view',
    payable: false,
    inputs: [
      {
        type: 'bytes32',
      },
    ],
    outputs: [
      {
        type: 'uint64',
      },
    ],
  },
  {
    type: 'function',
    name: 'setABI',
    constant: false,
    payable: false,
    inputs: [
      {
        type: 'bytes32',
      },
      {
        type: 'uint256',
      },
      {
        type: 'bytes',
      },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'supportsInterface',
    constant: true,
    stateMutability: 'view',
    payable: false,
    inputs: [
      {
        type: 'bytes4',
      },
    ],
    outputs: [
      {
        type: 'bool',
      },
    ],
  },
]

type Name = {
  label: string
  namedOwner: string
  namedAddr: string
  subname?: string
  namedController?: string
  resolver?: string
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
    abi?:
      | {
          contentType: number
          data: any
        }
      | {
          contentType: number
          data: any
        }[]
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
    records: {
      text: [
        { key: 'description', value: 'Hello2' },
        { key: 'url', value: 'https://twitter.com' },
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
    label: 'to-be-wrapped',
    namedOwner: 'owner',
    namedAddr: 'owner',
    records: {
      text: [
        { key: 'description', value: 'Hello2' },
        { key: 'url', value: 'https://twitter.com' },
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
    label: 'other-registrant-2',
    namedOwner: 'deployer',
    namedAddr: 'deployer',
    namedController: 'owner',
  },
  {
    label: 'almost-latest-resolver',
    namedOwner: 'owner',
    namedAddr: 'owner',
    namedController: 'owner',
  },
  {
    label: 'migrated-resolver-to-be-updated',
    namedOwner: 'owner',
    namedAddr: 'owner',
    records: {
      text: [
        { key: 'description', value: 'Hello2' },
        { key: 'url', value: 'https://twitter.com' },
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
    label: 'unwrapped-to-delete',
    namedOwner: 'owner',
    namedAddr: 'owner',
    subnames: [
      { label: 'parent-not-child', namedOwner: 'deployer' },
      { label: 'parent-child', namedOwner: 'owner' },
      { label: 'not-parent-child', namedOwner: 'deployer' },
    ],
  },
  {
    label: 'name-with-premium',
    namedOwner: 'owner',
    namedAddr: 'owner',
    customDuration: 3283200,
  },
  {
    label: 'expired',
    namedOwner: 'owner',
    namedAddr: 'owner',
    customDuration: 2419200,
  },
  {
    label: 'grace-period',
    namedOwner: 'owner',
    namedAddr: 'owner',
    customDuration: 5011200,
  },
  {
    label: 'grace-period-in-list',
    namedOwner: 'owner',
    namedAddr: 'owner',
    customDuration: 5011200,
  },
  {
    label: 'grace-period-starting-soon',
    namedOwner: 'owner',
    namedAddr: 'owner',
    customDuration: 12900600,
  },
  {
    label: 'unwrapped-with-wrapped-subnames',
    namedOwner: 'owner',
    namedAddr: 'owner',
    subnames: [{ label: 'sub', namedOwner: 'owner' }],
  },
  // {
  //   label: 'unknown-labels',
  //   namedOwner: 'owner',
  //   namedAddr: 'owner',
  //   subnames: [
  //     { label: 'aaa123xyz000', namedOwner: 'owner2' },
  //     { label: 'aaa123', namedOwner: 'owner' },
  //   ],
  // },
  {
    label: 'aaa123',
    namedOwner: 'owner',
    namedAddr: 'owner',
  },
  {
    label: 'with-abi',
    namedOwner: 'owner',
    namedAddr: 'owner',
    records: {
      abi: {
        contentType: 1,
        data: dummyABI,
      },
    },
  },
  {
    label: 'with-all-abis',
    namedOwner: 'owner',
    namedAddr: 'owner',
    records: {
      abi: [
        {
          contentType: 1,
          data: dummyABI,
        },
        {
          contentType: 2,
          data: dummyABI,
        },
        {
          contentType: 4,
          data: dummyABI,
        },
        {
          contentType: 8,
          data: 'https://example.com',
        },
      ],
    },
  },
]

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, network } = hre
  const allNamedAccts = await getNamedAccounts()

  const registry = await ethers.getContract('ENSRegistry')
  const controller = await ethers.getContract('LegacyETHRegistrarController')
  const publicResolver = await ethers.getContract('LegacyPublicResolver')

  const makeData = ({
    namedOwner,
    namedController,
    namedAddr,
    customDuration,
    subnames,
    ...rest
  }: Name) => {
    // eslint-disable-next-line no-restricted-syntax
    const secret = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const registrant = allNamedAccts[namedOwner]
    const owner = namedController ? allNamedAccts[namedController] : undefined
    const addr = allNamedAccts[namedAddr]
    const resolver = rest.resolver ?? publicResolver.address
    const duration = customDuration || 31536000

    return {
      ...rest,
      secret,
      registrant,
      owner,
      addr,
      resolver,
      duration,
      subnames,
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
      if (records.abi) {
        const abis = Array.isArray(records.abi) ? records.abi : [records.abi]
        for (const abi of abis) {
          console.log('ABI')
          const { contentType, data } = abi
          let data_
          if (contentType === 1) data_ = stringToBytes(JSON.stringify(data))
          else if (contentType === 2) data_ = pako.deflate(JSON.stringify(abi.data))
          else if (contentType === 4) data_ = cbor.encode(abi.data)
          else data_ = stringToBytes(data)
          const setAbiTx = await _publicResolver.setABI(hash, contentType, data_, {
            nonce: nonceRef,
          })
          console.log(` - ${records.abi} (tx: ${setAbiTx.hash})...`)
          nonceRef += 1
        }
      }
      return nonceRef - nonce - index
    }

  const makeSubnames =
    (nonce: number) =>
    async (
      { label, subnames, registrant, resolver }: ReturnType<typeof makeData>,
      index: number,
    ) => {
      if (!subnames) return 0
      for (let i = 0; i < subnames.length; i += 1) {
        const { label: subnameLabel, namedOwner: namedSubOwner } = subnames[i]
        const subOwner = allNamedAccts[namedSubOwner]
        const _registry = registry.connect(await ethers.getSigner(registrant))
        const subnameTx = await _registry.setSubnodeRecord(
          namehash(`${label}.eth`),
          labelhash(subnameLabel),
          subOwner,
          resolver,
          0,
          {
            nonce: nonce + index + i,
          },
        )
        console.log(`Creating subname ${subnameLabel}.${label}.eth (tx: ${subnameTx.hash})...`)
      }
      return subnames.length
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
        usedNonces += await _func(newNonceMap[account])(data, usedNonces)
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
  const tempNonces2 = await getNonceAndApply(
    'registrant',
    makeController,
    (data) => !!data.owner,
    tempNonces,
  )
  await getNonceAndApply('registrant', makeSubnames, (data) => !!data.subnames, tempNonces2)
  await network.provider.send('evm_mine')

  // Skip forward 28 + 90 days so that minimum exp names go into premium
  await network.provider.send('anvil_setBlockTimestampInterval', [2419200 + 7776000])
  await network.provider.send('evm_mine')

  await network.provider.send('evm_setAutomine', [true])
  await network.provider.send('anvil_setBlockTimestampInterval', [1])
  await network.provider.send('evm_mine')

  // register subname
  const resolver = publicResolver.address
  const registrant = allNamedAccts.owner
  const _registry = registry.connect(await ethers.getSigner(registrant))
  const subnameTx = await _registry.setSubnodeRecord(
    namehash('test123.eth'),
    labelhash('sub'),
    registrant,
    resolver,
    0,
  )
  await subnameTx.wait()

  return true
}

func.id = 'register-unwrapped-names'
func.tags = ['register-unwrapped-names']
func.dependencies = ['LegacyETHRegistrarController']
func.runAtTheEnd = true

export default func
