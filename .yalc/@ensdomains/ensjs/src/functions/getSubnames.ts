import { namehash } from 'ethers/lib/utils'
import { ENSArgs } from '..'
import { truncateFormat } from '../utils/format'
import { decryptName } from '../utils/labels'

type Subname = {
  id: string
  labelName: string | null
  truncatedName?: string
  labelhash: string
  isMigrated: boolean
  name: string
  owner: {
    id: string
  }
}

const getSubnames = async (
  { gqlInstance }: ENSArgs<'gqlInstance'>,
  name: string,
): Promise<Subname[]> => {
  const client = gqlInstance.client!
  const query = gqlInstance.gql`
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
  `

  const { domain } = await client.request(query, { id: namehash(name) })
  return (domain.subdomains as Subname[]).map((subname) => {
    const decrypted = decryptName(subname.name)
    return {
      ...subname,
      name: decrypted,
      truncatedName: truncateFormat(decrypted),
    }
  })
}

export default getSubnames
