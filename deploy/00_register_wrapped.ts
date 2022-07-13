import crypto from 'crypto'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { getIndexForOwner, setOriginalNonces } from './00_register_legacy'

const names = [
  {
    label: 'wrapped',
    owner: 'owner',
    data: [],
    reverseRecord: true,
    fuses: 0,
  },
]

const randomSecret = () => {
  return `0x${crypto.randomBytes(32).toString('hex')}`
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, network } = hre
  const allNamedAccts = await getNamedAccounts()

  const controller = await ethers.getContract('ETHRegistrarController')
  const publicResolver = await ethers.getContract('PublicResolver')

  let originalNonces = await setOriginalNonces(allNamedAccts)

  const partialCommitments = await Promise.all(
    names.map(async (nameObj) => {
      const secret = randomSecret()
      const { label, data, reverseRecord, fuses } = nameObj
      const ownerAddr = allNamedAccts[nameObj.owner]
      const resolver = publicResolver.address
      const duration = 31536000
      const wrapperExpiry = 0

      const nonceDiff = getIndexForOwner(label, nameObj.owner, names)
      const nonce = originalNonces[ownerAddr] + nonceDiff

      const _controller = controller.connect(await ethers.getSigner(ownerAddr))

      const commitment = await _controller.makeCommitment(
        label,
        ownerAddr,
        duration,
        secret,
        resolver,
        data,
        reverseRecord,
        fuses,
        wrapperExpiry,
        {
          nonce,
        },
      )

      const commitTx = await controller.commit(commitment)
      console.log(
        `Commiting commitment for ${label}.eth (tx: ${commitTx.hash})...`,
      )
      await commitTx.wait()

      return {
        label,
        ownerAddr,
        duration,
        secret,
        resolver,
        data,
        reverseRecord,
        fuses,
        wrapperExpiry,
        nonceDiff,
      }
    }),
  )

  await network.provider.send('evm_increaseTime', [60])
  await network.provider.send('evm_mine')

  originalNonces = await setOriginalNonces(allNamedAccts)

  await Promise.all(
    partialCommitments.map(
      async ({
        label,
        ownerAddr,
        duration,
        secret,
        resolver,
        data,
        reverseRecord,
        fuses,
        wrapperExpiry,
        nonceDiff,
      }) => {
        const nonce = originalNonces[ownerAddr] + nonceDiff

        const [price] = await controller.rentPrice(label, duration)

        const _controller = controller.connect(
          await ethers.getSigner(ownerAddr),
        )

        const registerTx = await _controller.register(
          label,
          ownerAddr,
          duration,
          secret,
          resolver,
          data,
          reverseRecord,
          fuses,
          wrapperExpiry,
          {
            value: price,
            nonce,
          },
        )
        console.log(`Registering name ${label}.eth (tx: ${registerTx.hash})...`)
        await registerTx.wait()
      },
    ),
  )

  return true
}

func.id = 'register-wrapped-names'
func.tags = ['register-wrapped-names']
func.dependencies = ['ETHRegistrarController']
func.runAtTheEnd = true

export default func
