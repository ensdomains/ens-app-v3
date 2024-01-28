import { BaseError, decodeFunctionResult, encodeFunctionData, labelhash, } from 'viem';
import { baseRegistrarGracePeriodSnippet, baseRegistrarNameExpiresSnippet, } from '../../contracts/baseRegistrar.js';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { multicallGetCurrentBlockTimestampSnippet } from '../../contracts/multicall.js';
import { nameWrapperGetDataSnippet } from '../../contracts/nameWrapper.js';
import { generateFunction, } from '../../utils/generateFunction.js';
import { makeSafeSecondsDate } from '../../utils/makeSafeSecondsDate.js';
import { namehash } from '../../utils/normalise.js';
import { checkIsDotEth } from '../../utils/validation.js';
import multicallWrapper from './multicallWrapper.js';
const getContractToUse = (contract, labels) => {
    if (contract)
        return contract;
    if (checkIsDotEth(labels)) {
        return 'registrar';
    }
    return 'nameWrapper';
};
const encode = (client, { name, contract }) => {
    const labels = name.split('.');
    const contractToUse = getContractToUse(contract, labels);
    const calls = [
        {
            to: getChainContractAddress({ client, contract: 'multicall3' }),
            data: encodeFunctionData({
                abi: multicallGetCurrentBlockTimestampSnippet,
                functionName: 'getCurrentBlockTimestamp',
            }),
        },
    ];
    if (contractToUse === 'nameWrapper') {
        calls.push({
            to: getChainContractAddress({ client, contract: 'ensNameWrapper' }),
            data: encodeFunctionData({
                abi: nameWrapperGetDataSnippet,
                functionName: 'getData',
                args: [BigInt(namehash(labels.join('.')))],
            }),
        });
    }
    else {
        const baseRegistrarImplementationAddress = getChainContractAddress({
            client,
            contract: 'ensBaseRegistrarImplementation',
        });
        calls.push({
            to: baseRegistrarImplementationAddress,
            data: encodeFunctionData({
                abi: baseRegistrarNameExpiresSnippet,
                functionName: 'nameExpires',
                args: [BigInt(labelhash(labels[0]))],
            }),
        });
        calls.push({
            to: baseRegistrarImplementationAddress,
            data: encodeFunctionData({
                abi: baseRegistrarGracePeriodSnippet,
                functionName: 'GRACE_PERIOD',
            }),
        });
    }
    return multicallWrapper.encode(client, { transactions: calls });
};
const decode = async (client, data, { name, contract }) => {
    if (typeof data === 'object')
        throw data;
    const labels = name.split('.');
    const result = await multicallWrapper.decode(client, data, []);
    const blockTimestamp = decodeFunctionResult({
        abi: multicallGetCurrentBlockTimestampSnippet,
        functionName: 'getCurrentBlockTimestamp',
        data: result[0].returnData,
    });
    const contractToUse = getContractToUse(contract, labels);
    let expiry;
    let gracePeriod = 0n;
    if (contractToUse === 'nameWrapper') {
        ;
        [, , expiry] = decodeFunctionResult({
            abi: nameWrapperGetDataSnippet,
            functionName: 'getData',
            data: result[1].returnData,
        });
    }
    else {
        expiry = decodeFunctionResult({
            abi: baseRegistrarNameExpiresSnippet,
            functionName: 'nameExpires',
            data: result[1].returnData,
        });
        gracePeriod = decodeFunctionResult({
            abi: baseRegistrarGracePeriodSnippet,
            functionName: 'GRACE_PERIOD',
            data: result[2].returnData,
        });
    }
    if (expiry === 0n) {
        return null;
    }
    let status = 'active';
    if (blockTimestamp > expiry + gracePeriod) {
        status = 'expired';
    }
    else if (blockTimestamp > expiry) {
        status = 'gracePeriod';
    }
    return {
        expiry: {
            date: makeSafeSecondsDate(expiry),
            value: expiry,
        },
        gracePeriod: Number(gracePeriod),
        status,
    };
};
/**
 * Gets the expiry for a name
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetExpiryParameters}
 * @returns Expiry object, or `null` if no expiry. {@link GetExpiryReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getExpiry } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getExpiry(client, { name: 'ens.eth' })
 * // { expiry: { date: Date, value: 1913933217n }, gracePeriod: 7776000, status: 'active' }
 */
const getExpiry = generateFunction({ encode, decode });
export default getExpiry;
//# sourceMappingURL=getExpiry.js.map