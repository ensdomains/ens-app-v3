import { getChainContractAddress as _getChainContractAddress } from 'viem/utils';
export const getChainContractAddress = ({ blockNumber, client, contract, }) => _getChainContractAddress({
    blockNumber,
    chain: client.chain,
    contract: contract,
});
//# sourceMappingURL=getChainContractAddress.js.map