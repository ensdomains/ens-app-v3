"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSafeSecondsDate = void 0;
const consts_js_1 = require("./consts.js");
const makeSafeSecondsDate = (seconds) => {
    const milliseconds = BigInt(seconds) * 1000n;
    if (milliseconds > BigInt(consts_js_1.MAX_DATE_INT))
        return new Date(consts_js_1.MAX_DATE_INT);
    return new Date(Number(milliseconds));
};
exports.makeSafeSecondsDate = makeSafeSecondsDate;
//# sourceMappingURL=makeSafeSecondsDate.js.map