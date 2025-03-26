import { sendTransaction } from 'viem/actions';
import { encodeSetAddr } from '../../utils/encoders/encodeSetAddr.js';
import { namehash } from '../../utils/normalise.js';
export const makeFunctionData = (_wallet, { name, coin, value, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: encodeSetAddr({ namehash: namehash(name), coin, value }),
    };
};
/**
 * Sets an address record for a name on a resolver.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetAddressRecordParameters}
 * @returns Transaction hash. {@link SetAddressRecordReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setAddressRecord } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setAddressRecord(wallet, {
 *   name: 'ens.eth',
 *   coin: 'ETH',
 *   value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
async function setAddressRecord(wallet, { name, coin, value, resolverAddress, ...txArgs }) {
    const data = makeFunctionData(wallet, {
        name,
        coin,
        value,
        resolverAddress,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
setAddressRecord.makeFunctionData = makeFunctionData;
export default setAddressRecord;
//# sourceMappingURL=setAddressRecord.js.map