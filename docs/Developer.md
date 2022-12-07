# Developer.md

## Prerequesites for FrontEnd Development

* [Docker](https://docs.docker.com/desktop/install/mac-install/)

## Quickstart

[Here](https://youtu.be/PObyJV0pWkw) is a video giving an overview for frontend developers to run a local environment using docker.

Open two terminal windows.

Start Docker (ganache, ens-subgraph, ens-contracts, ens-metadata-service)
```
pnpm docker
```

Start the Frontend

```
pnpm buildandstart:glocal
```

## Prerequisites for ENS End to End Local Development

If developing all ENS Components locally you will require the following.

*Below are links to relevant documentation.* 


### Ganache

* [ganache npm package](https://www.npmjs.com/package/ganache)

### Graph

- https://github.com/ensdomains/ens-subgraph
- [Getting Started](https://github.com/graphprotocol/graph-node/blob/master/docs/getting-started.md)

#### IPFS
- [Install IPFS](https://docs.ipfs.tech/install/)
    - [Desktop](https://github.com/ipfs/ipfs-desktop/releases)
    - [Command Line](https://docs.ipfs.tech/install/command-line/#macos)

#### Postgres

- [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
    
```bash
    # Install Postgress
    brew install postgresql@14
    which postgres
    
```

#### ENS Subgraph

* [ens-subgraph](https://github.com/harmony-domains/ens-subgraph)
```
git clone https://github.com/harmony-domains/ens-subgraph
cd ens-subgraph
nvm use v14.17.0
yarn codegen
```

### Metadata Service

```
git clone https://github.com/harmony-domains/ens-metadata-service.git
cd ens-metadata-service
cp .env.example .env // Fill in Vars
yarn
yarn dev
```




## Local Development Configuration
The main configuration settings are 

1. Configuring the frontend to use Ganache and Subgraph, this is done in your [.env](../.env) file, you can see [.env.example](../.env.example) for sample configuration
```
NEXT_PUBLIC_PROVIDER=http://127.0.0.1:8545
NEXT_PUBLIC_GRAPH_URI=http://localhost:8000/subgraphs/name/graphprotocol/ens 
```

2. Configuring your deployed contract is done in [.env.local](../.env.local). This is done automatically when running  `npx hardhat deploy --network localhost` or you can set manually if you are using the [ens-deployer](https://github.com/harmony-domains/ens-deployer). It is set as follows

```JSON
NEXT_PUBLIC_DEPLOYMENT_ADDRESSES='{"LegacyENSRegistry":"0x5FbDB2315678afecb367f032d93F642f64180aa3","ENSRegistry":"0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0","RSASHA1Algorithm":"0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9","RSASHA256Algorithm":"0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9","P256SHA256Algorithm":"0x5FC8d32690cc91D4c39d9d3abcBD16989F875707","DummyAlgorithm":"0x0165878A594ca255338adfa4d48449f69242Eb8F","SHA1Digest":"0xa513E6E4b8f2a923D98304ec87F64353C4D5C853","SHA256Digest":"0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6","DummyDigest":"0x8A791620dd6260079BF849Dc5567aDC3F2FdC318","DNSSECImpl":"0x610178dA211FEF7D417bC0e6FeD39F05609AD788","TLDPublicSuffixList":"0xc6e7DF5E7b4f2A278906862b61205850344D4e7d","DNSRegistrar":"0x59b670e9fA9D0A427751Af201D676719a970857b","Root":"0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1","BaseRegistrarImplementation":"0x4A679253410272dd5232B3Ff7cF5dbB88f295319","DummyOracle":"0x09635F643e140090A9A8Dcd712eD6285858ceBef","ExponentialPremiumPriceOracle":"0xc5a5C42992dECbae36851359345FE25997F5C42d","StaticMetadataService":"0x67d269191c92Caf3cD7723F116c85e6E9bf55933","NameWrapper":"0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E","LegacyPublicResolver":"0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB","ReverseRegistrar":"0x9E545E3C0baAB3E08CdfD552C960A1050f373042","LegacyETHRegistrarController":"0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8","ETHRegistrarController":"0x851356ae760d987E095750cCeb3bC6014560891C","PublicResolver":"0x95401dc811bb5740090279Ba06cfA8fcF6113778","UniversalResolver":"0x998abeb3E57409262aE5b751f60747921B33613E","BulkRenewal":"0x70e0bA845a1A0F2DA3359C97E0285013525FFC49","Multicall":"0x4826533B4897376654Bb4d4AD88B7faFD0C98528","resolverMulticallWrapper":"0x95401dc811bb5740090279Ba06cfA8fcF6113778"}'
```

## Local Development Environment

Following is a sample script to run each of the components

It is asumed that all the repositories are located in a parent folder ( e.g `~/ens`)

```
# Start Hardhat Locally (terminal window 1)
cd ./ens-deployer/env
./ganache-new.sh

# Deploy Contracts from ens-app-v3
cd ./ens-app-v3
yarn deploy:local

# Optional if you prefer to deploy via ens-deployer
cd ./ens-deployer/contract
yarn deploy --network local
# Update .env.local with NEXT_PUBLIC_DEPLOYMENT_ADDRESSES generated above
# Update ens-subgraph/subraph.yaml ENSRegistry, Resolver, BaseRegistrarImplementation, EthRegistrarController, NameWrapper with NEXT_PUBLIC_DEPLOYMENT_ADDRESSES
# Update ens-metadata-service/.env  ADDRESS_ETH_REGISTRAR, ADDRESS_NAME_WRAPPER with NEXT_PUBLIC_DEPLOYMENT_ADDRESSES

# Start IPFS (terminal window 2)
cd ./ipfs
ipfs daemon

# Start the postgres db (terminal window 3)
cd ./postgres
pg_ctl -D .postgres -l logfile stop
cd ..
rm -rf postgres
mkdir postgres
cd postgres
initdb -D .postgres
pg_ctl -D .postgres -l logfile start
createdb graph-node

# Start Graph Node (terminal window 4)
cd ./graph-node
cargo run -p graph-node --release -- /
  --postgres-url postgresql://<<username>>:<<password>>@localhost:5432/graph-node /
  --ethereum-rpc mainnet:http://127.0.0.1:8545  /
 --ipfs 127.0.0.1:5001

# Load ens-subgraph (terminal window 5)
cd ./ens-subgraph
nvm use v14.17.0
yarn setup

# Start metadata-service
cd ./ens-metadata-service
yarn dev
# If you are not making code changes you can use
yarn build
yarn start

# Start the Frontend (separate terminal window 6)
cd ./ens-app-v3
pnpm dev
```

