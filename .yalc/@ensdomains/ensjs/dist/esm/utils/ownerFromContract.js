import { encodeFunctionData, labelhash } from 'viem';
import { baseRegistrarOwnerOfSnippet } from '../contracts/baseRegistrar.js';
import { getChainContractAddress } from '../contracts/getChainContractAddress.js';
import { nameWrapperOwnerOfSnippet } from '../contracts/nameWrapper.js';
import { registryOwnerSnippet } from '../contracts/registry.js';
import { InvalidContractTypeError } from '../errors/general.js';
export const ownerFromContract = ({ client, contract, namehash, labels, }) => {
    switch (contract) {
        case 'nameWrapper':
            return {
                to: getChainContractAddress({ client, contract: 'ensNameWrapper' }),
                data: encodeFunctionData({
                    abi: nameWrapperOwnerOfSnippet,
                    functionName: 'ownerOf',
                    args: [BigInt(namehash)],
                }),
            };
        case 'registry':
            return {
                to: getChainContractAddress({ client, contract: 'ensRegistry' }),
                data: encodeFunctionData({
                    abi: registryOwnerSnippet,
                    functionName: 'owner',
                    args: [namehash],
                }),
            };
        case 'registrar':
            return {
                to: getChainContractAddress({
                    client,
                    contract: 'ensBaseRegistrarImplementation',
                }),
                data: encodeFunctionData({
                    abi: baseRegistrarOwnerOfSnippet,
                    functionName: 'ownerOf',
                    args: [BigInt(labelhash(labels[0]))],
                }),
            };
        default:
            throw new InvalidContractTypeError({
                contractType: contract,
                supportedContractTypes: ['nameWrapper', 'registry', 'registrar'],
            });
    }
};
//# sourceMappingURL=ownerFromContract.js.map