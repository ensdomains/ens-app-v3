import { GraphQLClient } from 'graphql-request';
import { parse, print, visit } from 'graphql/language/index.js';
import traverse from 'traverse';
import { namehash } from '../../utils/normalise.js';
const generateSelection = (selection) => ({
    kind: 'Field',
    name: {
        kind: 'Name',
        value: selection,
    },
    arguments: [],
    directives: [],
    alias: undefined,
    selectionSet: undefined,
});
const enter = (node) => {
    let hasName = false;
    let hasId = false;
    for (const selection of node.selections) {
        if ('name' in selection) {
            if (selection.name.value === 'name')
                hasName = true;
            else if (selection.name.value === 'id')
                hasId = true;
        }
    }
    if (hasName && !hasId) {
        // eslint-disable-next-line no-param-reassign
        node.selections = [...node.selections, generateSelection('id')];
        return node;
    }
    return undefined;
};
export const requestMiddleware = (request) => {
    if (!request.body)
        return request;
    const requestBody = JSON.parse(request.body);
    const rawQuery = requestBody.query;
    const parsedQuery = parse(rawQuery);
    const updatedQuery = visit(parsedQuery, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SelectionSet: {
            enter,
        },
    });
    return {
        ...request,
        body: JSON.stringify({ ...requestBody, query: print(updatedQuery) }),
    };
};
export const responseMiddleware = (response) => {
    traverse(response).forEach(function (responseItem) {
        if (responseItem instanceof Object &&
            'name' in responseItem &&
            responseItem.name &&
            typeof responseItem.name === 'string') {
            // Name already in hashed form
            if (responseItem.name && responseItem.name.includes('[')) {
                return;
            }
            let hashedName = '[Invalid ENS Name]';
            try {
                hashedName = namehash(responseItem.name);
            }
            catch (e) {
                this.update({ ...responseItem, name: hashedName, invalidName: true });
                return;
            }
            if ('id' in responseItem && responseItem.id !== hashedName) {
                this.update({ ...responseItem, name: hashedName, invalidName: true });
            }
        }
    });
};
export const createSubgraphClient = ({ client }) => new GraphQLClient(client.chain.subgraphs.ens.url, {
    requestMiddleware,
    responseMiddleware,
});
//# sourceMappingURL=client.js.map