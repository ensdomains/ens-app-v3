import type { Kind, SelectionNode, SelectionSetNode } from 'graphql'
import type { RequestMiddleware, ResponseMiddleware } from 'graphql-request'
import { GraphQLClient } from 'graphql-request'
import { parse, print, visit } from 'graphql/language/index.js'
import traverse from 'traverse'
import type { ClientWithEns } from '../../contracts/consts.js'
import { namehash } from '../../utils/normalise.js'

const generateSelection = (selection: string): SelectionNode => ({
  kind: 'Field' as Kind.FIELD,
  name: {
    kind: 'Name' as Kind.NAME,
    value: selection,
  },
  arguments: [],
  directives: [],
  alias: undefined,
  selectionSet: undefined,
})

const enter = (node: SelectionSetNode) => {
  let hasName = false
  let hasId = false

  for (const selection of node.selections) {
    if ('name' in selection) {
      if (selection.name.value === 'name') hasName = true
      else if (selection.name.value === 'id') hasId = true
    }
  }

  if (hasName && !hasId) {
    // eslint-disable-next-line no-param-reassign
    node.selections = [...node.selections, generateSelection('id')]
    return node
  }

  return undefined
}

export const requestMiddleware: RequestMiddleware = (request) => {
  if (!request.body) return request
  const requestBody = JSON.parse(request.body as string)
  const rawQuery = requestBody.query as string
  const parsedQuery = parse(rawQuery)
  const updatedQuery = visit(parsedQuery, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SelectionSet: {
      enter,
    },
  })

  return {
    ...request,
    body: JSON.stringify({ ...requestBody, query: print(updatedQuery) }),
  }
}

export const responseMiddleware: ResponseMiddleware = (response) => {
  traverse(response).forEach(function (responseItem: unknown) {
    if (
      responseItem instanceof Object &&
      'name' in responseItem &&
      responseItem.name &&
      typeof responseItem.name === 'string'
    ) {
      // Name already in hashed form
      if (responseItem.name && responseItem.name.includes('[')) {
        return
      }

      let hashedName = '[Invalid ENS Name]'
      try {
        hashedName = namehash(responseItem.name)
      } catch (e) {
        this.update({ ...responseItem, name: hashedName, invalidName: true })
        return
      }
      if ('id' in responseItem && responseItem.id !== hashedName) {
        this.update({ ...responseItem, name: hashedName, invalidName: true })
      }
    }
  })
}

export const createSubgraphClient = ({ client }: { client: ClientWithEns }) =>
  new GraphQLClient(client.chain.subgraphs.ens.url, {
    requestMiddleware,
    responseMiddleware,
  })
