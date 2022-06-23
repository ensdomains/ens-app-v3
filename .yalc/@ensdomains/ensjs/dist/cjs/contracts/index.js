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
}
exports.default = ContractManager;
