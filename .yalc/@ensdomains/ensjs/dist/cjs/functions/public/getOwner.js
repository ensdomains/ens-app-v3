"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const consts_js_1 = require("../../utils/consts.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const normalise_js_1 = require("../../utils/normalise.js");
const ownerFromContract_js_1 = require("../../utils/ownerFromContract.js");
const validation_js_1 = require("../../utils/validation.js");
const multicallWrapper_js_1 = require("./multicallWrapper.js");
const encode = (client, { name, contract }) => {
    const namehash = (0, normalise_js_1.namehash)(name);
    const labels = name.split('.');
    if (contract || labels.length === 1) {
        return (0, ownerFromContract_js_1.ownerFromContract)({
            client,
            contract: contract || 'registry',
            namehash,
            labels,
        });
    }
    const registryData = (0, ownerFromContract_js_1.ownerFromContract)({
        client,
        contract: 'registry',
        namehash,
    });
    const nameWrapperData = (0, ownerFromContract_js_1.ownerFromContract)({
        client,
        contract: 'nameWrapper',
        namehash,
    });
    const data = [registryData, nameWrapperData];
    if ((0, validation_js_1.checkIsDotEth)(labels)) {
        data.push((0, ownerFromContract_js_1.ownerFromContract)({ client, contract: 'registrar', labels }));
    }
    return multicallWrapper_js_1.default.encode(client, { transactions: data });
};
const addressDecode = (data) => (0, viem_1.decodeAbiParameters)([{ type: 'address' }], data)[0];
const decode = async (client, data, { name, contract }) => {
    if (typeof data === 'object')
        throw data;
    const labels = name.split('.');
    if (contract || labels.length === 1) {
        const singleOwner = addressDecode(data);
        if (contract === 'registrar') {
            return {
                ownershipLevel: 'registrar',
                registrant: singleOwner,
            };
        }
        return {
            ownershipLevel: contract || 'registry',
            owner: singleOwner,
        };
    }
    const result = await multicallWrapper_js_1.default.decode(client, data, []);
    const [registryOwner, nameWrapperOwner, registrarOwner] = [
        result[0].returnData,
        result[1].returnData,
        result[2]?.returnData,
    ].map((ret) => (ret && ret !== '0x' ? addressDecode(ret) : undefined));
    const nameWrapperAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
        client,
        contract: 'ensNameWrapper',
    });
    if (labels[labels.length - 1] === 'eth') {
        if (registrarOwner === nameWrapperAddress) {
            return {
                owner: nameWrapperOwner,
                ownershipLevel: 'nameWrapper',
            };
        }
        if (registrarOwner) {
            return {
                registrant: registrarOwner,
                owner: registryOwner,
                ownershipLevel: 'registrar',
            };
        }
        if (registryOwner !== consts_js_1.EMPTY_ADDRESS) {
            if (labels.length === 2) {
                return {
                    registrant: null,
                    owner: registryOwner,
                    ownershipLevel: 'registrar',
                };
            }
            if (registryOwner === nameWrapperAddress &&
                nameWrapperOwner &&
                nameWrapperOwner !== consts_js_1.EMPTY_ADDRESS) {
                return {
                    owner: nameWrapperOwner,
                    ownershipLevel: 'nameWrapper',
                };
            }
            return {
                owner: registryOwner,
                ownershipLevel: 'registry',
            };
        }
        return null;
    }
    if (registryOwner === nameWrapperAddress &&
        nameWrapperOwner &&
        nameWrapperOwner !== consts_js_1.EMPTY_ADDRESS) {
        return {
            owner: nameWrapperOwner,
            ownershipLevel: 'nameWrapper',
        };
    }
    if (registryOwner && registryOwner !== consts_js_1.EMPTY_ADDRESS) {
        return {
            owner: registryOwner,
            ownershipLevel: 'registry',
        };
    }
    return null;
};
const getOwner = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = getOwner;
//# sourceMappingURL=getOwner.js.map