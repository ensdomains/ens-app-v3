import { encodeFunctionData, } from 'viem';
import { sendTransaction } from 'viem/actions';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { nameWrapperUnwrapEth2ldSnippet, nameWrapperUnwrapSnippet, } from '../../contracts/nameWrapper.js';
import { AdditionalParameterSpecifiedError, RequiredParameterNotSpecifiedError, } from '../../errors/general.js';
import { getNameType } from '../../utils/getNameType.js';
import { makeLabelNodeAndParent } from '../../utils/makeLabelNodeAndParent.js';
export const makeFunctionData = (wallet, { name, newOwnerAddress, newRegistrantAddress, }) => {
    const { labelhash, parentNode } = makeLabelNodeAndParent(name);
    const nameWrapperAddress = getChainContractAddress({
        client: wallet,
        contract: 'ensNameWrapper',
    });
    const nameType = getNameType(name);
    if (nameType === 'eth-2ld') {
        if (!newRegistrantAddress)
            throw new RequiredParameterNotSpecifiedError({
                parameter: 'newRegistrantAddress',
                details: 'Must provide newRegistrantAddress for eth-2ld names',
            });
        return {
            to: nameWrapperAddress,
            data: encodeFunctionData({
                abi: nameWrapperUnwrapEth2ldSnippet,
                functionName: 'unwrapETH2LD',
                args: [labelhash, newRegistrantAddress, newOwnerAddress],
            }),
        };
    }
    if (newRegistrantAddress)
        throw new AdditionalParameterSpecifiedError({
            parameter: 'newRegistrantAddress',
            allowedParameters: ['name', 'newOwnerAddress'],
            details: 'newRegistrantAddress can only be specified for eth-2ld names',
        });
    return {
        to: nameWrapperAddress,
        data: encodeFunctionData({
            abi: nameWrapperUnwrapSnippet,
            functionName: 'unwrap',
            args: [parentNode, labelhash, newOwnerAddress],
        }),
    };
};
/**
 * Unwraps a name.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link UnwrapNameParameters}
 * @returns Transaction hash. {@link UnwrapNameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { unwrapName } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await unwrapName(wallet, {
 *   name: 'example.eth',
 *   newOwnerAddress: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *   newRegistrantAddress: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 * })
 * // 0x...
 */
async function unwrapName(wallet, { name, newOwnerAddress, newRegistrantAddress, ...txArgs }) {
    const data = makeFunctionData(wallet, {
        name,
        newOwnerAddress,
        newRegistrantAddress,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
unwrapName.makeFunctionData = makeFunctionData;
export default unwrapName;
//# sourceMappingURL=unwrapName.js.map