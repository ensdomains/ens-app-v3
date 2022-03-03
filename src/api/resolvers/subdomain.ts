import { queryAll } from '@app/api/subDomainRegistrar'
import getENS from '@app/apollo/mutations/ens'
import { utils } from 'ethers'

const defaults = {
  subDomainState: [],
}

const resolvers = {
  Query: {
    async getSubDomainAvailability(_: any, { name }: Record<string, any>) {
      const nodes = await queryAll(name)
      const cachedNodes: any[] = []

      const promises = nodes.map((subDomainPromise) =>
        subDomainPromise
          .then(async (node) => {
            let owner = null

            if (!node.available) {
              const ens = getENS()
              owner = await ens.getOwner(`${node.label}.${node.domain}.eth`)
            }
            const newNode = {
              ...node,
              id: `${node.label}.${node.domain}.eth`,
              owner,
              name: `${node.label}.${node.domain}.eth`,
              state: node.available ? 'Open' : 'Owned',
              price: utils.parseUnits(node.price, 'ether'),
              // eslint-disable-next-line @typescript-eslint/naming-convention
              __typename: 'SubDomain',
            }

            cachedNodes.push(newNode)
          })
          .catch((e) => console.log('ERROR in subdomain results', e)),
      )

      return Promise.all(promises).then(() => {
        return cachedNodes
      })
    },
  },
}

export default resolvers

export { defaults }
