import type {
  Kind,
  parse as Parse,
  print as Print,
  SelectionSetNode,
  visit as Visit,
} from 'graphql'
import type { gql, GraphQLClient } from 'graphql-request'
import type Traverse from 'traverse'
import { debugSubgraphError } from './utils/errors'
import { namehash } from './utils/normalise'

const generateSelection = (selection: any) => ({
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

export const enter = (node: SelectionSetNode) => {
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
}

export const requestMiddleware =
  (visit: typeof Visit, parse: typeof Parse, print: typeof Print) =>
  (request: any) => {
    // Debug here because response middleware will resolve any error thrown
    debugSubgraphError(request)

    const requestBody = JSON.parse(request.body)
    const rawQuery = requestBody.query
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

export const responseMiddleware =
  (traverse: typeof Traverse) => (response: any) => {
    // If response is of type error, we do not need to further process it
    if (response instanceof Error) return response

    // eslint-disable-next-line func-names
    traverse(response).forEach(function (responseItem: any) {
      if (responseItem instanceof Object && responseItem.name) {
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
        if (responseItem.id !== hashedName) {
          this.update({ ...responseItem, name: hashedName, invalidName: true })
        }
      }
    })
    return response
  }

export default class GqlManager {
  // eslint-disable-next-line class-methods-use-this
  public gql: typeof gql | ((query: TemplateStringsArray) => string) = (
    query: TemplateStringsArray,
  ) => query.join()

  public client:
    | GraphQLClient
    | {
        request: () => Promise<null>
      } = {
    request: () => Promise.resolve(null),
  }

  public setUrl = async (url: string | null) => {
    if (url) {
      const [imported, traverse, { visit, parse, print }] = await Promise.all([
        import('graphql-request'),
        import('traverse'),
        import('graphql/language'),
      ])

      this.client = new imported.GraphQLClient(url, {
        requestMiddleware: requestMiddleware(visit, parse, print),
        responseMiddleware: responseMiddleware(traverse.default),
      })
      this.gql = imported.gql
    } else {
      this.client = {
        request: () => Promise.resolve(null),
      }
      this.gql = (query: TemplateStringsArray) => query.join()
    }
  }
}
