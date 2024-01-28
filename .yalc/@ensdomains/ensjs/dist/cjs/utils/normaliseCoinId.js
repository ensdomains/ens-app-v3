"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoderFromCoin = exports.normaliseCoinId = void 0;
const address_encoder_1 = require("@ensdomains/address-encoder");
const public_js_1 = require("../errors/public.js");
const normaliseCoinId = (coinId) => {
    const isString = typeof coinId === 'string';
    if (isString && Number.isNaN(parseInt(coinId))) {
        return {
            type: 'name',
            value: coinId.toLowerCase().replace(/legacy$/, 'Legacy'),
        };
    }
    return {
        type: 'id',
        value: isString ? parseInt(coinId) : coinId,
    };
};
exports.normaliseCoinId = normaliseCoinId;
const getCoderFromCoin = (coinId) => {
    const normalisedCoin = (0, exports.normaliseCoinId)(coinId);
    let coder;
    try {
        coder =
            normalisedCoin.type === 'id'
                ? (0, address_encoder_1.getCoderByCoinType)(normalisedCoin.value)
                : (0, address_encoder_1.getCoderByCoinName)(normalisedCoin.value);
    }
    catch {
        throw new public_js_1.CoinFormatterNotFoundError({ coinType: coinId });
    }
    return coder;
};
exports.getCoderFromCoin = getCoderFromCoin;
//# sourceMappingURL=normaliseCoinId.js.map