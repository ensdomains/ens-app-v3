import { config } from 'dotenv'
import { resolve } from 'path'
import {
  TransactionReceiptNotFoundError,
  createPublicClient,
  createTestClient,
  createWalletClient,
  http,
  type Account,
  type Address,
  type Hash,
  type PublicClient,
  type TestClient,
  type TransactionReceipt,
  type WalletClient,
} from 'viem'
import { localhost as _localhost } from 'viem/chains'

config({
  path: resolve(__dirname, '../../.env.local'),
  override: true,
})

type ContractName =
  | 'BaseRegistrarImplementation'
  | 'ETHRegistrarController'
  | 'Multicall'
  | 'NameWrapper'
  | 'DNSRegistrar'
  | 'PublicResolver'
  | 'ENSRegistry'
  | 'ReverseRegistrar'
  | 'UniversalResolver'
  | 'StaticBulkRenewal'
  | 'DNSSECImpl'
  | 'LegacyDNSRegistrar'
  | 'LegacyDNSSECImpl'

export const deploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES!
  // '{"LegacyENSRegistry":"0x5FbDB2315678afecb367f032d93F642f64180aa3","ENSRegistry":"0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0","RSASHA1Algorithm":"0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9","RSASHA256Algorithm":"0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9","P256SHA256Algorithm":"0x5FC8d32690cc91D4c39d9d3abcBD16989F875707","DummyAlgorithm":"0x0165878A594ca255338adfa4d48449f69242Eb8F","SHA1Digest":"0xa513E6E4b8f2a923D98304ec87F64353C4D5C853","SHA256Digest":"0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6","DummyDigest":"0x8A791620dd6260079BF849Dc5567aDC3F2FdC318","DNSSECImpl":"0x610178dA211FEF7D417bC0e6FeD39F05609AD788","OffchainDNSResolver":"0xc6e7DF5E7b4f2A278906862b61205850344D4e7d","Root":"0x59b670e9fA9D0A427751Af201D676719a970857b","TLDPublicSuffixList":"0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f","DNSRegistrar":"0x4A679253410272dd5232B3Ff7cF5dbB88f295319","BaseRegistrarImplementation":"0x7a2088a1bFc9d81c55368AE168C2C02570cB814F","DummyOracle":"0xc5a5C42992dECbae36851359345FE25997F5C42d","ExponentialPremiumPriceOracle":"0x67d269191c92Caf3cD7723F116c85e6E9bf55933","StaticMetadataService":"0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E","ReverseRegistrar":"0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690","NameWrapper":"0x9E545E3C0baAB3E08CdfD552C960A1050f373042","TestUnwrap":"0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8","LegacyPublicResolver":"0x851356ae760d987E095750cCeb3bC6014560891C","LegacyETHRegistrarController":"0xf5059a5D33d5853360D16C683c16e67980206f36","OwnedResolver":"0x70e0bA845a1A0F2DA3359C97E0285013525FFC49","ETHRegistrarController":"0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf","StaticBulkRenewal":"0x0E801D84Fa97b50751Dbf25036d067dCf18858bF","PublicResolver":"0x9d4454B023096f34B160D6B654540c56A1F81688","UniversalResolver":"0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00","Multicall":"0x36C02dA8a0983159322a80FFE9F24b1acfF8B570","LegacyDNSSECImpl":"0x809d550fca64d94Bd9F66E60752A544199cfAC3D","LegacyDNSRegistrar":"0x2bdCC0de6bE1f7D2ee689a0342D76F52E8EFABa3","NoMulticallResolver":"0x162A433068F51e18b7d13932F27e66a3f99E6890"}'
) as Record<
  ContractName | 'ENSRegistry' | 'LegacyPublicResolver' | 'NoMulticallResolver' | 'LegacyETHRegistrarController',
  Address
>

export const localhost = {
  ..._localhost,
  contracts: {
    ensRegistry: {
      address: deploymentAddresses.ENSRegistry,
    },
    ensUniversalResolver: {
      address: deploymentAddresses.UniversalResolver,
    },
    multicall3: {
      address: deploymentAddresses.Multicall,
    },
    ensBaseRegistrarImplementation: {
      address: deploymentAddresses.BaseRegistrarImplementation,
    },
    ensDnsRegistrar: {
      address: deploymentAddresses.LegacyDNSRegistrar,
    },
    ensEthRegistrarController: {
      address: deploymentAddresses.ETHRegistrarController,
    },
    ensLegacyEthRegistrarController: {
      address: deploymentAddresses.LegacyETHRegistrarController,
    },
    ensNameWrapper: {
      address: deploymentAddresses.NameWrapper,
    },
    ensPublicResolver: {
      address: deploymentAddresses.PublicResolver,
    },
    ensReverseRegistrar: {
      address: deploymentAddresses.ReverseRegistrar,
    },
    ensBulkRenewal: {
      address: deploymentAddresses.StaticBulkRenewal,
    },
    ensDnssecImpl: {
      address: deploymentAddresses.LegacyDNSSECImpl,
    },
    legacyPublicResolver: {
      address: deploymentAddresses.LegacyPublicResolver,
    },
    publicResolver: {
      address: deploymentAddresses.PublicResolver,
    },
  },
  subgraphs: {
    ens: {
      url: 'http://localhost:8000/subgraphs/name/graphprotocol/ens',
    },
  },
} as const

const transport = http('http://localhost:8545')

export const publicClient: PublicClient<typeof transport, typeof localhost> =
  createPublicClient({
    chain: localhost,
    transport,
  })

export const testClient: TestClient<
  'anvil',
  typeof transport,
  typeof localhost
> = createTestClient({
  chain: localhost,
  transport,
  mode: 'anvil',
})

export const walletClient: WalletClient<
  typeof transport,
  typeof localhost,
  Account
> = createWalletClient({
  chain: localhost,
  transport,
})

export const waitForTransaction = async (hash: Hash) =>
  new Promise<TransactionReceipt>((resolveFn, reject) => {
    publicClient
      .getTransactionReceipt({ hash })
      .then(resolveFn)
      .catch((e) => {
        if (e instanceof TransactionReceiptNotFoundError) {
          setTimeout(() => {
            waitForTransaction(hash).then(resolveFn)
          }, 100)
        } else {
          reject(e)
        }
      })
  })
