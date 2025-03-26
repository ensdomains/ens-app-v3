"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLabelNodeAndParent = void 0;
const viem_1 = require("viem");
const normalise_js_1 = require("./normalise.js");
const makeLabelNodeAndParent = (name) => {
    const labels = name.split('.');
    const label = labels.shift();
    const parentNode = (0, normalise_js_1.namehash)(labels.join('.'));
    return {
        label,
        labelhash: (0, viem_1.labelhash)(label),
        parentNode,
    };
};
exports.makeLabelNodeAndParent = makeLabelNodeAndParent;
//# sourceMappingURL=makeLabelNodeAndParent.js.map