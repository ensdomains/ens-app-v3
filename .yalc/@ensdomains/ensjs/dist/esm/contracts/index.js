export default class ContractManager {
    constructor(provider) {
        this.generateContractGetter = (path) => {
            let imported;
            let contract;
            return async (passedProvider, address) => {
                if (!imported) {
                    imported = (await import(
                    /* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true */
                    `./${path}`)).default;
                }
                if (passedProvider) {
                    return imported(passedProvider, address);
                }
                if (!contract) {
                    contract = imported(this.provider);
                }
                return contract;
            };
        };
        this.getPublicResolver = this.generateContractGetter('publicResolver');
        this.getUniversalResolver = this.generateContractGetter('universalResolver');
        this.getRegistry = this.generateContractGetter('registry');
        this.getReverseRegistrar = this.generateContractGetter('reverseRegistrar');
        this.getDNCOCURP = this.generateContractGetter('doNotCallOnChainUniversalResolverProxy');
        this.getNameWrapper = this.generateContractGetter('nameWrapper');
        this.getBaseRegistrar = this.generateContractGetter('baseRegistrar');
        this.getMulticall = this.generateContractGetter('multicall');
        this.provider = provider;
    }
}
