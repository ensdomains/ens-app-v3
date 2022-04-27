"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("ethers/lib/utils");
const format_1 = require("../utils/format");
const labels_1 = require("../utils/labels");
const getSubnames = async ({ gqlInstance }, name) => {
    const client = gqlInstance.client;
    const query = gqlInstance.gql `
    query getSubdomains($id: ID!) {
      domain(id: $id) {
        subdomains {
          id
          labelName
          labelhash
          isMigrated
          name
          owner {
            id
          }
        }
      }
    }
  `;
    const { domain } = await client.request(query, { id: (0, utils_1.namehash)(name) });
    return domain.subdomains.map((subname) => {
        const decrypted = (0, labels_1.decryptName)(subname.name);
        return {
            ...subname,
            name: decrypted,
            truncatedName: (0, format_1.truncateFormat)(decrypted),
        };
    });
};
exports.default = getSubnames;
