import { namehash } from './utils/normalise';
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
export const enter = (node) => {
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
};
export const requestMiddleware = (visit, parse, print) => (request) => {
    const requestBody = JSON.parse(request.body);
    const rawQuery = requestBody.query;
    const parsedQuery = parse(rawQuery);
    const updatedQuery = visit(parsedQuery, {
        SelectionSet: {
            enter,
        },
    });
    return {
        ...request,
        body: JSON.stringify({ ...requestBody, query: print(updatedQuery) }),
    };
};
export const responseMiddleware = (traverse) => (response) => {
    traverse(response).forEach(function (responseItem) {
        if (responseItem instanceof Object && responseItem.name) {
            //Name already in hashed form
            if (responseItem.name && responseItem.name.includes('[')) {
                return;
            }
            const hashedName = namehash(responseItem.name);
            if (responseItem.id !== hashedName) {
                this.update({ ...responseItem, name: hashedName, invalidName: true });
            }
        }
    });
    return response;
};
export default class GqlManager {
    constructor() {
        this.gql = () => null;
        this.client = null;
        this.setUrl = async (url) => {
            if (url) {
                const [imported, traverse, { visit, parse, print }] = await Promise.all([
                    import('graphql-request'),
                    import('traverse'),
                    import('graphql/language'),
                ]);
                this.client = new imported.GraphQLClient(url, {
                    requestMiddleware: requestMiddleware(visit, parse, print),
                    responseMiddleware: responseMiddleware(traverse.default),
                });
                this.gql = imported.gql;
            }
            else {
                this.client = null;
                this.gql = () => null;
            }
        };
        this.request = (...arg) => this.client ? this.client.request(...arg) : null;
    }
}
