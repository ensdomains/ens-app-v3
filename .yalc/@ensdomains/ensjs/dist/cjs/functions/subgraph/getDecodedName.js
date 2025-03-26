"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const labels_js_1 = require("../../utils/labels.js");
const normalise_js_1 = require("../../utils/normalise.js");
const client_js_1 = require("./client.js");
const getDecodedName = async (client, { name, allowIncomplete }) => {
    if ((0, labels_js_1.checkIsDecrypted)(name))
        return name;
    const labels = name.split('.');
    const subgraphClient = (0, client_js_1.createSubgraphClient)({ client });
    let labelsQuery = '';
    for (let i = 0; i < labels.length; i += 1) {
        const label = labels[i];
        if ((0, labels_js_1.isEncodedLabelhash)(label)) {
            labelsQuery += (0, graphql_request_1.gql) `
        labels${i}: domains(first: 1, where: { labelhash: "${(0, labels_js_1.decodeLabelhash)(label).toLowerCase()}", labelName_not: null }) {
          labelName
        }
      `;
        }
    }
    const decodedNameQuery = (0, graphql_request_1.gql) `
    query decodedName($id: String!) {
      namehashLookup: domain(id: $id) {
        name
      }
      ${labelsQuery}
    }
  `;
    const decodedNameResult = await subgraphClient.request(decodedNameQuery, {
        id: (0, normalise_js_1.namehash)(name),
    });
    if (!decodedNameResult)
        return null;
    const attemptedDecodedLabels = [...labels];
    const { namehashLookup: { name: namehashLookupResult } = { name: undefined }, ...labelResults } = decodedNameResult;
    if (namehashLookupResult) {
        const namehashLookupLabels = namehashLookupResult.split('.');
        for (let i = 0; i < namehashLookupLabels.length; i += 1) {
            const label = namehashLookupLabels[i];
            if (!(0, labels_js_1.isEncodedLabelhash)(label)) {
                attemptedDecodedLabels[i] = label;
            }
        }
        const joinedResult = attemptedDecodedLabels.join('.');
        if ((0, labels_js_1.checkIsDecrypted)(joinedResult))
            return joinedResult;
    }
    if (Object.keys(labelResults).length !== 0) {
        for (const [key, value] of Object.entries(labelResults)) {
            if (value.length && value[0].labelName) {
                attemptedDecodedLabels[parseInt(key.replace('labels', ''))] =
                    value[0].labelName;
            }
        }
    }
    const joinedResult = attemptedDecodedLabels.join('.');
    if ((0, labels_js_1.checkIsDecrypted)(joinedResult) || allowIncomplete)
        return joinedResult;
    return null;
};
exports.default = getDecodedName;
//# sourceMappingURL=getDecodedName.js.map