import {
  decodeFunctionData,
  encodeFunctionResult,
  isAddressEqual,
  parseAbi,
  ccipRequest as viemCcipRequest,
  type CcipRequestParameters,
  type Chain,
} from 'viem'
import { getChainContractAddress } from '../contracts/getChainContractAddress.js'
import { ccipBatchRequest } from './ccipBatchRequest.js'

const abi = parseAbi([
  'function query((address,string[],bytes)[]) returns (bool[],bytes[])',
])

const universalResolverQuerySig = '0xa780bab6'

export const ccipRequest =
  <TChain extends Chain>(chain: TChain) =>
  async ({
    data,
    sender,
    urls,
  }: CcipRequestParameters): ReturnType<typeof viemCcipRequest> => {
    const universalResolverAddress = getChainContractAddress({
      client: { chain },
      contract: 'ensUniversalResolver',
    })
    const isUniversalResolverRequest = isAddressEqual(
      sender,
      universalResolverAddress,
    )
    if (
      isUniversalResolverRequest &&
      data.slice(0, 10) === universalResolverQuerySig
    ) {
      const { args } = decodeFunctionData({ abi, data })
      const result = await ccipBatchRequest(args[0])
      return encodeFunctionResult({ abi, result })
    }

    return viemCcipRequest({ data, sender, urls })
  }
