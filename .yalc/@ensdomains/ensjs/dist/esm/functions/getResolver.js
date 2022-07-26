import { ethers } from 'ethers';
import { hexEncodeName } from '../utils/hexEncodedName';
const raw = async ({ contracts }, name) => {
    const universalResolver = await contracts?.getUniversalResolver();
    return {
        to: universalResolver.address,
        data: universalResolver.interface.encodeFunctionData('findResolver', [
            hexEncodeName(name),
        ]),
    };
};
const decode = async ({ contracts }, data) => {
    const universalResolver = await contracts?.getUniversalResolver();
    const response = universalResolver.interface.decodeFunctionResult('findResolver', data);
    if (!response ||
        !response[0] ||
        ethers.utils.hexStripZeros(response[0]) === '0x') {
        return;
    }
    return response[0];
};
export default { raw, decode };
