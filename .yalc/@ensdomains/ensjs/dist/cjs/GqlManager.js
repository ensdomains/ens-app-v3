"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var GqlManager_exports = {};
__export(GqlManager_exports, {
  default: () => GqlManager,
  enter: () => enter,
  requestMiddleware: () => requestMiddleware,
  responseMiddleware: () => responseMiddleware
});
module.exports = __toCommonJS(GqlManager_exports);
var import_errors = require("./utils/errors");
var import_normalise = require("./utils/normalise");
const generateSelection = (selection) => ({
  kind: "Field",
  name: {
    kind: "Name",
    value: selection
  },
  arguments: [],
  directives: [],
  alias: void 0,
  selectionSet: void 0
});
const enter = (node) => {
  let hasName = false;
  let hasId = false;
  for (const selection of node.selections) {
    if ("name" in selection) {
      if (selection.name.value === "name")
        hasName = true;
      else if (selection.name.value === "id")
        hasId = true;
    }
  }
  if (hasName && !hasId) {
    node.selections = [...node.selections, generateSelection("id")];
    return node;
  }
};
const requestMiddleware = (visit, parse, print) => (request) => {
  (0, import_errors.debugSubgraphError)(request);
  const requestBody = JSON.parse(request.body);
  const rawQuery = requestBody.query;
  const parsedQuery = parse(rawQuery);
  const updatedQuery = visit(parsedQuery, {
    SelectionSet: {
      enter
    }
  });
  return {
    ...request,
    body: JSON.stringify({ ...requestBody, query: print(updatedQuery) })
  };
};
const responseMiddleware = (traverse) => (response) => {
  if (response instanceof Error)
    return response;
  traverse(response).forEach(function(responseItem) {
    if (responseItem instanceof Object && responseItem.name) {
      if (responseItem.name && responseItem.name.includes("[")) {
        return;
      }
      let hashedName = "[Invalid ENS Name]";
      try {
        hashedName = (0, import_normalise.namehash)(responseItem.name);
      } catch (e) {
        this.update({ ...responseItem, name: hashedName, invalidName: true });
        return;
      }
      if (responseItem.id !== hashedName) {
        this.update({ ...responseItem, name: hashedName, invalidName: true });
      }
    }
  });
  return response;
};
class GqlManager {
  constructor() {
    this.gql = (query) => query.join();
    this.client = {
      request: () => Promise.resolve(null)
    };
    this.setUrl = async (url) => {
      if (url) {
        const [imported, traverse, { visit, parse, print }] = await Promise.all([
          import("graphql-request"),
          import("traverse"),
          import("graphql/language")
        ]);
        this.client = new imported.GraphQLClient(url, {
          requestMiddleware: requestMiddleware(visit, parse, print),
          responseMiddleware: responseMiddleware(traverse.default)
        });
        this.gql = imported.gql;
      } else {
        this.client = {
          request: () => Promise.resolve(null)
        };
        this.gql = (query) => query.join();
      }
    };
  }
}
