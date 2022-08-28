"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fuses_1 = require("../utils/fuses");
const normalise_1 = require("../utils/normalise");
async function default_1({ contracts, signer }, name, props) {
    const isNumber = 'fuseNumberToBurn' in props;
    const hasNamedArray = 'namedFusesToBurn' in props;
    const hasUnnamedArray = 'unnamedFusesToBurn' in props;
    let encodedFuses = 0;
    if (isNumber) {
        if (props.fuseNumberToBurn > 2 ** 32 || props.fuseNumberToBurn < 1) {
            throw new Error(`Fuse number must be limited to uint32, ${props.fuseNumberToBurn} was too ${props.fuseNumberToBurn < 1 ? 'low' : 'high'}.`);
        }
        else if (props.fuseNumberToBurn % 1 !== 0) {
            throw new Error(`Fuse number must be an integer, ${props.fuseNumberToBurn} was not.`);
        }
        encodedFuses = props.fuseNumberToBurn;
    }
    else {
        if (!hasNamedArray && !hasUnnamedArray) {
            throw new Error('Please provide fuses to burn');
        }
        if (hasNamedArray) {
            for (const fuse of props.namedFusesToBurn) {
                if (!(fuse in fuses_1.fuseEnum)) {
                    throw new Error(`${fuse} is not a valid named fuse.`);
                }
                encodedFuses |= fuses_1.fuseEnum[fuse];
            }
        }
        if (hasUnnamedArray) {
            for (const fuse of props.unnamedFusesToBurn) {
                if (!fuses_1.unnamedFuses.includes(fuse)) {
                    throw new Error(`${fuse} is not a valid unnamed fuse. If you are trying to burn a named fuse, use the namedFusesToBurn property.`);
                }
                encodedFuses |= fuse;
            }
        }
    }
    const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
    const hash = (0, normalise_1.namehash)(name);
    return nameWrapper.populateTransaction.setFuses(hash, encodedFuses);
}
exports.default = default_1;
