import { ethers } from 'ethers'
import generateFuseInput from '../utils/generateFuseInput'
export default async function ({ contracts, provider }, name, fusesToBurn) {
  const signer = provider?.getSigner()
  if (!signer) {
    throw new Error('No signer found')
  }
  const nameWrapper = (await contracts?.getNameWrapper()).connect(signer)
  const namehash = ethers.utils.namehash(name)
  const encodedFuses = generateFuseInput(fusesToBurn)
  return nameWrapper.burnFuses(namehash, encodedFuses)
}
