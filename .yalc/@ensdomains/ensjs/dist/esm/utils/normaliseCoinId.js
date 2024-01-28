import { getCoderByCoinName, getCoderByCoinType, } from '@ensdomains/address-encoder';
import { CoinFormatterNotFoundError } from '../errors/public.js';
export const normaliseCoinId = (coinId) => {
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
export const getCoderFromCoin = (coinId) => {
    const normalisedCoin = normaliseCoinId(coinId);
    let coder;
    try {
        coder =
            normalisedCoin.type === 'id'
                ? getCoderByCoinType(normalisedCoin.value)
                : getCoderByCoinName(normalisedCoin.value);
    }
    catch {
        throw new CoinFormatterNotFoundError({ coinType: coinId });
    }
    return coder;
};
//# sourceMappingURL=normaliseCoinId.js.map