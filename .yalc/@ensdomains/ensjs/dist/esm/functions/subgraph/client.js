import { GraphQLClient } from 'graphql-request';
import { parse, print, visit } from 'graphql/language/index.js';
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
    const traverse = (obj) => {
        if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const value = obj[key];
                    if (value && typeof value === 'object') {
                        traverse(value);
                    }
                    if (value instanceof Object &&
                        'name' in value &&
                        value.name &&
                        typeof value.name === 'string') {
                        // Name already in hashed form
                        if (value.name.includes('[')) {
                            // eslint-disable-next-line no-continue
                            continue;
                        }
                        let hashedName = '[Invalid ENS Name]';
                        try {
                            hashedName = namehash(value.name);
                        }
                        catch (e) {
                            obj[key] = { ...value, name: hashedName, invalidName: true };
                        }
                        if ('id' in value && value.id !== hashedName) {
                            obj[key] = { ...value, name: hashedName, invalidName: true };
                        }
                    }
                }
            }
        }
    };
    traverse(response);
};
export const createSubgraphClient = ({ client }) => new GraphQLClient(client.chain.subgraphs.ens.url, {
    requestMiddleware,
    responseMiddleware,
});
//# sourceMappingURL=client.js.map