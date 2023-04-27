// src/GqlManager.ts
import { namehash } from "./utils/normalise.mjs";
var generateSelection = (selection) => ({
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
var metaSelection = {
  kind: "Field",
  name: {
    kind: "Name",
    value: "_meta"
  },
  alias: void 0,
  arguments: [],
  directives: [],
  selectionSet: {
    kind: "SelectionSet",
    selections: [
      {
        kind: "Field",
        alias: void 0,
        name: {
          kind: "Name",
          value: "hasIndexingErrors"
        },
        arguments: [],
        directives: []
      },
      {
        kind: "Field",
        alias: void 0,
        name: {
          kind: "Name",
          value: "block"
        },
        arguments: [],
        directives: [],
        selectionSet: {
          kind: "SelectionSet",
          selections: [
            {
              kind: "Field",
              name: {
                kind: "Name",
                value: "number"
              },
              arguments: [],
              directives: []
            }
          ]
        }
      }
    ]
  }
};
var enter = (node) => {
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
var requestMiddleware = (visit, parse, print) => (request) => {
  const requestBody = JSON.parse(request.body);
  const rawQuery = requestBody.query;
  const parsedQuery = parse(rawQuery);
  const updatedQuery = visit(parsedQuery, {
    SelectionSet: {
      enter
    },
    OperationDefinition: {
      enter: (node) => {
        if (node.operation === "query") {
          node.selectionSet.selections = [
            metaSelection,
            ...node.selectionSet.selections
          ];
        }
        return node;
      }
    }
  });
  return {
    ...request,
    body: JSON.stringify({ ...requestBody, query: print(updatedQuery) })
  };
};
var responseMiddleware = (traverse) => (response) => {
  traverse(response).forEach(function(responseItem) {
    if (responseItem instanceof Object && responseItem.name) {
      if (responseItem.name && responseItem.name.includes("[")) {
        return;
      }
      let hashedName = "[Invalid ENS Name]";
      try {
        hashedName = namehash(responseItem.name);
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
var GqlManager = class {
  gql = (query) => query.join();
  client = {
    request: () => Promise.resolve(null)
  };
  setUrl = async (url) => {
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
};
export {
  GqlManager as default,
  enter,
  requestMiddleware,
  responseMiddleware
};
