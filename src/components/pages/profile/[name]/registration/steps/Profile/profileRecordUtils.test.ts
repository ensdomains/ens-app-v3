import { ProfileRecord } from '@app/constants/profileRecordOptions'

import { profileRecordsToRecordOptions } from './profileRecordUtils'

describe('profileRecordsToRecordOptions', () => {
  it('should convert profile records to record options', () => {
    const records: ProfileRecord[] = [
      { key: 'avatar', value: 'https://example.com/avatar.png', type: 'text', group: 'media' },
      { key: 'ETH', group: 'address', type: 'addr', value: '0x123' },
      { key: 'contentHash', group: 'other', type: 'contenthash', value: 'ipfs://' },
    ]
    const options = {
      texts: [{ key: 'avatar', value: 'https://example.com/avatar.png' }],
      coinTypes: [{ key: 'ETH', value: '0x123' }],
      contentHash: 'ipfs://',
      clearRecords: false,
    }
    expect(profileRecordsToRecordOptions(records)).toEqual(options)
  })

  it('should trim keys and values before converting to record options', () => {
    const records: ProfileRecord[] = [
      {
        key: '  avatar  ',
        value: '  https://example.com/avatar.png  ',
        type: 'text',
        group: 'media',
      },
      { key: '  ETH  ', group: 'address', type: 'addr', value: ' 0x123 ' },
      { key: '  contentHash ', group: 'other', type: 'contenthash', value: ' ipfs://  ' },
    ]
    const options = {
      texts: [{ key: 'avatar', value: 'https://example.com/avatar.png' }],
      coinTypes: [{ key: 'ETH', value: '0x123' }],
      contentHash: 'ipfs://',
      clearRecords: false,
    }
    expect(profileRecordsToRecordOptions(records)).toEqual(options)
  })

  it('should set clearRecords to true if option is set', () => {
    const records: ProfileRecord[] = [
      { key: 'avatar', value: 'https://example.com/avatar.png', type: 'text', group: 'media' },
      { key: 'ETH', group: 'address', type: 'addr', value: '0x123' },
      { key: 'contentHash', group: 'other', type: 'contenthash', value: 'ipfs://' },
    ]
    const options = {
      texts: [{ key: 'avatar', value: 'https://example.com/avatar.png' }],
      coinTypes: [{ key: 'ETH', value: '0x123' }],
      contentHash: 'ipfs://',
      clearRecords: true,
    }
    expect(profileRecordsToRecordOptions(records, true)).toEqual(options)
  })

  it('should remove empty records with empty values', () => {
    const records: ProfileRecord[] = [
      { key: 'avatar', value: 'https://example.com/avatar.png', type: 'text', group: 'media' },
      { key: 'name', value: '', type: 'text', group: 'general' },
      { key: 'ETH', group: 'address', type: 'addr', value: '0x123' },
      { key: '', group: 'custom', type: 'text', value: '0x123' },
      { key: 'test', group: 'custom', type: 'text', value: '' },
      { key: 'contentHash', group: 'other', type: 'contenthash', value: '' },
    ]
    const options = {
      texts: [{ key: 'avatar', value: 'https://example.com/avatar.png' }],
      coinTypes: [{ key: 'ETH', value: '0x123' }],
      clearRecords: true,
    }
    expect(profileRecordsToRecordOptions(records, true)).toEqual(options)
  })

  it('should favor last last value if there are duplicates', () => {
    const records: ProfileRecord[] = [
      { key: 'avatar', value: 'https://example.com/avatar.png', type: 'text', group: 'media' },
      { key: 'avatar', value: 'https://website.com/avatar.png', type: 'text', group: 'general' },
      { key: 'ETH', group: 'address', type: 'addr', value: '0x123' },
      { key: 'ETH', group: 'address', type: 'addr', value: '0x456' },
      { key: 'contentHash', group: 'other', type: 'contenthash', value: 'ipfs://' },
      { key: 'contentHash', group: 'other', type: 'contenthash', value: 'bzz://' },
    ]
    const options = {
      texts: [{ key: 'avatar', value: 'https://website.com/avatar.png' }],
      coinTypes: [{ key: 'ETH', value: '0x456' }],
      contentHash: 'bzz://',
      clearRecords: true,
    }
    expect(profileRecordsToRecordOptions(records, true)).toEqual(options)
  })
})
