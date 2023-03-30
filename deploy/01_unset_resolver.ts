/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { emptyAddress } from '../src/utils/constants'

const names: {
  name: string
  namedOwner: string
  contract: 'registry' | 'nameWrapper'
}[] = [
  {
    name: 'without-resolver.eth',
    namedOwner: 'owner',
    contract: 'registry',
  },
  {
    name: 'sub.without-resolver.eth',
    namedOwner: 'deployer',
    contract: 'registry',
  },
  {
    name: 'wrapped-without-resolver.eth',
    namedOwner: 'owner',
    contract: 'nameWrapper',
  },
  {
    name: 'sub.wrapped-without-resolver.eth',
    namedOwner: 'deployer',
    contract: 'nameWrapper',
  },
]

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre
  const namedAccounts = await getNamedAccounts()

  const wrapper = await ethers.getContract('NameWrapper')
  const registry = await ethers.getContract('ENSRegistry')

  for (const { name, namedOwner, contract: _contract } of names) {
    const contract = _contract === 'nameWrapper' ? wrapper : registry
    const signedContract = contract.connect(await ethers.getSigner(namedAccounts[namedOwner]))
    const tx = await signedContract.setResolver(namehash(name), emptyAddress)
    await tx.wait()
    console.log(` - ${name} (tx: ${tx.hash})...`)
  }
  return true
}

func.id = 'unset_resolvers'
func.dependencies = ['register-wrapped-names', 'register-unwrapped-names']
func.runAtTheEnd = true

export default func
