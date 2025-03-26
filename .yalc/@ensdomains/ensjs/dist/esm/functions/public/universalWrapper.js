import { BaseError, decodeFunctionResult, encodeFunctionData, labelhash, toBytes, toHex, } from 'viem';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { universalResolverResolveSnippet, universalResolverResolveWithGatewaysSnippet, } from '../../contracts/universalResolver.js';
import { checkSafeUniversalResolverData } from '../../utils/checkSafeUniversalResolverData.js';
import { generateFunction } from '../../utils/generateFunction.js';
import { packetToBytes } from '../../utils/hexEncodedName.js';
import { encodeLabelhash } from '../../utils/labels.js';
const encode = (client, { name, data, gatewayUrls }) => {
    const nameWithSizedLabels = name
        .split('.')
        .map((label) => {
        const labelLength = toBytes(label).byteLength;
        if (labelLength > 255) {
            return encodeLabelhash(labelhash(label));
        }
        return label;
    })
        .join('.');
    const to = getChainContractAddress({
        client,
        contract: 'ensUniversalResolver',
    });
    const args = [toHex(packetToBytes(nameWithSizedLabels)), data];
    return {
        to,
        ...(gatewayUrls?.length
            ? {
                data: encodeFunctionData({
                    abi: universalResolverResolveWithGatewaysSnippet,
                    functionName: 'resolveWithGateways',
                    args: [...args, gatewayUrls],
                }),
                passthrough: {
                    args: [...args, gatewayUrls],
                    address: to,
                },
            }
            : {
                data: encodeFunctionData({
                    abi: universalResolverResolveSnippet,
                    functionName: 'resolve',
                    args,
                }),
                passthrough: {
                    args,
                    address: to,
                },
            }),
    };
};
const decode = async (_client, data, passthrough, { strict, gatewayUrls, }) => {
    const isSafe = checkSafeUniversalResolverData(data, {
        strict,
        abi: gatewayUrls
            ? universalResolverResolveWithGatewaysSnippet
            : universalResolverResolveSnippet,
        args: passthrough.args,
        functionName: 'resolve',
        address: passthrough.address,
    });
    if (!isSafe)
        return null;
    try {
        const result = decodeFunctionResult({
            abi: universalResolverResolveSnippet,
            functionName: 'resolve',
            data,
        });
        return { data: result[0], resolver: result[1] };
    }
    catch (error) {
        if (strict)
            throw error;
        return null;
    }
};
const universalWrapper = generateFunction({ encode, decode });
export default universalWrapper;
//# sourceMappingURL=universalWrapper.js.map