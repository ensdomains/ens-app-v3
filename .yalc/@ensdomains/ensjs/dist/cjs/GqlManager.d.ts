export default class GqlManager {
  gql: any
  client?: any | null
  setUrl: (url: string | null) => Promise<void>
  request: (...arg: any[]) => any
}
