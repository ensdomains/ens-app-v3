import { ethers } from 'ethers';
import { labelhash } from '../utils/labels';
const raw = async ({ contracts, multicallWrapper }, name) => {
    const registry = await contracts?.getRegistry();
    const baseRegistrar = await contracts?.getBaseRegistrar();
    const nameWrapper = await contracts?.getNameWrapper();
    const namehash = ethers.utils.namehash(name);
    const labels = name.split('.');
    const registryData = {
        to: registry.address,
        data: registry.interface.encodeFunctionData('owner', [namehash]),
    };
    const nameWrapperData = {
        to: nameWrapper.address,
        data: nameWrapper.interface.encodeFunctionData('ownerOf', [namehash]),
    };
    const registrarData = {
        to: baseRegistrar.address,
        data: baseRegistrar.interface.encodeFunctionData('ownerOf', [
            labelhash(labels[0]),
        ]),
    };
    const data = [registryData, nameWrapperData];
    if (labels.length == 2 && labels[1] === 'eth') {
        data.push(registrarData);
    }
    return multicallWrapper.raw(data);
};
const decode = async ({ contracts, multicallWrapper }, data, name) => {
    if (data === null)
        return;
    const result = await multicallWrapper.decode(data);
    if (result === null)
        return;
    const nameWrapper = await contracts?.getNameWrapper();
    const decodedData = [result[0][1], result[1][1], result[2]?.[1]].map((ret) => ret &&
        ret !== '0x' &&
        ethers.utils.defaultAbiCoder.decode(['address'], ret));
    const registryOwner = decodedData[0][0];
    const nameWrapperOwner = decodedData[1][0];
    const registrarOwner = decodedData[2]?.[0];
    const labels = name.split('.');
    // check for only .eth names
    if (labels[labels.length - 1] === 'eth') {
        // if the owner on the registrar is the namewrapper, then the namewrapper owner is the owner
        // there is no "registrant" for wrapped names
        if (registrarOwner === nameWrapper.address) {
            return {
                owner: nameWrapperOwner,
                ownershipLevel: 'nameWrapper',
            };
        }
        // if there is a registrar owner, then it's not a subdomain but we have also passed the namewrapper clause
        // this means that it's an unwrapped second-level name
        // the registrant is the owner of the NFT
        // the owner is the controller of the records
        if (registrarOwner) {
            return {
                registrant: registrarOwner,
                owner: registryOwner,
                ownershipLevel: 'registrar',
            };
        }
        if (labels.length > 2 &&
            ethers.utils.hexStripZeros(registryOwner) !== '0x') {
            // this means that the subname is wrapped
            if (registryOwner === nameWrapper.address) {
                return {
                    owner: nameWrapperOwner,
                    ownershipLevel: 'nameWrapper',
                };
            }
            // unwrapped subnames do not have NFTs associated, so do not have a registrant
            return {
                owner: registryOwner,
                ownershipLevel: 'registry',
            };
        }
        // .eth names with no registrar owner are either unregistered or expired
        return;
    }
    // non .eth names inherit the owner from the registry
    // there will only ever be an owner for non .eth names, not a registrant
    // this is because for unwrapped names, there is no associated NFT
    // and for wrapped names, owner and registrant are the same thing
    if (registryOwner == nameWrapper.address) {
        return {
            owner: nameWrapperOwner,
            ownershipLevel: 'nameWrapper',
        };
    }
    // for unwrapped non .eth names, the owner is the registry owner
    if (ethers.utils.hexStripZeros(registryOwner) !== '0x') {
        return {
            owner: registryOwner,
            ownershipLevel: 'registry',
        };
    }
    // for anything else, return
    return;
};
export default { raw, decode };
