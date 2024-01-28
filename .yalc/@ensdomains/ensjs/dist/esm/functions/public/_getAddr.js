import { decodeFunctionResult, encodeFunctionData, hexToBytes, trim, } from 'viem';
import { namehash } from '../../utils/normalise.js';
import { publicResolverMultiAddrSnippet, publicResolverSingleAddrSnippet, } from '../../contracts/publicResolver.js';
import { EMPTY_ADDRESS } from '../../utils/consts.js';
import { generateFunction } from '../../utils/generateFunction.js';
import { getCoderFromCoin } from '../../utils/normaliseCoinId.js';
const encode = (_client, { name, coin = 60, bypassFormat }) => {
    const coder = getCoderFromCoin(coin);
    if (coder.coinType === 60) {
        return {
            to: EMPTY_ADDRESS,
            data: encodeFunctionData({
                abi: publicResolverSingleAddrSnippet,
                functionName: 'addr',
                args: [namehash(name)],
            }),
        };
    }
    if (bypassFormat) {
        return {
            to: EMPTY_ADDRESS,
            data: encodeFunctionData({
                abi: publicResolverMultiAddrSnippet,
                functionName: 'addr',
                args: [namehash(name), BigInt(coin)],
            }),
        };
    }
    return {
        to: EMPTY_ADDRESS,
        data: encodeFunctionData({
            abi: publicResolverMultiAddrSnippet,
            functionName: 'addr',
            args: [namehash(name), BigInt(coder.coinType)],
        }),
    };
};
const decode = async (_client, data, { coin = 60, strict }) => {
    if (data === '0x')
        return null;
    const coder = getCoderFromCoin(coin);
    let response;
    try {
        if (coder.coinType === 60) {
            response = decodeFunctionResult({
                abi: publicResolverSingleAddrSnippet,
                functionName: 'addr',
                data,
            });
        }
        else {
            response = decodeFunctionResult({
                abi: publicResolverMultiAddrSnippet,
                functionName: 'addr',
                data,
            });
        }
        if (!response)
            return null;
        const trimmed = trim(response);
        if (trimmed === '0x' || trimmed === '0x0' || trimmed === '0x00') {
            return null;
        }
        const decodedAddr = coder.encode(hexToBytes(response));
        if (!decodedAddr) {
            return null;
        }
        return { id: coder.coinType, name: coder.name, value: decodedAddr };
    }
    catch (error) {
        if (strict)
            throw error;
        return null;
    }
};
const _getAddr = generateFunction({ encode, decode });
export default _getAddr;
//# sourceMappingURL=_getAddr.js.map