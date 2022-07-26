export default class GqlManager {
  public gql: any = () => null
  public client?: any | null = null

  public setUrl = async (url: string | null) => {
    if (url) {
      const imported = await import('graphql-request')
      this.client = new imported.GraphQLClient(url)
      this.gql = imported.gql
    } else {
      this.client = null
      this.gql = () => null
    }
  }

  public request = (...arg: any[]) =>
    this.client ? this.client.request(...arg) : null
}
