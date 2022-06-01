export default class GqlManager {
  constructor() {
    this.gql = () => null
    this.client = null
    this.setUrl = async (url) => {
      if (url) {
        const imported = await import('graphql-request')
        this.client = new imported.GraphQLClient(url)
        this.gql = imported.gql
      } else {
        this.client = null
        this.gql = () => null
      }
    }
    this.request = (...arg) =>
      this.client ? this.client.request(...arg) : null
  }
}
