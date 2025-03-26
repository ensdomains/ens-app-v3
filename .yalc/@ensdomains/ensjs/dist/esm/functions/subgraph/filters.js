/* eslint-disable @typescript-eslint/naming-convention */
import { match, P } from 'ts-pattern';
import { GRACE_PERIOD_SECONDS } from '../../utils/consts.js';
export const getExpiryDateOrderFilter = ({ orderDirection, lastDomain, }) => {
    let lastExpiryDate = lastDomain.expiryDate?.value
        ? lastDomain.expiryDate.value / 1000
        : 0;
    if (lastDomain.parentName === 'eth')
        lastExpiryDate += GRACE_PERIOD_SECONDS;
    return match({
        lastExpiryDate,
        orderDirection,
    })
        .with({
        lastExpiryDate: P.number.lte(0),
        orderDirection: 'asc',
    }, () => ({
        and: [{ expiryDate: null }, { id_gt: lastDomain.id }],
    }))
        .with({
        lastExpiryDate: P.number,
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
        lastExpiryDate: P.number.lte(0),
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
        lastExpiryDate: P.number,
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
export const getCreatedAtOrderFilter = ({ orderDirection, lastDomain, }) => match({
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
//# sourceMappingURL=filters.js.map