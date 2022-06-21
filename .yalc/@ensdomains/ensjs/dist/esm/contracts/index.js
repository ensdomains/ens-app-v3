export default class ContractManager {
    constructor(provider, fetchAddress) {
        this.generateContractGetter = (path, name) => {
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
                    contract = imported(this.provider, this.fetchAddress(name));
                }
                return contract;
            };
        };
        this.getPublicResolver = this.generateContractGetter('publicResolver', 'PublicResolver');
        this.getUniversalResolver = this.generateContractGetter('universalResolver', 'UniversalResolver');
        this.getRegistry = this.generateContractGetter('registry', 'ENSRegistryWithFallback');
        this.getReverseRegistrar = this.generateContractGetter('reverseRegistrar', 'ReverseRegistrar');
        this.getNameWrapper = this.generateContractGetter('nameWrapper', 'NameWrapper');
        this.getBaseRegistrar = this.generateContractGetter('baseRegistrar', 'BaseRegistrarImplementation');
        this.getMulticall = this.generateContractGetter('multicall', 'Multicall');
        this.provider = provider;
        this.fetchAddress = fetchAddress;
    }
}
