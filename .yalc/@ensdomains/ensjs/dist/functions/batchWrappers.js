import { hexEncodeName } from '../utils/hexEncodedName';
export const universalWrapper = {
    raw: async ({ contracts }, name, data) => {
        const universalResolver = await contracts?.getUniversalResolver();
        return {
            to: universalResolver.address,
            data: universalResolver.interface.encodeFunctionData('resolve(bytes,bytes)', [hexEncodeName(name), data]),
        };
    },
    decode: async ({ contracts }, data) => {
        const universalResolver = await contracts?.getUniversalResolver();
        const response = universalResolver.interface.decodeFunctionResult('resolve(bytes,bytes)', data);
        if (!response || !response[0]) {
            return null;
        }
        return { data: response[0], resolver: response[1] };
    },
};
export const resolverMulticallWrapper = {
    raw: async ({ contracts }, data) => {
        const publicResolver = await contracts?.getPublicResolver();
        const formattedDataArr = data.map((item) => item.data);
        return {
            to: publicResolver.address,
            data: publicResolver.interface.encodeFunctionData('multicall(bytes[])', [
                formattedDataArr,
            ]),
        };
    },
    decode: async ({ contracts }, data) => {
        const publicResolver = await contracts?.getPublicResolver();
        const response = publicResolver.interface.decodeFunctionResult('multicall(bytes[])', data);
        if (!response) {
            return null;
        }
        return response;
    },
};
