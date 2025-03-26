import { encodeFunctionData, } from 'viem';
import { sendTransaction } from 'viem/actions';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { nameWrapperSetSubnodeRecordSnippet } from '../../contracts/nameWrapper.js';
import { registrySetSubnodeRecordSnippet } from '../../contracts/registry.js';
import { InvalidContractTypeError, UnsupportedNameTypeError, } from '../../errors/general.js';
import { encodeFuses, ParentFuses, } from '../../utils/fuses.js';
import { getNameType } from '../../utils/getNameType.js';
import { makeLabelNodeAndParent } from '../../utils/makeLabelNodeAndParent.js';
import { expiryToBigInt, wrappedLabelLengthCheck, makeDefaultExpiry, } from '../../utils/wrapper.js';
import getWrapperData from '../public/getWrapperData.js';
import { BaseError } from '../../errors/base.js';
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
            const generatedExpiry = expiry
                ? expiryToBigInt(expiry)
                : makeDefaultExpiry(generatedFuses);
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
class CreateSubnamePermissionDeniedError extends BaseError {
    constructor({ parentName }) {
        super(`Create subname error: ${parentName} as burned CANNOT_CREATE_SUBDOMAIN fuse`);
        Object.defineProperty(this, "parentName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'CreateSubnamePermissionDeniedError'
        });
        this.parentName = parentName;
    }
}
class CreateSubnameParentNotLockedError extends BaseError {
    constructor({ parentName }) {
        super(`Create subname error: Cannot burn PARENT_CANNOT_CONTROL when ${parentName} has not burned CANNOT_UNWRAP fuse`);
        Object.defineProperty(this, "parentName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'CreateSubnameParentNotLockedError'
        });
        this.parentName = parentName;
    }
}
const checkCanCreateSubname = async (wallet, { name, fuses, contract, }) => {
    if (contract !== 'nameWrapper')
        return;
    const parentName = name.split('.').slice(1).join('.');
    if (parentName === 'eth')
        return;
    const parentWrapperData = await getWrapperData(wallet, { name: parentName });
    if (parentWrapperData?.fuses?.child?.CANNOT_CREATE_SUBDOMAIN)
        throw new CreateSubnamePermissionDeniedError({ parentName });
    const generatedFuses = fuses ? encodeFuses({ input: fuses }) : 0;
    const isBurningPCC = fuses && BigInt(generatedFuses) & ParentFuses.PARENT_CANNOT_CONTROL;
    const isParentCannotUnwrapBurned = parentWrapperData?.fuses?.child?.CANNOT_UNWRAP;
    if (isBurningPCC && !isParentCannotUnwrapBurned)
        throw new CreateSubnameParentNotLockedError({ parentName });
};
/**
 * Creates a subname
 * @param wallet - {@link ClientWithAccount}
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
    await checkCanCreateSubname(wallet, { name, fuses, contract });
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
    return sendTransaction(wallet, writeArgs);
}
createSubname.makeFunctionData = makeFunctionData;
export default createSubname;
//# sourceMappingURL=createSubname.js.map