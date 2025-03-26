"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const subgraph_js_1 = require("../../errors/subgraph.js");
const consts_js_1 = require("../../utils/consts.js");
const client_js_1 = require("./client.js");
const filters_js_1 = require("./filters.js");
const fragments_js_1 = require("./fragments.js");
const utils_js_1 = require("./utils.js");
const supportedOwnerFilters = [
    'owner',
    'registrant',
    'wrappedOwner',
    'resolvedAddress',
];
const getOrderByFilter = ({ orderBy, orderDirection, previousPage, }) => {
    const lastDomain = previousPage[previousPage.length - 1];
    const operator = orderDirection === 'asc' ? 'gt' : 'lt';
    switch (orderBy) {
        case 'expiryDate': {
            return (0, filters_js_1.getExpiryDateOrderFilter)({
                orderDirection,
                lastDomain,
            });
        }
        case 'name': {
            return {
                [`name_${operator}`]: lastDomain.name ?? '',
            };
        }
        case 'labelName': {
            return {
                [`labelName_${operator}`]: lastDomain.labelName ?? '',
            };
        }
        case 'createdAt': {
            return (0, filters_js_1.getCreatedAtOrderFilter)({ lastDomain, orderDirection });
        }
        default:
            throw new subgraph_js_1.InvalidOrderByError({
                orderBy: orderBy || '<no orderBy provided>',
                supportedOrderBys: ['expiryDate', 'name', 'labelName', 'createdAt'],
            });
    }
};
const getNamesForAddress = async (client, { address, filter: _filter, orderBy = 'name', orderDirection = 'asc', pageSize = 100, previousPage, }) => {
    const filter = {
        owner: true,
        registrant: true,
        resolvedAddress: true,
        wrappedOwner: true,
        allowExpired: false,
        allowDeleted: false,
        allowReverseRecord: false,
        searchType: 'labelName',
        ..._filter,
    };
    const subgraphClient = (0, client_js_1.createSubgraphClient)({ client });
    const { allowExpired, allowDeleted, allowReverseRecord, searchString, searchType, ...filters } = filter;
    const ownerWhereFilters = Object.entries(filters).reduce((prev, [key, value]) => {
        if (value) {
            if (!supportedOwnerFilters.includes(key))
                throw new subgraph_js_1.InvalidFilterKeyError({
                    filterKey: key,
                    supportedFilterKeys: supportedOwnerFilters,
                });
            return [
                ...prev,
                {
                    [key]: address.toLowerCase(),
                },
            ];
        }
        return prev;
    }, []);
    const hasFilterApplied = ownerWhereFilters.length > 0;
    if (!hasFilterApplied)
        throw new subgraph_js_1.FilterKeyRequiredError({
            supportedFilterKeys: supportedOwnerFilters,
            details: 'At least one ownership filter must be enabled',
        });
    const ownerWhereFilter = ownerWhereFilters.length > 1
        ? { or: ownerWhereFilters }
        : ownerWhereFilters[0];
    const whereFilters = [ownerWhereFilter];
    if (previousPage?.length) {
        whereFilters.push(getOrderByFilter({
            orderBy,
            orderDirection,
            previousPage,
        }));
    }
    if (!allowReverseRecord) {
        whereFilters.push({
            parent_not: '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2',
        });
    }
    if (!allowExpired) {
        whereFilters.push({
            or: [
                { expiryDate_gt: `${Math.floor(Date.now() / 1000)}` },
                { expiryDate: null },
            ],
        });
    }
    if (!allowDeleted) {
        whereFilters.push({
            or: [
                {
                    owner_not: consts_js_1.EMPTY_ADDRESS,
                },
                {
                    resolver_not: null,
                },
                {
                    and: [
                        {
                            registrant_not: consts_js_1.EMPTY_ADDRESS,
                        },
                        {
                            registrant_not: null,
                        },
                    ],
                },
            ],
        });
    }
    if (searchString) {
        whereFilters.push({
            [`${searchType}_contains`]: searchString,
        });
    }
    const whereFilter = whereFilters.length > 1 ? { and: whereFilters } : whereFilters[0];
    const query = (0, graphql_request_1.gql) `
    query getNamesForAddress(
      $orderBy: Domain_orderBy
      $orderDirection: OrderDirection
      $first: Int
      $whereFilter: Domain_filter
    ) {
      domains(
        orderBy: $orderBy
        orderDirection: $orderDirection
        first: $first
        where: $whereFilter
      ) {
        ...DomainDetails
        registration {
          ...RegistrationDetails
        }
        wrappedDomain {
          ...WrappedDomainDetails
        }
      }
    }
    ${fragments_js_1.domainDetailsFragment}
    ${fragments_js_1.registrationDetailsFragment}
    ${fragments_js_1.wrappedDomainDetailsFragment}
  `;
    const result = await subgraphClient.request(query, {
        orderBy,
        orderDirection,
        first: pageSize,
        whereFilter,
    });
    if (!result)
        return [];
    const names = result.domains.map((domain) => {
        const relation = {};
        if (domain.owner) {
            relation.owner = domain.owner.id === address.toLowerCase();
        }
        if (domain.registrant) {
            relation.registrant = domain.registrant.id === address.toLowerCase();
        }
        if (domain.wrappedOwner) {
            relation.wrappedOwner = domain.wrappedOwner.id === address.toLowerCase();
        }
        if (domain.resolvedAddress) {
            relation.resolvedAddress =
                domain.resolvedAddress.id === address.toLowerCase();
        }
        return {
            ...(0, utils_js_1.makeNameObject)(domain),
            relation,
        };
    });
    return names;
};
exports.default = getNamesForAddress;
//# sourceMappingURL=getNamesForAddress.js.map