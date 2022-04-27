import { namehash } from 'ethers/lib/utils';
import { truncateFormat } from '../utils/format';
import { decryptName } from '../utils/labels';
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
    const { domain } = await client.request(query, { id: namehash(name) });
    return domain.subdomains.map((subname) => {
        const decrypted = decryptName(subname.name);
        return {
            ...subname,
            name: decrypted,
            truncatedName: truncateFormat(decrypted),
        };
    });
};
export default getSubnames;
