"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRegistrar_1 = __importDefault(require("./baseRegistrar"));
const ethRegistrarController_1 = __importDefault(require("./ethRegistrarController"));
const multicall_1 = __importDefault(require("./multicall"));
const nameWrapper_1 = __importDefault(require("./nameWrapper"));
const publicResolver_1 = __importDefault(require("./publicResolver"));
const registry_1 = __importDefault(require("./registry"));
const reverseRegistrar_1 = __importDefault(require("./reverseRegistrar"));
const universalResolver_1 = __importDefault(require("./universalResolver"));
const bulkRenewal_1 = __importDefault(require("./bulkRenewal"));
const ETH_NAMEHASH = '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae';
class ContractManager {
    provider;
    fetchAddress;
    constructor(provider, fetchAddress) {
        this.provider = provider;
        this.fetchAddress = fetchAddress;
    }
    generateContractGetter = (name, func) => {
        return async (passedProvider, address) => {
            const inputAddress = address || this.fetchAddress(name);
            const provider = passedProvider || this.provider;
            return func(provider, inputAddress);
        };
    };
    getPublicResolver = this.generateContractGetter('PublicResolver', publicResolver_1.default);
    getUniversalResolver = this.generateContractGetter('UniversalResolver', universalResolver_1.default);
    getRegistry = this.generateContractGetter('ENSRegistryWithFallback', registry_1.default);
    getReverseRegistrar = this.generateContractGetter('ReverseRegistrar', reverseRegistrar_1.default);
    getNameWrapper = this.generateContractGetter('NameWrapper', nameWrapper_1.default);
    getBaseRegistrar = this.generateContractGetter('BaseRegistrarImplementation', baseRegistrar_1.default);
    getEthRegistrarController = this.generateContractGetter('ETHRegistrarController', ethRegistrarController_1.default);
    getMulticall = this.generateContractGetter('Multicall', multicall_1.default);
    getBulkRenewal = async () => {
        const resolver = await this.getPublicResolver();
        const address = await resolver.interfaceImplementer(ETH_NAMEHASH, '0x3150bfba');
        return await (this.generateContractGetter('BulkRenewal', (0, bulkRenewal_1.default)(address))());
    };
}
exports.default = ContractManager;
