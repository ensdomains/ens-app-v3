"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var errors_exports = {};
__export(errors_exports, {
  ENSJSError: () => ENSJSError,
  debugSubgraphError: () => debugSubgraphError,
  debugSubgraphLatency: () => debugSubgraphLatency,
  getClientErrors: () => getClientErrors
});
module.exports = __toCommonJS(errors_exports);
var import_graphql_request = require("graphql-request");
var import_graphql = require("graphql");
class ENSJSError extends Error {
  constructor({ data, errors }) {
    super();
    this.name = "ENSJSSubgraphError";
    this.data = data;
    this.errors = errors;
  }
}
const getClientErrors = (e) => {
  var _a;
  const error = e instanceof import_graphql_request.ClientError ? e : void 0;
  return ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.errors) || [new import_graphql.GraphQLError("unknown_error")];
};
const isDebugEnvironmentActive = () => {
  return true;
};
const debugSubgraphError = (request) => {
  if (isDebugEnvironmentActive() && typeof localStorage !== "undefined" && localStorage.getItem("ensjs-debug") === "ENSJSSubgraphError") {
    if (localStorage.getItem("subgraph-debug") === "ENSJSSubgraphIndexingError" && /_meta {/.test(request.body))
      return;
    throw new import_graphql_request.ClientError(
      {
        data: void 0,
        errors: [new import_graphql.GraphQLError("ensjs-debug")],
        status: 200
      },
      request
    );
  }
};
const debugSubgraphLatency = () => {
  if (isDebugEnvironmentActive() && typeof localStorage !== "undefined" && localStorage.getItem("ensjs-debug") === "ENSJSSubgraphLatency") {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1e4);
    });
  }
};
