// src/utils/errors.ts
import { ClientError } from "graphql-request";
import { GraphQLError } from "graphql";
var ENSJSError = class extends Error {
  name = "ENSJSSubgraphError";
  errors;
  data;
  constructor({ data, errors }) {
    super();
    this.data = data;
    this.errors = errors;
  }
};
var getClientErrors = (e) => {
  const error = e instanceof ClientError ? e : void 0;
  return error?.response?.errors || [new GraphQLError("unknown_error")];
};
var debugSubgraphError = (request) => {
  if (process.env.NEXT_PUBLIC_ENSJS_DEBUG === "on" && typeof localStorage !== "undefined" && localStorage.getItem("ensjs-debug") === "ENSJSSubgraphError") {
    if (/_meta {/.test(request.body))
      return;
    throw new ClientError(
      {
        data: void 0,
        errors: [new GraphQLError("ensjs-debug")],
        status: 200
      },
      request
    );
  }
};
var debugSubgraphLatency = () => {
  if (process.env.NEXT_PUBLIC_ENSJS_DEBUG === "on" && typeof localStorage !== "undefined" && localStorage.getItem("ensjs-debug") === "ENSJSSubgraphLatency") {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1e4);
    });
  }
};
export {
  ENSJSError,
  debugSubgraphError,
  debugSubgraphLatency,
  getClientErrors
};