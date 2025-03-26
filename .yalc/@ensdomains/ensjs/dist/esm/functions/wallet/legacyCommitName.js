import { encodeFunctionData, } from 'viem';
import { sendTransaction } from 'viem/actions';
import { legacyEthRegistrarControllerCommitSnippet } from '../../contracts/legacyEthRegistrarController.js';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { UnsupportedNameTypeError } from '../../errors/general.js';
import { getNameType } from '../../utils/getNameType.js';
import { makeLegacyCommitment, } from '../../utils/legacyRegisterHelpers.js';
import { EMPTY_ADDRESS } from '../../utils/consts.js';
export const makeFunctionData = (wallet, args) => {
    const nameType = getNameType(args.name);
    if (nameType !== 'eth-2ld')
        throw new UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: ['eth-2ld'],
            details: 'Only 2ld-eth name registration is supported',
        });
    return {
        to: getChainContractAddress({
            client: wallet,
            contract: 'legacyEthRegistrarController',
        }),
        data: encodeFunctionData({
            abi: legacyEthRegistrarControllerCommitSnippet,
            functionName: 'commit',
            args: [makeLegacyCommitment(args)],
        }),
    };
};
/**
 * Commits a name to be registered
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link LegacyCommitNameParameters}
 * @returns Transaction hash. {@link LegacyCommitNameReturnType}
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
async function legacyCommitName(wallet, { name, owner, duration, secret, resolverAddress = EMPTY_ADDRESS, address = EMPTY_ADDRESS, ...txArgs }) {
    const data = makeFunctionData(wallet, {
        name,
        owner,
        duration,
        secret,
        resolverAddress,
        address,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
legacyCommitName.makeFunctionData = makeFunctionData;
export default legacyCommitName;
//# sourceMappingURL=legacyCommitName.js.map