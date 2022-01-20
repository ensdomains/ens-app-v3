/* eslint-disable max-classes-per-file */
declare module "@ensdomains/ui" {
  export function setupENS({
    customProvider,
    ensAddress,
    reloadOnAccountsChange,
    enforceReadOnly,
    enforceReload,
    infura,
  }?: {
    customProvider: any;
    ensAddress: any;
    reloadOnAccountsChange: any;
    enforceReadOnly: any;
    enforceReload: any;
    infura: any;
  }): Promise<{
    ens: ENS;
    registrar: import("@ensdomains/ui/registrar").default;
    provider: any;
    network: any;
    providerObject: any;
  }>;
  export * from "@ensdomains/ui/constants/interfaces";
  export * from "@ensdomains/ui/contracts";
  export * from "@ensdomains/ui/ens";
  export * from "@ensdomains/ui/registrar";
  export * from "@ensdomains/ui/utils";
  export * from "@ensdomains/ui/web3";
  export { ethers, utils } from "ethers";
  import { ENS } from "@ensdomains/ui/ens";
}

declare module "@ensdomains/ui/contracts" {
  export function getTestRegistrarContract({
    address,
    provider,
  }: {
    address: any;
    provider: any;
  }): Contract;
  export function getReverseRegistrarContract({
    address,
    provider,
  }: {
    address: any;
    provider: any;
  }): Contract;
  export function getENSContract({
    address,
    provider,
  }: {
    address: any;
    provider: any;
  }): Contract;
  export function getResolverContract({
    address,
    provider,
  }: {
    address: any;
    provider: any;
  }): Contract;
  export function getOldResolverContract({
    address,
    provider,
  }: {
    address: any;
    provider: any;
  }): Contract;
  export function getDnsRegistrarContract({
    parentOwner,
    provider,
  }: {
    parentOwner: any;
    provider: any;
  }): Contract;
  export function getOldDnsRegistrarContract({
    parentOwner,
    provider,
  }: {
    parentOwner: any;
    provider: any;
  }): Contract;
  export function getPermanentRegistrarContract({
    address,
    provider,
  }: {
    address: any;
    provider: any;
  }): Contract;
  export function getPermanentRegistrarControllerContract({
    address,
    provider,
  }: {
    address: any;
    provider: any;
  }): Contract;
  export function getLegacyAuctionContract({
    address,
    provider,
  }: {
    address: any;
    provider: any;
  }): Contract;
  export function getDeedContract({
    address,
    provider,
  }: {
    address: any;
    provider: any;
  }): Contract;
  export function getBulkRenewalContract({
    address,
    provider,
  }: {
    address: any;
    provider: any;
  }): Contract;
  import { Contract } from "ethers";
}
declare module "@ensdomains/ui/web3" {
  export function setupWeb3({
    customProvider,
    reloadOnAccountsChange,
    enforceReadOnly,
    enforceReload,
    infura,
  }: {
    customProvider: any;
    reloadOnAccountsChange?: boolean | undefined;
    enforceReadOnly?: boolean | undefined;
    enforceReload?: boolean | undefined;
    infura?: boolean | undefined;
  }): Promise<
    | {
        provider: any;
        signer: any;
      }
    | undefined
  >;
  export function getWeb3(): Promise<any>;
  export function getWeb3Read(): Promise<any>;
  export function isReadOnly(): boolean;
  export function getNetworkProviderUrl(
    id: any
  ):
    | "https://mainnet.infura.io/v3/90f210707d3c450f847659dc9a3436ea"
    | "https://ropsten.infura.io/v3/90f210707d3c450f847659dc9a3436ea"
    | "https://rinkeby.infura.io/v3/90f210707d3c450f847659dc9a3436ea"
    | "https://goerli.infura.io/v3/90f210707d3c450f847659dc9a3436ea";
  export function getProvider(): Promise<any>;
  export function getSigner(): Promise<any>;
  export function getAccount(): Promise<any>;
  export function getAccounts(): Promise<any>;
  export function getNetworkId(): Promise<any>;
  export function getNetwork(): Promise<any>;
  export function getBlock(number?: string): Promise<{
    number: any;
    timestamp: any;
  }>;
  export function getLegacyProvider(): any;
}
declare module "@ensdomains/ui/dnsregistrar" {
  export default DNSRegistrar;
  class DNSRegistrar {
    constructor(provider: any, oracleAddress: any, isOld?: boolean);
    provider: any;

    oracleAddress: any;

    isOld: boolean;

    OracleClass: typeof OldOracle | typeof NewOracle;
    /**
     * returns a claim object which allows you to claim
     * the ownership of a given name on ENS by submitting the proof
     * into DNSSEC oracle as well as claiming the name via the registrar
     * @param {string} name - name of the domain you want to claim
     */
    claim(name: string): Promise<Claim>;
  }
  import { Oracle as NewOracle } from "@ensdomains/dnssecoraclejs";
  import { Oracle as OldOracle } from "@ensdomains/dnssecoraclejs-017";

  class Claim {
    constructor({
      oracle,
      registrar,
      isFound,
      result,
      textDomain,
      encodedName,
    }: {
      oracle: any;
      registrar: any;
      isFound: any;
      result: any;
      textDomain: any;
      encodedName: any;
    });
    oracle: any;

    registrar: any;

    result: any;

    isFound: any;

    textDomain: any;

    encodedName: any;
    getProofData(): Promise<any>;
    /**
     * returns `Oracle <https://dnsprovejs.readthedocs.io/en/latest/libraries.html#oracle>`_ object
     */
    getOracle(): any;
    /**
     * returns `DnsResult <https://dnsprovejs.readthedocs.io/en/latest/libraries.html#dnsresult>`_ object
     */
    getResult(): any;
    /**
     * returns owner ETH address from the DNS record.
     */
    getOwner(): any;
  }
}
declare module "@ensdomains/ui/preimage" {
  export function decryptHashes(...hashes: any[]): Promise<any>;
}
declare module "@ensdomains/ui/utils/labelhash" {
  export function encodeLabelhash(hash: any): string;
  export function decodeLabelhash(hash: any): string;
  export function isEncodedLabelhash(hash: any): any;
  export function isDecrypted(name: any): any;
  export function labelhash(unnormalisedLabelOrLabelhash: any): string;
}
declare module "@ensdomains/ui/utils/contents" {
  export function decodeContenthash(encoded: any):
    | {
        protocolType?: undefined;
        decoded?: undefined;
        error?: undefined;
      }
    | {
        protocolType: null;
        decoded: any;
        error?: undefined;
      }
    | {
        protocolType: string | undefined;
        decoded: any;
        error: any;
      };
  export function validateContent(encoded: any): any;
  export function isValidContenthash(encoded: any): boolean | undefined;
  export function getProtocolType(encoded: any):
    | {
        protocolType: any;
        decoded: any;
      }
    | undefined;
  export function encodeContenthash(text: any): {
    encoded: boolean;
    error: string | undefined;
  };
}
declare module "@ensdomains/ui/utils/namehash" {
  export function namehash(inputName: any): string;
}
declare module "@ensdomains/ui/utils" {
  export function uniq(a: any, param: any): any;
  export const emptyAddress: "0x0000000000000000000000000000000000000000";
  export function getEtherScanAddr(): Promise<
    | "https://etherscan.io/"
    | "https://ropsten.etherscan.io/"
    | "https://rinkeby.etherscan.io/"
  >;
  export function getEnsStartBlock(): Promise<0 | 3327417 | 25409>;
  export function checkLabels(...labelHashes: any[]): null[];
  export function mergeLabels(labels1: any, labels2: any): any;
  export function validateName(name: any): any;
  export function parseSearchTerm(
    term: any,
    validTld: any
  ):
    | "invalid"
    | "short"
    | "supported"
    | "unsupported"
    | "address"
    | "tld"
    | "search";
  export function isLabelValid(name: any): boolean | undefined;
  import {
    decodeContenthash,
    encodeContenthash,
    getProtocolType,
    isValidContenthash,
  } from "@ensdomains/ui/utils/contents";
  import {
    decodeLabelhash,
    encodeLabelhash,
    isDecrypted,
    isEncodedLabelhash,
    labelhash,
  } from "@ensdomains/ui/utils/labelhash";
  import { namehash } from "@ensdomains/ui/utils/namehash";

  export {
    labelhash,
    isEncodedLabelhash,
    isDecrypted,
    decodeLabelhash,
    encodeLabelhash,
    namehash,
    encodeContenthash,
    decodeContenthash,
    isValidContenthash,
    getProtocolType,
  };
}
declare module "@ensdomains/ui/ens" {
  export function getNamehash(name: any): string;
  export class ENS {
    constructor({
      networkId,
      registryAddress,
      provider,
    }: {
      networkId: any;
      registryAddress: any;
      provider: any;
    });
    contracts: {
      1: {
        registry: string;
      };
      3: {
        registry: string;
      };
      4: {
        registry: string;
      };
      5: {
        registry: string;
      };
    };

    registryAddress: any;

    ENS: Contract;
    getENSContractInstance(): Contract;
    getOwner(name: any): Promise<any>;
    getResolver(name: any): Promise<any>;
    getTTL(name: any): Promise<any>;
    getResolverWithLabelhash(labelhash: any, nodehash: any): Promise<any>;
    getOwnerWithLabelHash(labelhash: any, nodeHash: any): Promise<any>;
    getEthAddressWithResolver(name: any, resolverAddr: any): Promise<any>;
    getAddress(name: any): Promise<any>;
    getAddr(name: any, key: any): Promise<string>;
    getAddrWithResolver(
      name: any,
      key: any,
      resolverAddr: any
    ): Promise<string>;
    getContent(name: any): Promise<
      | "0x0000000000000000000000000000000000000000"
      | {
          value: any;
          contentType: string;
        }
    >;
    getContentWithResolver(
      name: any,
      resolverAddr: any
    ): Promise<
      | "0x0000000000000000000000000000000000000000"
      | {
          value: any;
          contentType: string;
        }
    >;
    getText(name: any, key: any): Promise<any>;
    getTextWithResolver(name: any, key: any, resolverAddr: any): Promise<any>;
    getName(address: any): Promise<
      | {
          name: any;
        }
      | undefined
    >;
    getNameWithResolver(
      address: any,
      resolverAddr: any
    ): Promise<
      | {
          name: any;
        }
      | undefined
    >;
    isMigrated(name: any): Promise<any>;
    getResolverDetails(node: any): Promise<any>;
    getSubdomains(name: any): Promise<
      {
        label: any;
        labelhash: any;
        decrypted: boolean;
        node: any;
        name: string;
        owner: any;
      }[]
    >;
    getDomainDetails(name: any): Promise<any>;
    setOwner(name: any, newOwner: any): Promise<any>;
    setSubnodeOwner(name: any, newOwner: any): Promise<any>;
    setSubnodeRecord(name: any, newOwner: any, resolver: any): Promise<any>;
    setResolver(name: any, resolver: any): Promise<any>;
    setAddress(name: any, address: any): Promise<any>;
    setAddressWithResolver(
      name: any,
      address: any,
      resolverAddr: any
    ): Promise<any>;
    setAddr(name: any, key: any, address: any): Promise<any>;
    setAddrWithResolver(
      name: any,
      key: any,
      address: any,
      resolverAddr: any
    ): Promise<any>;
    setContent(name: any, content: any): Promise<any>;
    setContentWithResolver(
      name: any,
      content: any,
      resolverAddr: any
    ): Promise<any>;
    setContenthash(name: any, content: any): Promise<any>;
    setContenthashWithResolver(
      name: any,
      content: any,
      resolverAddr: any
    ): Promise<any>;
    setText(name: any, key: any, recordValue: any): Promise<any>;
    setTextWithResolver(
      name: any,
      key: any,
      recordValue: any,
      resolverAddr: any
    ): Promise<any>;
    createSubdomain(name: any): Promise<any>;
    deleteSubdomain(name: any): Promise<any>;
    claimAndSetReverseRecordName(name: any, overrides?: {}): Promise<any>;
    setReverseRecordName(name: any): Promise<any>;
    getENSEvent(
      event: any,
      {
        topics,
        fromBlock,
      }: {
        topics: any;
        fromBlock: any;
      }
    ): Promise<any>;
  }
}
declare module "@ensdomains/ui/constants/interfaces" {
  export namespace interfaces {
    const legacyRegistrar: string;
    const permanentRegistrar: string;
    const permanentRegistrarWithConfig: string;
    const baseRegistrar: string;
    const dnsRegistrar: string;
    const bulkRenewal: string;
    const dnssecClaimOld: string;
    const dnssecClaimNew: string;
  }
}
declare module "@ensdomains/ui/registrar" {
  export function setupRegistrar(registryAddress: any): Promise<Registrar>;
  export default class Registrar {
    constructor({
      registryAddress,
      ethAddress,
      legacyAuctionRegistrarAddress,
      controllerAddress,
      bulkRenewalAddress,
      provider,
    }: {
      registryAddress: any;
      ethAddress: any;
      legacyAuctionRegistrarAddress: any;
      controllerAddress: any;
      bulkRenewalAddress: any;
      provider: any;
    });
    permanentRegistrar: import("ethers").Contract;

    permanentRegistrarController: import("ethers").Contract;

    legacyAuctionRegistrar: import("ethers").Contract;

    registryAddress: any;

    bulkRenewal: import("ethers").Contract;

    ENS: import("ethers").Contract;

    getAddress(name: any): Promise<any>;
    getDeed(address: any): Promise<import("ethers").Contract>;
    getLegacyEntry(label: any): Promise<
      | {
          deedOwner: string;
          state: number;
          registrationDate: number;
          revealDate: number;
          value: number;
          highestBid: number;
          expiryTime?: undefined;
          error?: undefined;
        }
      | {
          deedOwner: string;
          state: number;
          registrationDate: number;
          revealDate: number;
          value: number;
          highestBid: number;
          expiryTime: number;
          error: any;
        }
    >;
    getPermanentEntry(label: any): Promise<
      | false
      | {
          available: null;
          nameExpires: null;
        }
    >;
    getEntry(label: any): Promise<
      | {
          currentBlockDate: Date;
          registrant: number;
          transferEndDate: null;
          isNewRegistrar: boolean;
          gracePeriodEndDate: null;
          deedOwner: string;
          state: number;
          registrationDate: number;
          revealDate: number;
          value: number;
          highestBid: number;
          expiryTime?: undefined;
          error?: undefined;
        }
      | {
          currentBlockDate: Date;
          registrant: number;
          transferEndDate: null;
          isNewRegistrar: boolean;
          gracePeriodEndDate: null;
          deedOwner: string;
          state: number;
          registrationDate: number;
          revealDate: number;
          value: number;
          highestBid: number;
          expiryTime: number;
          error: any;
        }
    >;
    getGracePeriod(Registrar: any): Promise<any>;
    gracePeriod: any;
    transferOwner(name: any, to: any, overrides?: {}): Promise<any>;
    reclaim(name: any, address: any, overrides?: {}): Promise<any>;
    getRentPrice(name: any, duration: any): Promise<any>;
    getRentPrices(labels: any, duration: any): Promise<any>;
    getMinimumCommitmentAge(): Promise<any>;
    getMaximumCommitmentAge(): Promise<any>;
    makeCommitment(name: any, owner: any, secret?: string): Promise<any>;
    checkCommitment(label: any, secret?: string): Promise<any>;
    commit(label: any, secret?: string): Promise<any>;
    register(label: any, duration: any, secret: any): Promise<any>;
    estimateGasLimit(cb: any): Promise<number>;
    renew(label: any, duration: any): Promise<any>;
    renewAll(labels: any, duration: any): Promise<any>;
    releaseDeed(label: any): Promise<any>;
    isDNSRegistrar(parentOwner: any): Promise<boolean>;
    selectDnsRegistrarContract({
      parentOwner,
      provider,
    }: {
      parentOwner: any;
      provider: any;
    }): Promise<{
      registrarContract: import("ethers").Contract;
      isOld: boolean;
    }>;
    getDNSEntry(
      name: any,
      parentOwner: any,
      owner: any
    ): Promise<{
      stateError: null;
    }>;
    submitProof(name: any, parentOwner: any): Promise<any>;
    registerTestdomain(label: any): Promise<any>;
    expiryTimes(label: any): Promise<Date | undefined>;
  }
}
declare module "@ensdomains/ui/utils/records" {
  export function validateRecord(record: any): any;
  export function getPlaceholder(
    recordType: any,
    contentType: any
  ):
    | ""
    | "Enter an Ethereum address"
    | "Enter a content hash (eg: ipfs://..., bzz://..., onion://..., onion3://..., sia://..., arweave://...)"
    | "Enter a content";
  export const EMPTY_ADDRESS: "0x0000000000000000000000000000000000000000";
}
