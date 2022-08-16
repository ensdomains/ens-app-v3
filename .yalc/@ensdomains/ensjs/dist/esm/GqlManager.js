// @ts-nocheck
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
    if (node.kind === 'SelectionSet') {
        const id = node.selections.find((x) => x.name && x.name.value === 'id');
        const name = node.selections.find((x) => x.name && x.name.value === 'name');
        if (!id && name) {
            node.selections = [...node.selections, generateSelection('id')];
            return node;
        }
    }
};
export const requestMiddleware = (visit, parse) => (request) => {
    const requestBody = JSON.parse(request.body);
    const rawQuery = requestBody.query;
    const parsedQuery = parse(rawQuery);
    const updatedQuery = visit(parsedQuery, { enter });
    const updatedBody = { ...requestBody, query: updatedQuery.loc.source.body };
    return {
        ...request,
        body: JSON.stringify(updatedBody),
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
                const [imported, traverse, { visit, parse }] = await Promise.all([
                    import('graphql-request'),
                    import('traverse'),
                    import('graphql/language'),
                ]);
                this.client = new imported.GraphQLClient(url, {
                    requestMiddleware: requestMiddleware(visit, parse),
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
