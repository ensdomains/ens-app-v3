/* eslint-disable @typescript-eslint/naming-convention */
import { gql } from 'graphql-request';
import { FilterKeyRequiredError, InvalidFilterKeyError, InvalidOrderByError, } from '../../errors/subgraph.js';
import { EMPTY_ADDRESS } from '../../utils/consts.js';
import { createSubgraphClient } from './client.js';
import { getExpiryDateOrderFilter, getCreatedAtOrderFilter, } from './filters.js';
import { domainDetailsFragment, registrationDetailsFragment, wrappedDomainDetailsFragment, } from './fragments.js';
import { makeNameObject } from './utils.js';
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
            return getExpiryDateOrderFilter({
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
            return getCreatedAtOrderFilter({ lastDomain, orderDirection });
        }
        default:
            throw new InvalidOrderByError({
                orderBy: orderBy || '<no orderBy provided>',
                supportedOrderBys: ['expiryDate', 'name', 'labelName', 'createdAt'],
            });
    }
};
/**
 * Gets the names for an address from the subgraph.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetNamesForAddressParameters}
 * @returns Name array. {@link GetNamesForAddressReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getNamesForAddress } from '@ensdomains/ensjs/subgraph'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getNamesForAddress(client, { address: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' })
 */
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
    const subgraphClient = createSubgraphClient({ client });
    const { allowExpired, allowDeleted, allowReverseRecord, searchString, searchType, ...filters } = filter;
    const ownerWhereFilters = Object.entries(filters).reduce((prev, [key, value]) => {
        if (value) {
            if (!supportedOwnerFilters.includes(key))
                throw new InvalidFilterKeyError({
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
        throw new FilterKeyRequiredError({
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
        // Exclude domains with parent addr.reverse
        // namehash of addr.reverse = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2
        whereFilters.push({
            parent_not: '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2',
        });
    }
    if (!allowExpired) {
        // Exclude domains that are expired
        // if expiryDate is null, there is no expiry on the domain (registration or wrapped)
        whereFilters.push({
            or: [
                { expiryDate_gt: `${Math.floor(Date.now() / 1000)}` },
                { expiryDate: null },
            ],
        });
    }
    if (!allowDeleted) {
        // exclude "deleted" domains
        // when owner/resolver/registrant = null
        whereFilters.push({
            or: [
                {
                    owner_not: EMPTY_ADDRESS,
                },
                {
                    resolver_not: null,
                },
                {
                    and: [
                        {
                            registrant_not: EMPTY_ADDRESS,
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
    const query = gql `
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
    ${domainDetailsFragment}
    ${registrationDetailsFragment}
    ${wrappedDomainDetailsFragment}
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
            ...makeNameObject(domain),
            relation,
        };
    });
    return names;
};
export default getNamesForAddress;
//# sourceMappingURL=getNamesForAddress.js.map