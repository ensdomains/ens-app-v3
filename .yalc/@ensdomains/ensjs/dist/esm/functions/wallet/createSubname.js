import { encodeFunctionData, } from 'viem';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { nameWrapperSetSubnodeRecordSnippet } from '../../contracts/nameWrapper.js';
import { registrySetSubnodeRecordSnippet } from '../../contracts/registry.js';
import { InvalidContractTypeError, UnsupportedNameTypeError, } from '../../errors/general.js';
import { encodeFuses } from '../../utils/fuses.js';
import { getNameType } from '../../utils/getNameType.js';
import { makeLabelNodeAndParent } from '../../utils/makeLabelNodeAndParent.js';
import { MAX_EXPIRY, expiryToBigInt, wrappedLabelLengthCheck, } from '../../utils/wrapper.js';
export const makeFunctionData = (wallet, { name, contract, owner, resolverAddress = getChainContractAddress({
    client: wallet,
    contract: 'ensPublicResolver',
}), expiry, fuses, }) => {
    const nameType = getNameType(name);
    if (nameType === 'tld' || nameType === 'root')
        throw new UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: [
                'eth-2ld',
                'eth-subname',
                'other-2ld',
                'other-subname',
            ],
        });
    const { label, labelhash, parentNode } = makeLabelNodeAndParent(name);
    switch (contract) {
        case 'registry': {
            return {
                to: getChainContractAddress({
                    client: wallet,
                    contract: 'ensRegistry',
                }),
                data: encodeFunctionData({
                    abi: registrySetSubnodeRecordSnippet,
                    functionName: 'setSubnodeRecord',
                    args: [parentNode, labelhash, owner, resolverAddress, BigInt(0)],
                }),
            };
        }
        case 'nameWrapper': {
            wrappedLabelLengthCheck(label);
            const generatedFuses = fuses ? encodeFuses({ input: fuses }) : 0;
            const generatedExpiry = expiry ? expiryToBigInt(expiry) : MAX_EXPIRY;
            return {
                to: getChainContractAddress({
                    client: wallet,
                    contract: 'ensNameWrapper',
                }),
                data: encodeFunctionData({
                    abi: nameWrapperSetSubnodeRecordSnippet,
                    functionName: 'setSubnodeRecord',
                    args: [
                        parentNode,
                        label,
                        owner,
                        resolverAddress,
                        BigInt(0),
                        generatedFuses,
                        generatedExpiry,
                    ],
                }),
            };
        }
        default:
            throw new InvalidContractTypeError({
                contractType: contract,
                supportedContractTypes: ['registry', 'nameWrapper'],
            });
    }
};
/**
 * Creates a subname
 * @param wallet - {@link WalletWithEns}
 * @param parameters - {@link CreateSubnameParameters}
 * @returns Transaction hash. {@link CreateSubnameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { createSubname } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await createSubname(wallet, {
 *   name: 'sub.ens.eth',
 *   owner: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *   contract: 'registry',
 * })
 * // 0x...
 */
async function createSubname(wallet, { name, contract, owner, resolverAddress, expiry, fuses, ...txArgs }) {
    const data = makeFunctionData(wallet, {
        name,
        contract,
        owner,
        resolverAddress,
        expiry,
        fuses,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return wallet.sendTransaction(writeArgs);
}
createSubname.makeFunctionData = makeFunctionData;
export default createSubname;
//# sourceMappingURL=createSubname.js.map