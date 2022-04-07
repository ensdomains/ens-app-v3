import { ReverseRegistrar } from '@ensdomains/ens-contracts';
import { ethers } from 'ethers';
const defaultAddress = '0x6F628b68b30Dc3c17f345c9dbBb1E483c2b7aE5c';
const ABI = ReverseRegistrar;
export default (provider, address) => new ethers.Contract(address || defaultAddress, ABI, provider);
