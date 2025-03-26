"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreatedAtOrderFilter = exports.getExpiryDateOrderFilter = void 0;
const ts_pattern_1 = require("ts-pattern");
const consts_js_1 = require("../../utils/consts.js");
const getExpiryDateOrderFilter = ({ orderDirection, lastDomain, }) => {
    let lastExpiryDate = lastDomain.expiryDate?.value
        ? lastDomain.expiryDate.value / 1000
        : 0;
    if (lastDomain.parentName === 'eth')
        lastExpiryDate += consts_js_1.GRACE_PERIOD_SECONDS;
    return (0, ts_pattern_1.match)({
        lastExpiryDate,
        orderDirection,
    })
        .with({
        lastExpiryDate: ts_pattern_1.P.number.lte(0),
        orderDirection: 'asc',
    }, () => ({
        and: [{ expiryDate: null }, { id_gt: lastDomain.id }],
    }))
        .with({
        lastExpiryDate: ts_pattern_1.P.number,
        orderDirection: 'asc',
    }, () => ({
        or: [
            {
                and: [
                    {
                        expiryDate_gte: `${lastExpiryDate}`,
                    },
                    { id_gt: lastDomain.id },
                ],
            },
            {
                expiryDate_gt: `${lastExpiryDate}`,
            },
            {
                expiryDate: null,
            },
        ],
    }))
        .with({
        lastExpiryDate: ts_pattern_1.P.number.lte(0),
        orderDirection: 'desc',
    }, () => ({
        or: [
            {
                and: [{ expiryDate: null }, { [`id_lt`]: lastDomain.id }],
            },
            {
                [`expiryDate_gt`]: 0,
            },
        ],
    }))
        .with({
        lastExpiryDate: ts_pattern_1.P.number,
        orderDirection: 'desc',
    }, () => ({
        or: [
            {
                and: [
                    { expiryDate_lte: `${lastExpiryDate}` },
                    { id_lt: lastDomain.id },
                ],
            },
            {
                expiryDate_lt: `${lastExpiryDate}`,
            },
        ],
    }))
        .exhaustive();
};
exports.getExpiryDateOrderFilter = getExpiryDateOrderFilter;
const getCreatedAtOrderFilter = ({ orderDirection, lastDomain, }) => (0, ts_pattern_1.match)({
    orderDirection,
})
    .with({
    orderDirection: 'asc',
}, () => ({
    or: [
        {
            and: [
                {
                    createdAt_gte: `${lastDomain.createdAt.value / 1000}`,
                    id_gt: lastDomain.id,
                },
            ],
        },
        {
            createdAt_gt: `${lastDomain.createdAt.value / 1000}`,
        },
    ],
}))
    .with({
    orderDirection: 'desc',
}, () => ({
    or: [
        {
            and: [
                { createdAt_lte: `${lastDomain.createdAt.value / 1000}` },
                { id_lt: lastDomain.id },
            ],
        },
        {
            createdAt_lt: `${lastDomain.createdAt.value / 1000}`,
        },
    ],
}))
    .exhaustive();
exports.getCreatedAtOrderFilter = getCreatedAtOrderFilter;
//# sourceMappingURL=filters.js.map