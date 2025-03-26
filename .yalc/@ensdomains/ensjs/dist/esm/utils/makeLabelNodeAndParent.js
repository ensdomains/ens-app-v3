import { labelhash } from 'viem';
import { namehash } from './normalise.js';
export const makeLabelNodeAndParent = (name) => {
    const labels = name.split('.');
    const label = labels.shift();
    const parentNode = namehash(labels.join('.'));
    return {
        label,
        labelhash: labelhash(label),
        parentNode,
    };
};
//# sourceMappingURL=makeLabelNodeAndParent.js.map