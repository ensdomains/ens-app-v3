import { ProfileRecord } from '@app/constants/profileRecordOptions'

import { getProfileRecordsDiff, profileRecordsToRecordOptions } from './profileRecordUtils'

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

  it('should remove records with empty key', () => {
    const records: ProfileRecord[] = [
      { key: 'avatar', value: 'https://example.com/avatar.png', type: 'text', group: 'media' },
      { key: 'name', value: '', type: 'text', group: 'general' },
      { key: 'ETH', group: 'address', type: 'addr', value: '0x123' },
      { key: '', group: 'custom', type: 'text', value: '0x123' },
      { key: 'test', group: 'custom', type: 'text', value: '' },
      { key: 'contentHash', group: 'other', type: 'contenthash', value: '' },
    ]
    const options = {
      texts: [
        { key: 'avatar', value: 'https://example.com/avatar.png' },
        { key: 'name', value: '' },
        { key: 'test', value: '' },
      ],
      coinTypes: [{ key: 'ETH', value: '0x123' }],
      contentHash: '',
      clearRecords: true,
    }
    expect(profileRecordsToRecordOptions(records, true)).toEqual(options)
  })

  it('should favor last last value if there are duplicates (except for avatar)', () => {
    const records: ProfileRecord[] = [
      { key: 'avatar', value: 'https://example.com/avatar.png', type: 'text', group: 'media' },
      { key: 'avatar', value: 'https://website.com/avatar.png', type: 'text', group: 'custom' },
      { key: 'ETH', group: 'address', type: 'addr', value: '0x123' },
      { key: 'ETH', group: 'address', type: 'addr', value: '0x456' },
      { key: 'contentHash', group: 'other', type: 'contenthash', value: 'ipfs://' },
      { key: 'contentHash', group: 'other', type: 'contenthash', value: 'bzz://' },
    ]
    const options = {
      texts: [{ key: 'avatar', value: 'https://example.com/avatar.png' }],
      coinTypes: [{ key: 'ETH', value: '0x456' }],
      contentHash: 'bzz://',
      clearRecords: true,
    }
    expect(profileRecordsToRecordOptions(records, true)).toEqual(options)
  })

  it('should pick the non-empty avatar record if there is two avatar records present', () => {
    const records: ProfileRecord[] = [
      { key: 'avatar', value: '', type: 'text', group: 'media' },
      { key: 'avatar', value: 'https://website.com/avatar.png', type: 'text', group: 'custom' },
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

    const records2: ProfileRecord[] = [
      { key: 'avatar', value: 'https://website.com/avatar.png', type: 'text', group: 'media' },
      { key: 'avatar', value: '', type: 'text', group: 'custom' },
      { key: 'ETH', group: 'address', type: 'addr', value: '0x123' },
      { key: 'ETH', group: 'address', type: 'addr', value: '0x456' },
      { key: 'contentHash', group: 'other', type: 'contenthash', value: 'ipfs://' },
      { key: 'contentHash', group: 'other', type: 'contenthash', value: 'bzz://' },
    ]
    expect(profileRecordsToRecordOptions(records2, true)).toEqual(options)
  })

  it('should pick avatar from media group if both avatar records are present', () => {
    const records: ProfileRecord[] = [
      { key: 'avatar', value: 'https://website.com/mediaAvatar.png', type: 'text', group: 'media' },
      { key: 'avatar', value: 'https://website.com/avatar.png', type: 'text', group: 'custom' },
      { key: 'ETH', group: 'address', type: 'addr', value: '0x123' },
      { key: 'ETH', group: 'address', type: 'addr', value: '0x456' },
      { key: 'contentHash', group: 'other', type: 'contenthash', value: 'ipfs://' },
      { key: 'contentHash', group: 'other', type: 'contenthash', value: 'bzz://' },
    ]
    const options = {
      texts: [{ key: 'avatar', value: 'https://website.com/mediaAvatar.png' }],
      coinTypes: [{ key: 'ETH', value: '0x456' }],
      contentHash: 'bzz://',
      clearRecords: true,
    }
    expect(profileRecordsToRecordOptions(records, true)).toEqual(options)
  })

  describe('getProfileRecordSubmission', () => {
    describe('without previous records', () => {
      it('should filter records without values ', () => {
        const records: ProfileRecord[] = [
          {
            key: 'avatar',
            value: 'https://example.com/avatar.png',
            type: 'text',
            group: 'media',
          },
          {
            key: 'name',
            value: '',
            type: 'text',
            group: 'general',
          },
        ]
        const result: ProfileRecord[] = [
          {
            key: 'avatar',
            value: 'https://example.com/avatar.png',
            type: 'text',
            group: 'media',
          },
        ]
        expect(getProfileRecordsDiff(records)).toEqual(result)
      })

      it('should return expected value', () => {
        const records: ProfileRecord[] = [
          {
            key: 'avatar',
            value: 'https://example.com/avatar.png',
            type: 'text',
            group: 'media',
          },
          {
            key: 'name',
            value: 'example',
            type: 'text',
            group: 'general',
          },
          {
            key: 'empty',
            value: '',
            type: 'text',
            group: 'custom',
          },
        ]
        const result: ProfileRecord[] = [
          {
            key: 'avatar',
            value: 'https://example.com/avatar.png',
            type: 'text',
            group: 'media',
          },
          {
            key: 'name',
            value: 'example',
            type: 'text',
            group: 'general',
          },
        ]
        expect(getProfileRecordsDiff(records)).toEqual(result)
      })
    })
    describe('with previous records', () => {
      it('should filter out current records that are empty and not in previous record', () => {
        const currentRecords: ProfileRecord[] = [
          {
            key: 'avatar',
            value: '',
            type: 'text',
            group: 'media',
          },
          {
            key: 'name',
            value: '',
            type: 'text',
            group: 'general',
          },
          {
            key: 'twitter',
            value: '',
            type: 'text',
            group: 'social',
          },
          {
            key: 'ETH',
            value: '',
            type: 'addr',
            group: 'address',
          },
          {
            key: 'ipfs',
            value: '',
            type: 'contenthash',
            group: 'website',
          },
          {
            key: 'pubkey',
            value: '',
            type: 'abi',
            group: 'other',
          },
        ]
        const previousRecords: ProfileRecord[] = []
        const result: ProfileRecord[] = []
        expect(getProfileRecordsDiff(currentRecords, previousRecords)).toEqual(result)
      })
      it('should add records with empty string for records that are in previous records but not in current records', () => {
        const currentRecords: ProfileRecord[] = []
        const previousRecords: ProfileRecord[] = [
          {
            key: 'avatar',
            value: 'https://example.com/avatar.png',
            type: 'text',
            group: 'media',
          },
          {
            key: 'name',
            value: 'John Doe',
            type: 'text',
            group: 'general',
          },
          {
            key: 'twitter',
            value: 'john_doe',
            type: 'text',
            group: 'social',
          },
          {
            key: 'ETH',
            value: '0x123',
            type: 'addr',
            group: 'address',
          },
          {
            key: 'ipfs',
            value: 'ipfs://contentid',
            type: 'contenthash',
            group: 'website',
          },
          {
            key: 'pubkey',
            value: 'asddddd',
            type: 'abi',
            group: 'other',
          },
          {
            key: 'email',
            value: 'johndoe@email.com',
            type: 'text',
            group: 'custom',
          },
        ]
        const result = [
          {
            key: 'avatar',
            value: '',
            type: 'text',
            group: 'media',
          },
          {
            key: 'name',
            value: '',
            type: 'text',
            group: 'general',
          },
          {
            key: 'twitter',
            value: '',
            type: 'text',
            group: 'social',
          },
          {
            key: 'ETH',
            value: '',
            type: 'addr',
            group: 'address',
          },
          {
            key: 'ipfs',
            value: '',
            type: 'contenthash',
            group: 'website',
          },
          {
            key: 'pubkey',
            value: '',
            type: 'abi',
            group: 'other',
          },
          {
            key: 'email',
            value: '',
            type: 'text',
            group: 'custom',
          },
        ]

        expect(getProfileRecordsDiff(currentRecords, previousRecords)).toEqual(result)
      })
      it('should add records that are in previous and current records but have different values', () => {
        const currentRecords: ProfileRecord[] = [
          {
            key: 'avatar',
            value: 'https://example.com/avatar.png',
            type: 'text',
            group: 'media',
          },
          {
            key: 'name',
            value: 'John Doe',
            type: 'text',
            group: 'general',
          },
          {
            key: 'twitter',
            value: 'john_doe',
            type: 'text',
            group: 'social',
          },
          {
            key: 'ETH',
            value: '0x123',
            type: 'addr',
            group: 'address',
          },
          {
            key: 'ipfs',
            value: 'ipfs://contentid',
            type: 'contenthash',
            group: 'website',
          },
          {
            key: 'pubkey',
            value: 'asddddd',
            type: 'abi',
            group: 'other',
          },
          {
            key: 'email',
            value: 'johndoe@email.com',
            type: 'text',
            group: 'custom',
          },
        ]
        const previousRecords: ProfileRecord[] = [
          {
            key: 'avatar',
            value: 'https://example.com/avatar2.png',
            type: 'text',
            group: 'media',
          },
          {
            key: 'name',
            value: 'John Doe II',
            type: 'text',
            group: 'general',
          },
          {
            key: 'twitter',
            value: 'john_doe_ii',
            type: 'text',
            group: 'social',
          },
          {
            key: 'ETH',
            value: '0x123456',
            type: 'addr',
            group: 'address',
          },
          {
            key: 'ipfs',
            value: 'ipfs://contentid2',
            type: 'contenthash',
            group: 'website',
          },
          {
            key: 'pubkey',
            value: 'asddddd2',
            type: 'abi',
            group: 'other',
          },
          {
            key: 'email',
            value: 'johndoeii@email.com',
            type: 'text',
            group: 'custom',
          },
        ]

        expect(getProfileRecordsDiff(currentRecords, previousRecords)).toEqual(currentRecords)
      })
    })

    it('should not add records if they are in both current and previous records but their values are the same', () => {
      const records: ProfileRecord[] = [
        {
          key: 'avatar',
          value: 'https://example.com/avatar2.png',
          type: 'text',
          group: 'media',
        },
        {
          key: 'name',
          value: 'John Doe II',
          type: 'text',
          group: 'general',
        },
        {
          key: 'twitter',
          value: 'john_doe_ii',
          type: 'text',
          group: 'social',
        },
        {
          key: 'ETH',
          value: '0x123456',
          type: 'addr',
          group: 'address',
        },
        {
          key: 'ipfs',
          value: 'ipfs://contentid2',
          type: 'contenthash',
          group: 'website',
        },
        {
          key: 'pubkey',
          value: 'asddddd2',
          type: 'abi',
          group: 'other',
        },
        {
          key: 'email',
          value: 'johndoeii@email.com',
          type: 'text',
          group: 'custom',
        },
      ]
      expect(getProfileRecordsDiff(records, records)).toEqual([])
    })

    it('should return the correct result with a mixture of conditions above', () => {
      const currentRecords: ProfileRecord[] = [
        {
          key: 'updated',
          value: 'updated',
          type: 'text',
          group: 'custom',
        },
        {
          key: 'noChange',
          value: 'noChange',
          type: 'text',
          group: 'custom',
        },
        {
          key: 'added',
          value: 'added',
          type: 'text',
          group: 'custom',
        },
      ]

      const previousRecords: ProfileRecord[] = [
        {
          key: 'updated',
          value: 'not_updated',
          type: 'text',
          group: 'custom',
        },
        {
          key: 'noChange',
          value: 'noChange',
          type: 'text',
          group: 'custom',
        },
        {
          key: 'deleted',
          value: 'deleted',
          type: 'text',
          group: 'custom',
        },
      ]

      const result = [
        {
          key: 'updated',
          value: 'updated',
          type: 'text',
          group: 'custom',
        },
        {
          key: 'added',
          value: 'added',
          type: 'text',
          group: 'custom',
        },
        {
          key: 'deleted',
          value: '',
          type: 'text',
          group: 'custom',
        },
      ]
      expect(getProfileRecordsDiff(currentRecords, previousRecords)).toEqual(result)
    })
  })
})
