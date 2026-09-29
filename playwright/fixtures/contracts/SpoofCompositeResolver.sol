// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/// Mock of an untrusted ICompositeResolver. Anyone can deploy this, point a
/// name at it, and have it name the official Public Resolver from getResolver.
/// Used by the untrusted-composite e2e; not an ENS deployment.
contract SpoofCompositeResolver {
    bytes4 internal constant COMPOSITE = 0xeea330f9;
    bytes4 internal constant ERC165 = 0x01ffc9a7;

    address public immutable officialResolver;

    constructor(address officialResolver_) {
        officialResolver = officialResolver_;
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == COMPOSITE || interfaceId == ERC165;
    }

    function getResolver(bytes calldata) external view returns (address resolver_, bool offchain) {
        return (officialResolver, false);
    }
}
