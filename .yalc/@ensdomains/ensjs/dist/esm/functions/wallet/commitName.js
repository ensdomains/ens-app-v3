import { encodeFunctionData, } from 'viem';
import { sendTransaction } from 'viem/actions';
import { ethRegistrarControllerCommitSnippet } from '../../contracts/ethRegistrarController.js';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { UnsupportedNameTypeError } from '../../errors/general.js';
import { getNameType } from '../../utils/getNameType.js';
import { makeCommitment, } from '../../utils/registerHelpers.js';
import { wrappedLabelLengthCheck } from '../../utils/wrapper.js';
export const makeFunctionData = (wallet, args) => {
    const labels = args.name.split('.');
    const nameType = getNameType(args.name);
    if (nameType !== 'eth-2ld')
        throw new UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: ['eth-2ld'],
            details: 'Only 2ld-eth name registration is supported',
        });
    wrappedLabelLengthCheck(labels[0]);
    return {
        to: getChainContractAddress({
            client: wallet,
            contract: 'ensEthRegistrarController',
        }),
        data: encodeFunctionData({
            abi: ethRegistrarControllerCommitSnippet,
            functionName: 'commit',
            args: [makeCommitment(args)],
        }),
    };
};
/**
 * Commits a name to be registered
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link CommitNameParameters}
 * @returns Transaction hash. {@link CommitNameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { commitName } from '@ensdomains/ensjs/wallet'
 * import { randomSecret } from '@ensdomains/ensjs/utils'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const secret = randomSecret()
 * const hash = await commitName(wallet, {
 *   name: 'example.eth',
 *   owner: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *   duration: 31536000, // 1 year
 *   secret,
 * })
 * // 0x...
 */
async function commitName(wallet, { name, owner, duration, secret, resolverAddress, records, reverseRecord, fuses, ...txArgs }) {
    const data = makeFunctionData(wallet, {
        name,
        owner,
        duration,
        secret,
        resolverAddress,
        records,
        reverseRecord,
        fuses,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
commitName.makeFunctionData = makeFunctionData;
export default commitName;
//# sourceMappingURL=commitName.js.map