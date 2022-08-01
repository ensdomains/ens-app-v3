import { ENS } from '..'
import setup from '../tests/setup'

let ENSInstance: ENS

beforeAll(async () => {
  ;({ ENSInstance } = await setup())
})

const testProperties = (obj: object, ...properties: string[]) =>
  properties.map((property) => expect(obj).toHaveProperty(property))

describe('getSubnames', () => {
  it('should get the subnames for a name', async () => {
    const result = await ENSInstance.getSubnames({
      name: 'jefflau.eth',
    })
    expect(result).toBeTruthy()
    expect(result.length).toBeGreaterThan(0)
    testProperties(
      result[0],
      'id',
      'labelName',
      'labelhash',
      'name',
      'isMigrated',
      'owner',
      'truncatedName',
    )
  })
})
