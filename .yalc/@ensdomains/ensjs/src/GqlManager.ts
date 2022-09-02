import type {
  Kind,
  parse as Parse,
  print as Print,
  SelectionSetNode,
  visit as Visit,
} from 'graphql'
import type Traverse from 'traverse'
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
    node.selections = [...node.selections, generateSelection('id')]
    return node
  }
}

export const requestMiddleware =
  (visit: typeof Visit, parse: typeof Parse, print: typeof Print) =>
  (request: any) => {
    const requestBody = JSON.parse(request.body)
    const rawQuery = requestBody.query
    const parsedQuery = parse(rawQuery)
    const updatedQuery = visit(parsedQuery, {
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
    traverse(response).forEach(function (responseItem: any) {
      if (responseItem instanceof Object && responseItem.name) {
        //Name already in hashed form
        if (responseItem.name && responseItem.name.includes('[')) {
          return
        }

        const hashedName = namehash(responseItem.name)
        if (responseItem.id !== hashedName) {
          this.update({ ...responseItem, name: hashedName, invalidName: true })
        }
      }
    })
    return response
  }

export default class GqlManager {
  public gql: any = () => null
  public client?: any | null = null

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
      this.client = null
      this.gql = () => null
    }
  }

  public request = (...arg: any[]) =>
    this.client ? this.client.request(...arg) : null
}
