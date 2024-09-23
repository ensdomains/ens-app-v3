import { describe, expect, it } from 'vitest'

import { ProfileRecord } from '@app/constants/profileRecordOptions'
import { Profile } from '@app/types'
import { createDateAndValue } from '@app/utils/utils'

import {
  getProfileRecordsDiff,
  profileRecordsToRecordOptions,
  profileToProfileRecords,
} from './profileRecordUtils'

describe('profileRecordsToRecordOptions', () => {
  it('should convert profile records to record options', () => {
    const records: ProfileRecord[] = [
      { key: 'avatar', value: 'https://example.com/avatar.png', type: 'text', group: 'media' },
      { key: 'ETH', group: 'address', type: 'addr', value: '0x123' },
      { key: 'contentHash', group: 'other', type: 'contenthash', value: 'ipfs://' },
    ]
    const options = {
      texts: [{ key: 'avatar', value: 'https://example.com/avatar.png' }],
      coins: [{ coin: 'ETH', value: '0x123' }],
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
      coins: [{ coin: 'ETH', value: '0x123' }],
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
      coins: [{ coin: 'ETH', value: '0x123' }],
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
      coins: [{ coin: 'ETH', value: '0x123' }],
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
      coins: [{ coin: 'ETH', value: '0x456' }],
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
      coins: [{ coin: 'ETH', value: '0x456' }],
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
      coins: [{ coin: 'ETH', value: '0x456' }],
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
      it('should add records with "empty value" for records that are in previous records but not in current records', () => {
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

describe('profileToProfileRecords', () => {
  describe('contenthash', () => {
    it('should correctly convert ipfs contenthash', () => {
      const profile: Profile = {
        contentHash: {
          protocolType: 'ipfs',
          decoded: 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4',
        },
        isMigrated: true,
        createdAt: createDateAndValue(new Date('2020-01-01T00:00:00.000Z').getTime()),
      }
      const records = [
        {
          key: 'eth',
          type: 'addr',
          group: 'address',
          value: '',
        },
        {
          key: 'ipfs',
          type: 'contenthash',
          group: 'website',
          value: 'ipfs://QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4',
        },
      ]
      expect(profileToProfileRecords(profile)).toEqual(records)
    })

    it('should correctly convert ipns contenthash', () => {
      const profile: Profile = {
        contentHash: {
          protocolType: 'ipns',
          decoded: 'k2k4r8kgnix5x0snul9112xdpqgiwc5xmvi8ja0szfhntep2d7qv8zz3',
        },
        isMigrated: true,
        createdAt: createDateAndValue(new Date('2020-01-01T00:00:00.000Z').getTime()),
      }
      const records = [
        {
          key: 'eth',
          type: 'addr',
          group: 'address',
          value: '',
        },
        {
          key: 'ipfs',
          type: 'contenthash',
          group: 'website',
          value: 'ipns://k2k4r8kgnix5x0snul9112xdpqgiwc5xmvi8ja0szfhntep2d7qv8zz3',
        },
      ]
      expect(profileToProfileRecords(profile)).toEqual(records)
    })

    it('should correctly convert sia contenthash', () => {
      const profile: Profile = {
        contentHash: {
          protocolType: 'sia',
          decoded: 'CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg',
        },
        isMigrated: true,
        createdAt: createDateAndValue(new Date('2020-01-01T00:00:00.000Z').getTime()),
      }
      const records = [
        {
          key: 'eth',
          type: 'addr',
          group: 'address',
          value: '',
        },
        {
          key: 'skynet',
          type: 'contenthash',
          group: 'website',
          value: 'sia://CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg',
        },
      ]
      expect(profileToProfileRecords(profile)).toEqual(records)
    })

    it('should correctly convert bzz contenthash', () => {
      const profile: Profile = {
        contentHash: {
          protocolType: 'bzz',
          decoded: 'CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg',
        },
        isMigrated: true,
        createdAt: createDateAndValue(new Date('2020-01-01T00:00:00.000Z').getTime()),
      }
      const records = [
        {
          key: 'eth',
          type: 'addr',
          group: 'address',
          value: '',
        },
        {
          key: 'swarm',
          type: 'contenthash',
          group: 'website',
          value: 'bzz://CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg',
        },
      ]
      expect(profileToProfileRecords(profile)).toEqual(records)
    })

    it('should correctly convert onion contenthash', () => {
      const profile: Profile = {
        contentHash: {
          protocolType: 'onion',
          decoded: 'CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg',
        },
        isMigrated: true,
        createdAt: createDateAndValue(new Date('2020-01-01T00:00:00.000Z').getTime()),
      }
      const records = [
        {
          key: 'eth',
          type: 'addr',
          group: 'address',
          value: '',
        },
        {
          key: 'onion',
          type: 'contenthash',
          group: 'website',
          value: 'onion://CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg',
        },
      ]
      expect(profileToProfileRecords(profile)).toEqual(records)
    })

    it('should correctly convert onion3 contenthash', () => {
      const profile: Profile = {
        contentHash: {
          protocolType: 'onion3',
          decoded: 'CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg',
        },
        isMigrated: true,
        createdAt: createDateAndValue(new Date('2020-01-01T00:00:00.000Z').getTime()),
      }
      const records = [
        {
          key: 'eth',
          type: 'addr',
          group: 'address',
          value: '',
        },
        {
          key: 'onion',
          type: 'contenthash',
          group: 'website',
          value: 'onion3://CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg',
        },
      ]
      expect(profileToProfileRecords(profile)).toEqual(records)
    })

    it('should correctly convert ar contenthash', () => {
      const profile: Profile = {
        contentHash: {
          protocolType: 'ar',
          decoded: 'CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg',
        },
        isMigrated: true,
        createdAt: createDateAndValue(new Date('2020-01-01T00:00:00.000Z').getTime()),
      }
      const records = [
        {
          key: 'eth',
          type: 'addr',
          group: 'address',
          value: '',
        },
        {
          key: 'arweave',
          type: 'contenthash',
          group: 'website',
          value: 'ar://CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg',
        },
      ]
      expect(profileToProfileRecords(profile)).toEqual(records)
    })

    it('should return empty if contenthash does not match', () => {
      const profile: Profile = {
        contentHash: {
          protocolType: 'notvalid' as any,
          decoded: 'CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg',
        },
        isMigrated: true,
        createdAt: createDateAndValue(new Date('2020-01-01T00:00:00.000Z').getTime()),
      }
      const records = [
        {
          key: 'eth',
          type: 'addr',
          group: 'address',
          value: '',
        },
      ]
      expect(profileToProfileRecords(profile)).toEqual(records)
    })
  })
})

describe('getProfileRecordsDiff', () => {
  it('should return an eth record with value = "" if the eth record is cleared', () => {
    const currentRecords: ProfileRecord[] = [
      {
        key: 'eth',
        type: 'addr',
        group: 'address',
        value: '',
      },
    ]

    const previousRecords: ProfileRecord[] = [
      {
        key: 'eth',
        type: 'addr',
        group: 'address',
        value: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      },
    ]
    const recordsDiff = getProfileRecordsDiff(currentRecords, previousRecords)
    expect(recordsDiff).toEqual([
      {
        key: 'eth',
        type: 'addr',
        group: 'address',
        value: '',
      },
    ])
  })

  it('should return an empty array if both records have an empty eth record', () => {
    const currentRecords: ProfileRecord[] = [
      {
        key: 'eth',
        type: 'addr',
        group: 'address',
        value: '',
      },
    ]

    const previousRecords: ProfileRecord[] = [
      {
        key: 'eth',
        type: 'addr',
        group: 'address',
        value: '',
      },
    ]
    const recordsDiff = getProfileRecordsDiff(currentRecords, previousRecords)
    expect(recordsDiff).toEqual([])
  })

  it('should return an eth record with new value if the eth record is updated', () => {
    const currentRecords: ProfileRecord[] = [
      {
        key: 'eth',
        type: 'addr',
        group: 'address',
        value: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      },
    ]

    const previousRecords: ProfileRecord[] = [
      {
        key: 'eth',
        type: 'addr',
        group: 'address',
        value: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      },
    ]
    const recordsDiff = getProfileRecordsDiff(currentRecords, previousRecords)
    expect(recordsDiff).toEqual([
      {
        key: 'eth',
        type: 'addr',
        group: 'address',
        value: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      },
    ])
  })

  it('should return an empty array if eth record exists but is not updated', () => {
    const currentRecords: ProfileRecord[] = [
      {
        key: 'eth',
        type: 'addr',
        group: 'address',
        value: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      },
    ]

    const previousRecords: ProfileRecord[] = [
      {
        key: 'eth',
        type: 'addr',
        group: 'address',
        value: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      },
    ]
    const recordsDiff = getProfileRecordsDiff(currentRecords, previousRecords)
    expect(recordsDiff).toEqual([])
  })
})
