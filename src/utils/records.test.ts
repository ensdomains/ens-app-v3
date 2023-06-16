import { RecordItem } from '@app/types'

import {
  checkContentHashEqual,
  checkProfileRecordsContains,
  checkProfileRecordsEqual,
  checkRecordsEqual,
  makeProfileRecordsWithEthRecordItem,
  mergeProfileRecords,
  mergeRecords,
  profileRecordsToKeyValue,
} from './records'

describe('mergeRecords', () => {
  it('should merge records as with the second record taking precedence', () => {
    expect(
      mergeRecords(
        [{ key: 'key', value: 'value', type: 'text' }],
        [{ key: 'key', value: 'value2', type: 'text' }],
      ),
    ).toEqual([{ key: 'key', value: 'value2', type: 'text' }])
  })

  it('should work if either records is undefined', () => {
    expect(mergeRecords(undefined, [{ key: 'key', value: 'value2', type: 'text' }])).toEqual([
      { key: 'key', value: 'value2', type: 'text' },
    ])
    expect(mergeRecords([{ key: 'key', value: 'value', type: 'text' }], undefined)).toEqual([
      { key: 'key', value: 'value', type: 'text' },
    ])
  })
})

describe('checkRecordsEqual', () => {
  it('should return true if text records are equal', () => {
    const records: RecordItem[] = [{ key: 'key', value: 'value', type: 'text' }]
    expect(checkRecordsEqual('texts')(records, records)).toBe(true)
  })

  it('should return true if coinType records are equal', () => {
    const records: any[] = [{ key: 'key', value: 'value', type: 'addr', addr: '0x123' }]
    expect(checkRecordsEqual('coinTypes')(records, records)).toBe(true)
  })

  it('should return false if text records are not equal', () => {
    const records: RecordItem[] = [{ key: 'key', value: 'value', type: 'text' }]
    const records2: RecordItem[] = [{ key: 'key', value: 'value2', type: 'text' }]
    expect(checkRecordsEqual('texts')(records, records2)).toBe(false)
  })

  it('should return false if coinType records are not equal', () => {
    const records: any[] = [{ key: 'key', value: 'value', type: 'addr', addr: '0x123' }]
    const records2: any[] = [{ key: 'key', value: 'value', type: 'addr', addr: '0x1234' }]
    expect(checkRecordsEqual('coinTypes')(records, records2)).toBe(false)
  })
})

describe('checkContentHashEqual', () => {
  it('should return true if contentHashes are equal strings', () => {
    expect(checkContentHashEqual('0x123', '0x123')).toBe(true)
  })

  it('should return true if contentHashes are equal objects', () => {
    expect(
      checkContentHashEqual(
        { protocolType: 'ipfs', decoded: '123' },
        { protocolType: 'ipfs', decoded: '123' },
      ),
    ).toBe(true)
  })

  it('should return true if contentHashes are equal but one is object and one is string', () => {
    expect(checkContentHashEqual({ protocolType: 'ipfs', decoded: '123' }, 'ipfs://123')).toBe(true)
  })

  it('should return false if contentHashes are not equal', () => {
    expect(checkContentHashEqual('0x123', '0x1234')).toBe(false)
  })

  it('should return true if contentHashes are undefined', () => {
    expect(checkContentHashEqual(undefined, undefined)).toBe(true)
  })

  it('should return true if one contentHash is undefined and the other is null', () => {
    expect(checkContentHashEqual(undefined, null)).toBe(true)
  })

  it('should return true if one contentHash is undefined and the other is empty object', () => {
    expect(checkContentHashEqual(undefined, {})).toBe(true)
  })
})

describe('checkProfileRecordsEqual', () => {
  it('should return true if records are equal', () => {
    const records: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: 'key', value: 'value', type: 'addr', addr: '0x123' }],
      contentHash: '0x123',
    }
    expect(checkProfileRecordsEqual(records, records)).toBe(true)
  })

  it('should return false if text record not equal', () => {
    const records: any = {
      texts: [{ key: 'key', value: 'value2', type: 'text' }],
      coinTypes: [{ key: 'key', value: 'value', type: 'addr', addr: '0x123' }],
      contentHash: '0x123',
    }
    const records2: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: 'key', value: 'value', type: 'addr', addr: '0x123' }],
      contentHash: '0x123',
    }
    expect(checkProfileRecordsEqual(records, records2)).toBe(false)
  })

  it('should return false if coinTypes record not equal', () => {
    const records: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: 'key', value: 'value', type: 'addr', addr: '0x123' }],
      contentHash: '0x123',
    }
    const records2: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: 'key', value: 'value', type: 'addr', addr: '0x1234' }],
      contentHash: '0x123',
    }
    expect(checkProfileRecordsEqual(records, records2)).toBe(false)
  })

  it('should return false if text record not equal', () => {
    const records: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: 'key', value: 'value', type: 'addr', addr: '0x123' }],
      contentHash: '0x123',
    }
    const records2: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: 'key', value: 'value', type: 'addr', addr: '0x123' }],
      contentHash: '0x1234',
    }
    expect(checkProfileRecordsEqual(records, records2)).toBe(false)
  })
})

describe('mergeProfileRecords', () => {
  it('should merge records', () => {
    const profileRecords: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: 'key', coin: 'ETH', type: 'addr', addr: '0x123' }],
      contentHash: '0x123',
    }
    expect(mergeProfileRecords(profileRecords, profileRecords)).toEqual(profileRecords)
  })

  it('should merge records with right value overriding left', () => {
    const profileRecords: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: 'key', coin: 'ETH', type: 'addr', addr: '0x123' }],
      contentHash: '0x123',
    }
    const profileRecords2: any = {
      texts: [{ key: 'key', value: 'value2', type: 'text' }],
      coinTypes: [{ key: 'key', coin: 'ETH', type: 'addr', addr: '0x1234' }],
      contentHash: '0x1234',
    }
    expect(mergeProfileRecords(profileRecords, profileRecords2)).toEqual(profileRecords2)
  })

  it('should append records that do not have a match', () => {
    const profileRecords: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: 'key', coin: 'ETH', type: 'addr', addr: '0x123' }],
      contentHash: '0x123',
    }
    const profileRecords2: any = {
      texts: [{ key: 'key1', value: 'value2', type: 'text' }],
      coinTypes: [{ key: 'key2', coin: 'ETH', type: 'addr', addr: '0x1234' }],
      contentHash: '0x1234',
    }
    expect(mergeProfileRecords(profileRecords, profileRecords2)).toEqual({
      texts: [
        { key: 'key', value: 'value', type: 'text' },
        { key: 'key1', value: 'value2', type: 'text' },
      ],
      coinTypes: [
        { key: 'key', coin: 'ETH', type: 'addr', addr: '0x123' },
        { key: 'key2', coin: 'ETH', type: 'addr', addr: '0x1234' },
      ],
      contentHash: '0x1234',
    })
  })

  it('should not merge contenthash if it is falsy', () => {
    const profileRecords: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: 'key', coin: 'ETH', type: 'addr', addr: '0x123' }],
      contentHash: '0x123',
    }
    const profileRecords2: any = {
      contentHash: '',
    }
    expect(mergeProfileRecords(profileRecords, profileRecords2)).toEqual(profileRecords)
  })
})

describe('makeProfileRecordsWithEthRecordItem', () => {
  it('should append eth record item to profile records', () => {
    const profileRecords: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: 'key', coin: 'BTC', type: 'addr', addr: '0x123' }],
      contentHash: '0x123',
    }
    expect(makeProfileRecordsWithEthRecordItem(profileRecords, '0x1234')).toEqual({
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [
        { key: 'key', coin: 'BTC', type: 'addr', addr: '0x123' },
        { key: '60', coin: 'ETH', type: 'addr', addr: '0x1234' },
      ],
      contentHash: '0x123',
    })
  })

  it('should replace existing eth record item in profile records', () => {
    const profileRecords: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: '60', coin: 'ETH', type: 'addr', addr: '0x123' }],
      contentHash: '0x123',
    }
    expect(makeProfileRecordsWithEthRecordItem(profileRecords, '0x1234')).toEqual({
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: '60', coin: 'ETH', type: 'addr', addr: '0x1234' }],
      contentHash: '0x123',
    })
  })

  it('should do nothing if ethAddress is undefined', () => {
    const profileRecords: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: 'key', coin: 'BTC', type: 'addr', addr: '0x123' }],
      contentHash: '0x123',
    }
    expect(makeProfileRecordsWithEthRecordItem(profileRecords, undefined)).toEqual(profileRecords)
  })
})

describe('profileRecordsToKeyValue', () => {
  it('should convert profile records to key value', () => {
    const profileRecords: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: '60', coin: 'ETH', type: 'addr', addr: '0x123' }],
      contentHash: '0x123',
    }
    expect(profileRecordsToKeyValue(profileRecords)).toEqual({
      texts: [{ key: 'key', value: 'value' }],
      coinTypes: [{ key: '60', value: '0x123' }],
      contentHash: '0x123',
    })
  })

  it('should not include contentHash if it is empty string', () => {
    const profileRecords: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: '60', coin: 'ETH', type: 'addr', addr: '0x123' }],
      contentHash: '',
    }
    expect(profileRecordsToKeyValue(profileRecords)).toEqual({
      texts: [{ key: 'key', value: 'value' }],
      coinTypes: [{ key: '60', value: '0x123' }],
    })
  })
})

describe('checkProfileRecordsContains', () => {
  it('should return true if match is found in texts', () => {
    const records: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: '60', coin: 'ETH', type: 'addr', addr: '0x123' }],
    }
    expect(checkProfileRecordsContains(records, { key: 'key', value: 'value', type: 'text' })).toBe(
      true,
    )
  })

  it('should return true if match is found in coinTypes', () => {
    const records: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: '60', coin: 'ETH', type: 'addr', addr: '0x123' }],
    }
    expect(checkProfileRecordsContains(records, { key: '60', addr: '0x123', type: 'addr' })).toBe(
      true,
    )
  })

  it('should return false if match is not found in texts', () => {
    const records: any = {
      texts: [{ key: 'key', value: 'value2', type: 'text' }],
      coinTypes: [{ key: '60', coin: 'ETH', type: 'addr', addr: '0x123' }],
    }
    expect(checkProfileRecordsContains(records, { key: 'key', value: 'value', type: 'text' })).toBe(
      false,
    )
  })

  it('should return false if match is not found in coinTypes', () => {
    const records: any = {
      texts: [{ key: 'key', value: 'value', type: 'text' }],
      coinTypes: [{ key: '60', coin: 'ETH', type: 'addr', addr: '0x1234' }],
    }
    expect(checkProfileRecordsContains(records, { key: '60', addr: '0x123', type: 'addr' })).toBe(
      false,
    )
  })
})
