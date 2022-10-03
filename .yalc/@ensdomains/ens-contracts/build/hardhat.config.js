"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-waffle");
const child_process_1 = require("child_process");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = require("fs");
const promises_1 = __importDefault(require("fs/promises"));
require("hardhat-abi-exporter");
require("hardhat-deploy");
require("hardhat-gas-reporter");
const config_1 = require("hardhat/config");
const util_1 = require("util");
const exec = (0, util_1.promisify)(child_process_1.exec);
const archivedDeploymentPath = './deployments/archive';
// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
dotenv_1.default.config({ debug: false });
(0, config_1.task)('accounts', 'Prints the list of accounts', async (_, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
});
(0, config_1.task)('archive-scan', 'Scans the deployments for unarchived deployments').setAction(async (_, hre) => {
    const network = hre.network.name;
    const deployments = await hre.deployments.all();
    for (const deploymentName in deployments) {
        const deployment = deployments[deploymentName];
        if (!deployment.receipt || !deployment.bytecode)
            continue;
        const archiveName = `${deploymentName}_${network}_${deployment.receipt.blockNumber}`;
        const archivePath = `${archivedDeploymentPath}/${archiveName}.sol`;
        if ((0, fs_1.existsSync)(archivePath)) {
            continue;
        }
        let fullName;
        try {
            await hre.deployments.getArtifact(deploymentName);
            fullName = `${deploymentName}.sol:${deploymentName}`;
        }
        catch (e) {
            if (e._isHardhatError && e.number === 701) {
                fullName = e.messageArguments.candidates.split('\n')[1];
            }
            else {
                throw e;
            }
        }
        await hre.run('save', {
            contract: deploymentName,
            block: String(deployment.receipt.blockNumber),
            fullName,
        });
    }
});
(0, config_1.task)('save', 'Saves a specified contract as a deployed contract')
    .addPositionalParam('contract', 'The contract to save')
    .addPositionalParam('block', 'The block number the contract was deployed at')
    .addOptionalParam('fullName', '(Optional) The fully qualified name of the contract (e.g. contracts/resolvers/PublicResolver.sol:PublicResolver)')
    .setAction(async ({ contract, block, fullName, }, hre) => {
    const network = hre.network.name;
    const artifactReference = fullName || contract;
    const artifact = await hre.deployments.getArtifact(artifactReference);
    const archiveName = `${contract}_${network}_${block}`;
    const archivePath = `${archivedDeploymentPath}/${archiveName}.sol`;
    if ((0, fs_1.existsSync)(archivePath)) {
        throw new Error('Archive already exists');
    }
    const newArtifact = {
        ...artifact,
        contractName: archiveName,
        sourceName: archivePath.substring(2),
        commitHash: (await exec('git rev-parse HEAD')).stdout.trim(),
        treeHash: (await exec(`git rev-parse HEAD:${artifact.sourceName}`)).stdout.trim(),
    };
    await promises_1.default.mkdir(archivePath);
    await promises_1.default.writeFile(`${archivePath}/${archiveName}.json`, JSON.stringify(newArtifact, null, 2));
    console.log("Archived contract to '" + archivePath + "'");
});
let real_accounts = undefined;
if (process.env.DEPLOYER_KEY) {
    real_accounts = [process.env.DEPLOYER_KEY, process.env.OWNER_KEY || process.env.DEPLOYER_KEY];
}
const config = {
    networks: {
        hardhat: {
            saveDeployments: false,
            tags: ['test', 'legacy', 'use_root'],
        },
        localhost: {
            url: 'http://127.0.0.1:8545',
            saveDeployments: false,
            tags: ['test', 'legacy', 'use_root'],
        },
        ropsten: {
            url: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`,
            tags: ['test', 'legacy', 'use_root'],
            chainId: 3,
            accounts: real_accounts,
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
            tags: ['test', 'legacy', 'use_root'],
            chainId: 5,
            accounts: real_accounts,
        },
        mainnet: {
            url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
            tags: ['legacy', 'use_root'],
            chainId: 1,
            accounts: real_accounts,
        },
    },
    mocha: {},
    solidity: {
        compilers: [
            {
                version: '0.8.17',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 10000,
                    },
                },
            },
        ],
    },
    abiExporter: {
        path: './build/contracts',
        runOnCompile: true,
        clear: true,
        flat: true,
        except: [
            'Controllable$',
            'INameWrapper$',
            'SHA1$',
            'Ownable$',
            'NameResolver$',
            'TestBytesUtils$',
            'legacy/*',
        ],
        spacing: 2,
        pretty: true,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        owner: {
            default: 1,
        },
    },
    external: {
        contracts: [
            {
                artifacts: [archivedDeploymentPath],
            },
        ],
    },
};
exports.default = config;
