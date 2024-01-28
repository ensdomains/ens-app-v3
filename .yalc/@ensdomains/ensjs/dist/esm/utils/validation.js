import { NameWithEmptyLabelsError, RootNameIncludesOtherLabelsError, } from '../errors/utils.js';
import { MINIMUM_DOT_ETH_CHARS } from './consts.js';
import { checkLabel, isEncodedLabelhash, saveName } from './labels.js';
import { normalise, split } from './normalise.js';
export const validateName = (name) => {
    const nameArray = name.split('.');
    const normalisedArray = nameArray.map((label) => {
        if (label.length === 0)
            throw new NameWithEmptyLabelsError({ name });
        if (label === '[root]') {
            if (name !== label)
                throw new RootNameIncludesOtherLabelsError({ name });
            return label;
        }
        return isEncodedLabelhash(label)
            ? checkLabel(label) || label
            : normalise(label);
    });
    const normalisedName = normalisedArray.join('.');
    saveName(normalisedName);
    return normalisedName;
};
export const parseInput = (input) => {
    let nameReference = input;
    let isValid = false;
    try {
        nameReference = validateName(input);
        isValid = true;
    }
    catch { }
    const normalisedName = isValid ? nameReference : undefined;
    const labels = nameReference.split('.');
    const tld = labels[labels.length - 1];
    const isETH = tld === 'eth';
    const labelDataArray = split(nameReference);
    const isShort = (labelDataArray[0].output?.length || 0) < MINIMUM_DOT_ETH_CHARS;
    if (labels.length === 1) {
        return {
            type: 'label',
            normalised: normalisedName,
            isShort,
            isValid,
            is2LD: false,
            isETH,
            labelDataArray,
        };
    }
    const is2LD = labels.length === 2;
    return {
        type: 'name',
        normalised: normalisedName,
        isShort: isETH && is2LD ? isShort : false,
        isValid,
        is2LD,
        isETH,
        labelDataArray,
    };
};
export const checkIsDotEth = (labels) => labels.length === 2 && labels[1] === 'eth';
//# sourceMappingURL=validation.js.map