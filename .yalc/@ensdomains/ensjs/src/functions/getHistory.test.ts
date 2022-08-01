import { ENS } from '..'
import setup from '../tests/setup'

let ENSInstance: ENS

beforeAll(async () => {
  ;({ ENSInstance } = await setup())
  jest.setTimeout(20000)
})

describe('getHistory', () => {
  let textEventsWithValue: any[]

  it('should return null for a non-existent name', async () => {
    const result = await ENSInstance.getHistory('test123123cool.eth')
    expect(result).toBeUndefined()
  })
  it('should return the history of a name', async () => {
    const result = await ENSInstance.getHistory('jefflau.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result).toHaveProperty('domain')
      expect(result).toHaveProperty('resolver')
      expect(result).toHaveProperty('registration')
    }
  })
  describe('getHistoryWithDetail', () => {
    it('should return null for a non-existent name', async () => {
      const result = await ENSInstance.getHistoryWithDetail(
        'test123123cool.eth',
      )
      expect(result).toBeUndefined()
    })
    it('should return the history of a name with TextChanged event detail', async () => {
      const result = await ENSInstance.getHistoryWithDetail('jefflau.eth')
      expect(result).toBeTruthy()
      if (result) {
        const textEvents = result.resolver.filter(
          (x) => x.type === 'TextChanged',
        )
        textEvents.forEach((event) =>
          expect(event.data).toHaveProperty('value'),
        )
        textEventsWithValue = textEvents
      }
    })
  })
  describe('getHistoryDetailForTransactionHash', () => {
    it('should throw an error for an invalid transaction hash', async () => {
      try {
        await ENSInstance.getHistoryDetailForTransactionHash('0x234')
        expect(false).toBeTruthy()
      } catch (error) {
        expect((error as any).message).toContain('invalid hash')
      }
    })
    it('should return null for a transaction hash with no text events', async () => {
      const result = await ENSInstance.getHistoryDetailForTransactionHash(
        '0x0fd7b555e3076ef38dbbe2e40deefe44c9a0530d43f6b3f60dbed4ba49d229b7',
      )
      expect(result).toBeUndefined()
    })
    it('should return single item for a given transaction hash with one event', async () => {
      const eventToUse = textEventsWithValue[0]
      const result = (await ENSInstance.getHistoryDetailForTransactionHash(
        eventToUse.transactionHash,
      )) as { key: any; value: any }[]
      expect(result).toHaveLength(1)
      if (result) {
        expect(result[0]).toMatchObject(eventToUse.data)
      }
    })
    it('should return multiple items for a given transaction hash with multiple events', async () => {
      const hash =
        '0x002b7cc3c85168d885a38226a28fac349d13cbaff7f3db4fa3af31f22b863079'
      const dataArr = [
        { key: 'description', value: 'Not so super description' },
        { key: 'url', value: 'facebook.com' },
      ]
      const result = (await ENSInstance.getHistoryDetailForTransactionHash(
        hash,
      )) as { key: any; value: any }[]
      expect(result).toHaveLength(dataArr.length)
      if (result) {
        result.forEach((item, index) =>
          expect(item).toMatchObject(dataArr[index]),
        )
      }
    })
    it('should return a single item when an index is specified for a hash', async () => {
      const hash =
        '0x002b7cc3c85168d885a38226a28fac349d13cbaff7f3db4fa3af31f22b863079'
      const data = { key: 'url', value: 'facebook.com' }
      const result = (await ENSInstance.getHistoryDetailForTransactionHash(
        hash,
        1,
      )) as { key: any; value: any }
      expect(result).toMatchObject(data)
    })
  })
})
