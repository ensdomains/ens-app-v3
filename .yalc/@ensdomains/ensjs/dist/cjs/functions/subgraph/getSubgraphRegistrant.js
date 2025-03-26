"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const viem_1 = require("viem");
const general_js_1 = require("../../errors/general.js");
const getNameType_js_1 = require("../../utils/getNameType.js");
const client_js_1 = require("./client.js");
const query = (0, graphql_request_1.gql) `
  query getSubgraphRegistrant($id: String!) {
    registration(id: $id) {
      registrant {
        id
      }
    }
  }
`;
const getSubgraphRegistrant = async (client, { name }) => {
    const labels = name.split('.');
    const nameType = (0, getNameType_js_1.getNameType)(name);
    if (nameType !== 'eth-2ld')
        throw new general_js_1.UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: ['eth-2ld'],
            details: 'Registrant can only be fetched for eth-2ld names',
        });
    const subgraphClient = (0, client_js_1.createSubgraphClient)({ client });
    const result = await subgraphClient.request(query, {
        id: (0, viem_1.labelhash)(labels[0]),
    });
    if (result?.registration?.registrant?.id)
        return (0, viem_1.getAddress)(result.registration.registrant.id);
    return null;
};
exports.default = getSubgraphRegistrant;
//# sourceMappingURL=getSubgraphRegistrant.js.map