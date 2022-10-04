/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { namehash } from 'ethers/lib/utils'
import fs from 'fs/promises'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  if (!hre.network.tags.generate) {
    return true
  }
  const { getUnnamedAccounts, network } = hre
  const allUnnamedAccts = await getUnnamedAccounts()

  const controller = await ethers.getContract('ETHRegistrarController')
  const publicResolver = await ethers.getContract('PublicResolver')

  let i = 0
  let errored = false

  let gasValues: number[] = []

  const makeData = (type: 'text' | 'address') => (n: number) => {
    const bigvalue = 'a'.repeat(n)
    const label = `wrapped-${n}`
    const reverseRecord = false
    const fuses = 0
    const data =
      type === 'text'
        ? [
            publicResolver.interface.encodeFunctionData('setText', [
              namehash(`${label}.eth`),
              'url1',
              bigvalue,
            ]),
          ]
        : [
            publicResolver.interface.encodeFunctionData('setAddr(bytes32,uint256,bytes)', [
              namehash(`${label}.eth`),
              '61',
              `0x${n === 1 ? '0a' : bigvalue}`,
            ]),
          ]
    const secret = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const owner = allUnnamedAccts[5]
    const resolver = publicResolver.address
    const duration = 31536000
    // 1659467455 is the approximate time of the transaction, this is for keeping block hashes the same
    const wrapperExpiry = 1659467455 + duration

    return {
      label,
      reverseRecord,
      fuses,
      data,
      secret,
      owner,
      resolver,
      duration,
      wrapperExpiry,
    }
  }

  const makeCommitment =
    (nonce: number) =>
    async (
      {
        label,
        reverseRecord,
        fuses,
        data,
        secret,
        owner,
        resolver,
        duration,
        wrapperExpiry,
      }: ReturnType<ReturnType<typeof makeData>>,
      index: number,
    ) => {
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
      const commitTx = await _controller.commit(commitment, { nonce: nonce + index })
      console.log(`Commiting commitment for ${label}.eth (tx: ${commitTx.hash})...`)
      return commitment
    }

  const makeItem =
    (nonce: number) =>
    async (
      {
        label,
        reverseRecord,
        fuses,
        data,
        secret,
        owner,
        resolver,
        duration,
        wrapperExpiry,
      }: ReturnType<ReturnType<typeof makeData>>,
      index: number,
    ) => {
      try {
        const [price] = await controller.rentPrice(label, duration)

        const _controller = controller.connect(await ethers.getSigner(owner))
        const estimatedTx = await _controller.estimateGas.register(
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
            nonce: nonce + index,
          },
        )

        if (estimatedTx.gt(30000000)) {
          errored = true
          return
        }

        const num = parseInt(label.split('-')[1])
        gasValues[num > 1 ? num / 32 + 1 : num] = estimatedTx.toNumber() - 265428
      } catch (e: any) {
        errored = true
      }
    }

  await network.provider.send('evm_setAutomine', [false])

  const single = async (type: 'address' | 'text') => {
    const baseNonce = await ethers.provider.getTransactionCount(allUnnamedAccts[5])
    const data = makeData(type)(1)
    await makeCommitment(baseNonce)(data, 0)
    await network.provider.send('evm_mine')
    const oldTimestamp = (await ethers.provider.getBlock('latest')).timestamp
    await network.provider.send('evm_setNextBlockTimestamp', [oldTimestamp + 60])
    await network.provider.send('evm_mine')
    await makeItem(baseNonce + 1)(data, 0)
  }

  await single('text')

  const multiple = async (type: 'address' | 'text', _i: number) => {
    const baseNonce = await ethers.provider.getTransactionCount(allUnnamedAccts[5])
    const numArr = Array.from({ length: 100 }, (_, n) => (n + _i) * 32)
    const dataArr = numArr.map(makeData(type))
    await Promise.all(dataArr.map(makeCommitment(baseNonce)))
    await network.provider.send('evm_mine')
    const oldTimestamp = (await ethers.provider.getBlock('latest')).timestamp
    await network.provider.send('evm_setNextBlockTimestamp', [oldTimestamp + 60])
    await network.provider.send('evm_mine')
    await Promise.all(dataArr.map(makeItem(baseNonce + 100)))
  }

  do {
    await multiple('text', i)
    i += 100
  } while (!errored)

  const makeUniques = () =>
    gasValues
      .reduce((prev, curr, inx) => {
        if (prev.find((p) => p[1] === curr)) {
          return prev
        }
        return [...prev, [inx, curr] as [number, number]]
      }, [] as [number, number][])
      .reverse()

  await fs.writeFile('./textRecordGasCosts-1.json', JSON.stringify(makeUniques()))

  i = 0
  gasValues = []
  errored = false
  await single('address')

  do {
    await multiple('address', i)
    i += 100
  } while (!errored)

  await fs.writeFile('./addrRecordGasCosts-1.json', JSON.stringify(makeUniques()))

  await network.provider.send('evm_setAutomine', [true])

  return true
}

func.id = 'get-registration-gas-values'
func.dependencies = ['ETHRegistrarController']
func.runAtTheEnd = true

export default func
