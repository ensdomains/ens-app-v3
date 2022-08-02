"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseMiddleware = exports.requestMiddleware = exports.enter = void 0;
// @ts-nocheck
const normalise_1 = require("./utils/normalise");
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
    if (node.kind === 'SelectionSet') {
        const id = node.selections.find((x) => x.name && x.name.value === 'id');
        const name = node.selections.find((x) => x.name && x.name.value === 'name');
        if (!id && name) {
            node.selections = [...node.selections, generateSelection('id')];
            return node;
        }
    }
};
exports.enter = enter;
const requestMiddleware = (visit, parse) => (request) => {
    const requestBody = JSON.parse(request.body);
    const rawQuery = requestBody.query;
    const parsedQuery = parse(rawQuery);
    const updatedQuery = visit(parsedQuery, { enter: exports.enter });
    const updatedBody = { ...requestBody, query: updatedQuery.loc.source.body };
    return {
        ...request,
        body: JSON.stringify(updatedBody),
    };
};
exports.requestMiddleware = requestMiddleware;
const responseMiddleware = (traverse) => (response) => {
    traverse(response).forEach(function (responseItem) {
        if (responseItem instanceof Object && responseItem.name) {
            //Name already in hashed form
            if (responseItem.name && responseItem.name.includes('[')) {
                return;
            }
            const hashedName = (0, normalise_1.namehash)(responseItem.name);
            if (responseItem.id !== hashedName) {
                this.update({ ...responseItem, name: hashedName, invalidName: true });
            }
        }
    });
    return response;
};
exports.responseMiddleware = responseMiddleware;
class GqlManager {
    gql = () => null;
    client = null;
    setUrl = async (url) => {
        if (url) {
            const [imported, traverse, { visit, parse }] = await Promise.all([
                Promise.resolve().then(() => __importStar(require('graphql-request'))),
                Promise.resolve().then(() => __importStar(require('traverse'))),
                Promise.resolve().then(() => __importStar(require('graphql/language'))),
            ]);
            this.client = new imported.GraphQLClient(url, {
                requestMiddleware: (0, exports.requestMiddleware)(visit, parse),
                responseMiddleware: (0, exports.responseMiddleware)(traverse.default),
            });
            this.gql = imported.gql;
        }
        else {
            this.client = null;
            this.gql = () => null;
        }
    };
    request = (...arg) => this.client ? this.client.request(...arg) : null;
}
exports.default = GqlManager;
