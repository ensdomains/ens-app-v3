import { encodeAbiParameters, encodeFunctionData, labelhash, toHex, } from 'viem';
import { sendTransaction } from 'viem/actions';
import { parseAccount } from 'viem/utils';
import { baseRegistrarSafeTransferFromWithDataSnippet } from '../../contracts/baseRegistrar.js';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { nameWrapperWrapSnippet } from '../../contracts/nameWrapper.js';
import { AdditionalParameterSpecifiedError } from '../../errors/general.js';
import { encodeFuses, } from '../../utils/fuses.js';
import { packetToBytes } from '../../utils/hexEncodedName.js';
import { checkIsDotEth } from '../../utils/validation.js';
import { wrappedLabelLengthCheck } from '../../utils/wrapper.js';
export const makeFunctionData = (wallet, { name, newOwnerAddress, fuses, resolverAddress = getChainContractAddress({
    client: wallet,
    contract: 'ensPublicResolver',
}), }) => {
    const labels = name.split('.');
    const isEth2ld = checkIsDotEth(labels);
    const nameWrapperAddress = getChainContractAddress({
        client: wallet,
        contract: 'ensNameWrapper',
    });
    if (isEth2ld) {
        wrappedLabelLengthCheck(labels[0]);
        const encodedFuses = fuses
            ? encodeFuses({ restriction: 'child', input: fuses })
            : 0;
        const tokenId = BigInt(labelhash(labels[0]));
        const data = encodeAbiParameters([
            { name: 'label', type: 'string' },
            { name: 'wrappedOwner', type: 'address' },
            { name: 'ownerControlledFuses', type: 'uint16' },
            { name: 'resolverAddress', type: 'address' },
        ], [labels[0], newOwnerAddress, encodedFuses, resolverAddress]);
        return {
            to: getChainContractAddress({
                client: wallet,
                contract: 'ensBaseRegistrarImplementation',
            }),
            data: encodeFunctionData({
                abi: baseRegistrarSafeTransferFromWithDataSnippet,
                functionName: 'safeTransferFrom',
                args: [wallet.account.address, nameWrapperAddress, tokenId, data],
            }),
        };
    }
    if (fuses)
        throw new AdditionalParameterSpecifiedError({
            parameter: 'fuses',
            allowedParameters: ['name', 'wrappedOwner', 'resolverAddress'],
            details: 'Fuses cannot be initially set when wrapping non eth-2ld names',
        });
    labels.forEach((label) => wrappedLabelLengthCheck(label));
    return {
        to: nameWrapperAddress,
        data: encodeFunctionData({
            abi: nameWrapperWrapSnippet,
            functionName: 'wrap',
            args: [toHex(packetToBytes(name)), newOwnerAddress, resolverAddress],
        }),
    };
};
/**
 * Wraps a name.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link WrapNameParameters}
 * @returns Transaction hash. {@link WrapNameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { wrapName } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await wrapName(wallet, {
 *   name: 'ens.eth',
 *   newOwnerAddress: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 * })
 * // 0x...
 */
async function wrapName(wallet, { name, newOwnerAddress, fuses, resolverAddress, ...txArgs }) {
    const data = makeFunctionData({
        ...wallet,
        account: parseAccount((txArgs.account || wallet.account)),
    }, { name, newOwnerAddress, fuses, resolverAddress });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
wrapName.makeFunctionData = makeFunctionData;
export default wrapName;
//# sourceMappingURL=wrapName.js.map