import crypto from 'crypto'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const names = [
  {
    label: 'test123',
    owner: 'owner',
    addr: 'owner',
  },
  {
    label: 'to-be-wrapped',
    owner: 'owner',
    addr: 'owner',
  },
  {
    label: 'resume-and-wrap',
    owner: 'owner',
    addr: 'owner',
  },
  {
    label: 'other-registrant',
    owner: 'deployer',
    addr: 'deployer',
  },
]

export const setOriginalNonces = async (allNamedAccts: {
  [key: string]: string
}) => {
  const originalNonces: { [key: string]: number } = {}
  for (const { owner: ownerAddrName } of names) {
    if (!originalNonces[ownerAddrName]) {
      const registrant = allNamedAccts[ownerAddrName]
      // eslint-disable-next-line no-await-in-loop
      originalNonces[registrant] = await ethers.provider.getTransactionCount(
        registrant,
      )
    }
  }
  return originalNonces
}

export const getIndexForOwner = (label: string, owner: string, arr: any[]) =>
  arr.filter((x) => x.owner === owner).findIndex((x) => x.label === label)

const randomSecret = () => {
  return `0x${crypto.randomBytes(32).toString('hex')}`
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, network } = hre
  const allNamedAccts = await getNamedAccounts()

  const controller = await ethers.getContract('LegacyETHRegistrarController')
  const publicResolver = await ethers.getContract('LegacyPublicResolver')

  let originalNonces = await setOriginalNonces(allNamedAccts)

  const partialCommitments = await Promise.all(
    names.map(async (nameObj) => {
      const secret = randomSecret()
      const { label } = nameObj
      const registrant = allNamedAccts[nameObj.owner]
      const resolver = publicResolver.address
      const addr = allNamedAccts[nameObj.addr]
      const duration = 31536000
      const nonceDiff = getIndexForOwner(label, nameObj.owner, names)
      const nonce = originalNonces[registrant] + nonceDiff

      const commitment = await controller.makeCommitmentWithConfig(
        label,
        registrant,
        secret,
        resolver,
        addr,
      )

      const _controller = controller.connect(await ethers.getSigner(registrant))

      const commitTx = await _controller.commit(commitment, {
        nonce,
      })
      console.log(
        `Commiting commitment for ${label}.eth (tx: ${commitTx.hash})...`,
      )
      await commitTx.wait()

      return {
        label,
        registrant,
        duration,
        secret,
        resolver,
        addr,
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
        registrant,
        duration,
        secret,
        resolver,
        addr,
        nonceDiff,
      }) => {
        const nonce = originalNonces[registrant] + nonceDiff
        const price = await controller.rentPrice(label, duration)

        const _controller = controller.connect(
          await ethers.getSigner(registrant),
        )

        const registerTx = await _controller.registerWithConfig(
          label,
          registrant,
          duration,
          secret,
          resolver,
          addr,
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

func.id = 'register-unwrapped-names'
func.tags = ['register-unwrapped-names']
func.dependencies = ['LegacyETHRegistrarController']
func.runAtTheEnd = true

export default func
