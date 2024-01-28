"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubgraphClient = exports.responseMiddleware = exports.requestMiddleware = void 0;
const graphql_request_1 = require("graphql-request");
const index_js_1 = require("graphql/language/index.js");
const traverse_1 = require("traverse");
const normalise_js_1 = require("../../utils/normalise.js");
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
        node.selections = [...node.selections, generateSelection('id')];
        return node;
    }
    return undefined;
};
const requestMiddleware = (request) => {
    if (!request.body)
        return request;
    const requestBody = JSON.parse(request.body);
    const rawQuery = requestBody.query;
    const parsedQuery = (0, index_js_1.parse)(rawQuery);
    const updatedQuery = (0, index_js_1.visit)(parsedQuery, {
        SelectionSet: {
            enter,
        },
    });
    return {
        ...request,
        body: JSON.stringify({ ...requestBody, query: (0, index_js_1.print)(updatedQuery) }),
    };
};
exports.requestMiddleware = requestMiddleware;
const responseMiddleware = (response) => {
    (0, traverse_1.default)(response).forEach(function (responseItem) {
        if (responseItem instanceof Object &&
            'name' in responseItem &&
            responseItem.name &&
            typeof responseItem.name === 'string') {
            if (responseItem.name && responseItem.name.includes('[')) {
                return;
            }
            let hashedName = '[Invalid ENS Name]';
            try {
                hashedName = (0, normalise_js_1.namehash)(responseItem.name);
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
exports.responseMiddleware = responseMiddleware;
const createSubgraphClient = ({ client }) => new graphql_request_1.GraphQLClient(client.chain.subgraphs.ens.url, {
    requestMiddleware: exports.requestMiddleware,
    responseMiddleware: exports.responseMiddleware,
});
exports.createSubgraphClient = createSubgraphClient;
//# sourceMappingURL=client.js.map