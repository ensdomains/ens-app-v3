"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const subgraph_js_1 = require("../../errors/subgraph.js");
const consts_js_1 = require("../../utils/consts.js");
const normalise_js_1 = require("../../utils/normalise.js");
const client_js_1 = require("./client.js");
const fragments_js_1 = require("./fragments.js");
const utils_js_1 = require("./utils.js");
const getOrderByFilter = ({ name, orderBy, orderDirection, previousPage, }) => {
    const lastDomain = previousPage[previousPage.length - 1];
    const operator = orderDirection === 'asc' ? 'gt' : 'lt';
    switch (orderBy) {
        case 'expiryDate': {
            let lastExpiryDate = lastDomain.expiryDate?.value
                ? lastDomain.expiryDate.value / 1000
                : 0;
            if (name === 'eth' && lastExpiryDate) {
                lastExpiryDate += consts_js_1.GRACE_PERIOD_SECONDS;
            }
            if (orderDirection === 'asc' && lastExpiryDate === 0) {
                return {
                    and: [{ expiryDate: null }, { [`id_${operator}`]: lastDomain.id }],
                };
            }
            if (orderDirection === 'desc' && lastExpiryDate !== 0) {
                return {
                    [`expiryDate_${operator}`]: `${lastExpiryDate}`,
                };
            }
            return {
                or: [
                    {
                        [`expiryDate_${operator}`]: `${lastExpiryDate}`,
                    },
                    { expiryDate: null },
                ],
            };
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
            return {
                [`createdAt_${operator}`]: `${lastDomain.createdAt.value / 1000}`,
            };
        }
        default:
            throw new subgraph_js_1.InvalidOrderByError({
                orderBy: orderBy || '<no orderBy provided>',
                supportedOrderBys: ['expiryDate', 'name', 'labelName', 'createdAt'],
            });
    }
};
const getSubnames = async (client, { name, searchString, allowExpired = false, allowDeleted = false, orderBy = 'name', orderDirection = 'asc', pageSize = 100, previousPage, }) => {
    const subgraphClient = (0, client_js_1.createSubgraphClient)({ client });
    const whereFilters = [];
    if (previousPage?.length) {
        whereFilters.push(getOrderByFilter({
            name,
            orderBy,
            orderDirection,
            previousPage,
        }));
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
                ...(name.toLowerCase() === 'eth'
                    ? [
                        {
                            registrant_not: consts_js_1.EMPTY_ADDRESS,
                        },
                    ]
                    : []),
            ],
        });
    }
    if (searchString) {
        whereFilters.push({
            labelName_contains: searchString,
        });
    }
    let whereFilter = {};
    if (whereFilters.length > 1) {
        whereFilter = {
            and: whereFilters,
        };
    }
    else if (whereFilters.length === 1) {
        ;
        [whereFilter] = whereFilters;
    }
    const query = (0, graphql_request_1.gql) `
    query getSubnames(
      $id: String!
      $orderBy: Domain_orderBy
      $orderDirection: OrderDirection
      $whereFilter: Domain_filter
      $first: Int
    ) {
      domain(id: $id) {
        subdomains(
          orderBy: $orderBy
          orderDirection: $orderDirection
          first: $first
          where: $whereFilter
        ) {
          ...DomainDetailsWithoutParent
          registration {
            ...RegistrationDetails
          }
          wrappedDomain {
            ...WrappedDomainDetails
          }
        }
      }
    }
    ${fragments_js_1.domainDetailsWithoutParentFragment}
    ${fragments_js_1.registrationDetailsFragment}
    ${fragments_js_1.wrappedDomainDetailsFragment}
  `;
    const queryVars = {
        id: (0, normalise_js_1.namehash)(name),
        orderBy,
        orderDirection,
        first: pageSize,
        whereFilter,
    };
    const result = await subgraphClient.request(query, queryVars);
    if (!result.domain)
        return [];
    const names = result.domain.subdomains.map((domain) => (0, utils_js_1.makeNameObject)({ ...domain, parent: { name } }));
    return names;
};
exports.default = getSubnames;
//# sourceMappingURL=getSubnames.js.map