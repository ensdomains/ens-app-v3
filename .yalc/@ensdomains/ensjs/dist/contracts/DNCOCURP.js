import { ethers } from 'ethers';
const defaultAddress = '0xf178d75267cd7EA9DfB6F82Bb1f6e7B8edb43E43';
const ABI = [
    'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
    'function isOwner(address addr) view returns (bool)',
    'function owner() view returns (address)',
    'function reverse(bytes reverseNode, tuple(address target, bytes data, uint8 dataType, uint256[] locations)[] calls) view returns (string name, bytes[] returnData)',
    'function setUniversalResolver(address newUniversalResolver)',
    'function transferOwnership(address newOwner)',
    'function universalResolver() view returns (address)',
];
export default (provider, address) => new ethers.Contract(address || defaultAddress, ABI, provider);
