import { describe, expect, it } from 'vitest'

import {
  checkContentHashEqual,
  checkProfileRecordsContains,
  checkProfileRecordsEqual,
  hasAvatarRecordChange,
  hasHeaderRecordChange,
  hasMediaRecordChange,
  makeProfileRecordsWithEthRecordItem,
  normalizeCoinName,
  profileRecordsToKeyValue,
} from './records'

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
    expect(checkContentHashEqual(undefined, {} as any)).toBe(true)
  })
})

describe('checkProfileRecordsEqual', () => {
  it('should return true if records are equal', () => {
    const records = {
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ id: 60, name: 'ETH', value: '0x123' }],
      contentHash: { protocolType: 'ipfs', decoded: '0x1234' } as const,
    }
    expect(checkProfileRecordsEqual(records, records)).toBe(true)
  })

  it('should return false if text record not equal', () => {
    const records = {
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ id: 60, name: 'ETH', value: '0x123' }],
      contentHash: { protocolType: 'ipfs', decoded: '0x1234' } as const,
    }
    const records2 = {
      texts: [{ key: 'key', value: 'value2' }],
      coins: [{ id: 60, name: 'ETH', value: '0x123' }],
      contentHash: { protocolType: 'ipfs', decoded: '0x1234' } as const,
    }
    expect(checkProfileRecordsEqual(records, records2)).toBe(false)
  })

  it('should return false if coinTypes record not equal', () => {
    const records = {
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ id: 60, name: 'ETH', value: '0x123' }],
      contentHash: { protocolType: 'ipfs', decoded: '0x1234' } as const,
    }
    const records2 = {
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ id: 60, name: 'ETH', value: '0x1234' }],
      contentHash: { protocolType: 'ipfs', decoded: '0x1234' } as const,
    }
    expect(checkProfileRecordsEqual(records, records2)).toBe(false)
  })

  it('should return false if content record not equal', () => {
    const records = {
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ id: 60, name: 'ETH', value: '0x123' }],
      contentHash: { protocolType: 'ipfs', decoded: '0x123' } as const,
    }
    const records2 = {
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ id: 60, name: 'ETH', value: '0x123' }],
      contentHash: { protocolType: 'ipfs', decoded: '0x1234' } as const,
    }
    expect(checkProfileRecordsEqual(records, records2)).toBe(false)
  })
})

describe('makeProfileRecordsWithEthRecordItem', () => {
  it('should append eth record item to profile records', () => {
    const profileRecords = {
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ id: 0, name: 'BTC', value: '0x123' }],
      contentHash: { protocolType: 'ipfs', decoded: '0x123' } as const,
    }
    expect(makeProfileRecordsWithEthRecordItem(profileRecords, '0x1234')).toEqual({
      texts: [{ key: 'key', value: 'value' }],
      coins: [
        { id: 0, name: 'BTC', value: '0x123' },
        { id: 60, name: 'ETH', value: '0x1234' },
      ],
      contentHash: { protocolType: 'ipfs', decoded: '0x123' },
    })
  })

  it('should replace existing eth record item in profile records', () => {
    const profileRecords = {
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ id: 60, name: 'ETH', value: '0x123' }],
      contentHash: { protocolType: 'ipfs', decoded: '0x123' } as const,
    }
    expect(makeProfileRecordsWithEthRecordItem(profileRecords, '0x1234')).toEqual({
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ id: 60, name: 'ETH', value: '0x1234' }],
      contentHash: { protocolType: 'ipfs', decoded: '0x123' },
    })
  })

  it('should do nothing if ethAddress is undefined', () => {
    const profileRecords = {
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ id: 0, name: 'BTC', value: '0x123' }],
      contentHash: { protocolType: 'ipfs', decoded: '0x123' } as const,
    }
    expect(makeProfileRecordsWithEthRecordItem(profileRecords, undefined)).toEqual(profileRecords)
  })
})

describe('profileRecordsToKeyValue', () => {
  it('should convert profile records to key value', async () => {
    const profileRecords = {
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ id: 60, name: 'ETH', value: '0x123' }],
      contentHash: { protocolType: 'ipfs', decoded: '0x123' } as const,
    }
    expect(await profileRecordsToKeyValue(profileRecords)).toEqual({
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ coin: 60, value: '0x123' }],
      contentHash: 'ipfs://0x123',
    })
  })

  it('should not include contentHash if it is null', async () => {
    const profileRecords = {
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ id: 60, name: 'ETH', value: '0x123' }],
      contentHash: null,
    }
    expect(await profileRecordsToKeyValue(profileRecords)).toEqual({
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ coin: 60, value: '0x123' }],
    })
  })
})

describe('checkProfileRecordsContains', () => {
  it('should return true if match is found in texts', () => {
    const records = {
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ id: 60, name: 'ETH', value: '0x123' }],
    }
    expect(
      checkProfileRecordsContains({
        profile: records,
        type: 'text',
        match: { key: 'key', value: 'value' },
      }),
    ).toBe(true)
  })

  it('should return true if match is found in coinTypes', () => {
    const records = {
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ id: 60, name: 'ETH', value: '0x123' }],
    }
    expect(
      checkProfileRecordsContains({
        profile: records,
        match: { id: 60, value: '0x123' },
        type: 'address',
      }),
    ).toBe(true)
  })

  it('should return false if match is not found in texts', () => {
    const records = {
      texts: [{ key: 'key', value: 'value2' }],
      coins: [{ id: 60, name: 'ETH', value: '0x123' }],
    }
    expect(
      checkProfileRecordsContains({
        profile: records,
        type: 'text',
        match: { key: 'key', value: 'value' },
      }),
    ).toBe(false)
  })

  it('should return false if match is not found in coinTypes', () => {
    const records = {
      texts: [{ key: 'key', value: 'value' }],
      coins: [{ id: 60, name: 'ETH', value: '0x1234' }],
    }
    expect(
      checkProfileRecordsContains({
        profile: records,
        match: { id: 60, value: '0x123' },
        type: 'address',
      }),
    ).toBe(false)
  })
})

describe('normalizeCoinName', () => {
  it('should convert coin name to lowercase', () => {
    expect(normalizeCoinName('eth')).toBe('eth')
    expect(normalizeCoinName('ETH')).toBe('eth')
    expect(normalizeCoinName('Bitcoin')).toBe('bitcoin')
  })

  it('should handle legacy suffix with lowercase', () => {
    expect(normalizeCoinName('ethlegacy')).toBe('ethLegacy')
    expect(normalizeCoinName('bitcoinlegacy')).toBe('bitcoinLegacy')
  })

  it('should handle legacy suffix with uppercase', () => {
    expect(normalizeCoinName('ETHLEGACY')).toBe('ethLegacy')
    expect(normalizeCoinName('BITCOINLEGACY')).toBe('bitcoinLegacy')
  })

  it('should handle legacy suffix with mixed case', () => {
    expect(normalizeCoinName('EthLegacy')).toBe('ethLegacy')
    expect(normalizeCoinName('BitcoinLegacy')).toBe('bitcoinLegacy')
    expect(normalizeCoinName('ETHLegacy')).toBe('ethLegacy')
    expect(normalizeCoinName('ethLEGACY')).toBe('ethLegacy')
  })

  it('should handle all caps coin names with legacy suffix', () => {
    expect(normalizeCoinName('BTCLEGACY')).toBe('btcLegacy')
    expect(normalizeCoinName('USDTLEGACY')).toBe('usdtLegacy')
    expect(normalizeCoinName('BNBLEGACY')).toBe('bnbLegacy')
  })

  it('should not add Legacy suffix if legacy is not at the end', () => {
    expect(normalizeCoinName('legacyeth')).toBe('legacyeth')
    expect(normalizeCoinName('ethlegacycoin')).toBe('ethlegacycoin')
  })

  it('should handle empty string', () => {
    expect(normalizeCoinName('')).toBe('')
  })

  it('should handle strings that are just "legacy" (no transformation)', () => {
    expect(normalizeCoinName('legacy')).toBe('legacy')
    expect(normalizeCoinName('LEGACY')).toBe('legacy')
    expect(normalizeCoinName('Legacy')).toBe('legacy')
  })

  it('should handle multiple legacy occurrences correctly', () => {
    expect(normalizeCoinName('legacylegacy')).toBe('legacyLegacy')
    expect(normalizeCoinName('ethlegacylegacy')).toBe('ethlegacyLegacy')
  })

  it('should handle special characters in coin names', () => {
    expect(normalizeCoinName('eth-legacy')).toBe('eth-Legacy')
    expect(normalizeCoinName('eth_legacy')).toBe('eth_Legacy')
    expect(normalizeCoinName('eth.legacy')).toBe('eth.Legacy')
  })

  it('should handle L2 network names with legacy suffix', () => {
    expect(normalizeCoinName('optimismlegacy')).toBe('optimismLegacy')
    expect(normalizeCoinName('OPTIMISMLEGACY')).toBe('optimismLegacy')
    expect(normalizeCoinName('arbitrumLegacy')).toBe('arbitrumLegacy')
    expect(normalizeCoinName('BASEGOERLILEGACY')).toBe('basegoerliLegacy')
  })

  it('should require at least one character before legacy suffix', () => {
    expect(normalizeCoinName('alegacy')).toBe('aLegacy')
    expect(normalizeCoinName('1legacy')).toBe('1Legacy')
    expect(normalizeCoinName('-legacy')).toBe('-Legacy')
    expect(normalizeCoinName(' legacy')).toBe(' Legacy')
  })

  it('should handle whitespace correctly', () => {
    expect(normalizeCoinName('  ETH  ')).toBe('  eth  ')
    expect(normalizeCoinName('  ETHlegacy  ')).toBe('  ethlegacy  ')
    expect(normalizeCoinName('  ETHlegacy')).toBe('  ethLegacy')
  })
})

describe('hasMediaRecordChange', () => {
  describe('avatar changes', () => {
    it('should return true when avatar is being added (has value, no previous)', () => {
      const records = [{ key: 'avatar', group: 'media', value: 'https://example.com/avatar.png' }]
      const previousRecords = undefined
      expect(hasMediaRecordChange('avatar', records, previousRecords)).toBe(true)
    })

    it('should return true when avatar is being updated (different values)', () => {
      const records = [{ key: 'avatar', group: 'media', value: 'https://example.com/new-avatar.png' }]
      const previousRecords = [{ key: 'avatar', group: 'media', value: 'https://example.com/old-avatar.png' }]
      expect(hasMediaRecordChange('avatar', records, previousRecords)).toBe(true)
    })

    it('should return true when avatar is being deleted (no value in current, has value in previous)', () => {
      const records: { key: string; group?: string; value?: string }[] = []
      const previousRecords = [{ key: 'avatar', group: 'media', value: 'https://example.com/avatar.png' }]
      expect(hasMediaRecordChange('avatar', records, previousRecords)).toBe(true)
    })

    it('should return true when avatar is being deleted (empty value in current, has value in previous)', () => {
      const records = [{ key: 'avatar', group: 'media', value: '' }]
      const previousRecords = [{ key: 'avatar', group: 'media', value: 'https://example.com/avatar.png' }]
      expect(hasMediaRecordChange('avatar', records, previousRecords)).toBe(true)
    })

    it('should return false when avatar is unchanged (same value in both)', () => {
      const records = [{ key: 'avatar', group: 'media', value: 'https://example.com/avatar.png' }]
      const previousRecords = [{ key: 'avatar', group: 'media', value: 'https://example.com/avatar.png' }]
      expect(hasMediaRecordChange('avatar', records, previousRecords)).toBe(false)
    })

    it('should return false when avatar is unchanged (not present in either)', () => {
      const records: { key: string; group?: string; value?: string }[] = []
      const previousRecords: { key: string; group?: string; value?: string }[] = []
      expect(hasMediaRecordChange('avatar', records, previousRecords)).toBe(false)
    })

    it('should return false when avatar is not in media group', () => {
      const records = [{ key: 'avatar', group: 'general', value: 'https://example.com/avatar.png' }]
      const previousRecords = undefined
      expect(hasMediaRecordChange('avatar', records, previousRecords)).toBe(false)
    })

    it('should return false when avatar has no group', () => {
      const records = [{ key: 'avatar', value: 'https://example.com/avatar.png' }]
      const previousRecords = undefined
      expect(hasMediaRecordChange('avatar', records, previousRecords)).toBe(false)
    })
  })

  describe('header changes', () => {
    it('should return true when header is being added', () => {
      const records = [{ key: 'header', group: 'media', value: 'https://example.com/header.png' }]
      const previousRecords = undefined
      expect(hasMediaRecordChange('header', records, previousRecords)).toBe(true)
    })

    it('should return true when header is being updated', () => {
      const records = [{ key: 'header', group: 'media', value: 'https://example.com/new-header.png' }]
      const previousRecords = [{ key: 'header', group: 'media', value: 'https://example.com/old-header.png' }]
      expect(hasMediaRecordChange('header', records, previousRecords)).toBe(true)
    })

    it('should return true when header is being deleted', () => {
      const records: { key: string; group?: string; value?: string }[] = []
      const previousRecords = [{ key: 'header', group: 'media', value: 'https://example.com/header.png' }]
      expect(hasMediaRecordChange('header', records, previousRecords)).toBe(true)
    })

    it('should return false when header is unchanged (same value)', () => {
      const records = [{ key: 'header', group: 'media', value: 'https://example.com/header.png' }]
      const previousRecords = [{ key: 'header', group: 'media', value: 'https://example.com/header.png' }]
      expect(hasMediaRecordChange('header', records, previousRecords)).toBe(false)
    })

    it('should return false when header is unchanged (not present in either)', () => {
      const records: { key: string; group?: string; value?: string }[] = []
      const previousRecords: { key: string; group?: string; value?: string }[] = []
      expect(hasMediaRecordChange('header', records, previousRecords)).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle undefined records', () => {
      expect(hasMediaRecordChange('avatar', undefined, undefined)).toBe(false)
    })

    it('should handle undefined records with previous records containing avatar', () => {
      const previousRecords = [{ key: 'avatar', group: 'media', value: 'https://example.com/avatar.png' }]
      expect(hasMediaRecordChange('avatar', undefined, previousRecords)).toBe(true)
    })

    it('should handle records with other keys only (avatar deleted)', () => {
      const records = [
        { key: 'email', group: 'general', value: 'test@example.com' },
        { key: 'twitter', group: 'social', value: '@test' },
      ]
      const previousRecords = [{ key: 'avatar', group: 'media', value: 'https://example.com/avatar.png' }]
      expect(hasMediaRecordChange('avatar', records, previousRecords)).toBe(true)
    })

    it('should not detect avatar change when only header changes', () => {
      const records = [{ key: 'header', group: 'media', value: 'https://example.com/header.png' }]
      const previousRecords: { key: string; group?: string; value?: string }[] = []
      expect(hasMediaRecordChange('avatar', records, previousRecords)).toBe(false)
    })

    it('should treat undefined value same as empty string', () => {
      const records = [{ key: 'avatar', group: 'media', value: undefined }]
      const previousRecords = [{ key: 'avatar', group: 'media', value: '' }]
      expect(hasMediaRecordChange('avatar', records, previousRecords)).toBe(false)
    })

    it('should treat missing value property same as empty string', () => {
      const records = [{ key: 'avatar', group: 'media' }]
      const previousRecords = [{ key: 'avatar', group: 'media', value: '' }]
      expect(hasMediaRecordChange('avatar', records, previousRecords)).toBe(false)
    })
  })
})

describe('hasAvatarRecordChange', () => {
  it('should return true when avatar is being added', () => {
    const records = [{ key: 'avatar', group: 'media', value: 'https://example.com/avatar.png' }]
    expect(hasAvatarRecordChange(records, undefined)).toBe(true)
  })

  it('should return true when avatar is being deleted', () => {
    const records: { key: string; group?: string; value?: string }[] = []
    const previousRecords = [{ key: 'avatar', group: 'media', value: 'https://example.com/avatar.png' }]
    expect(hasAvatarRecordChange(records, previousRecords)).toBe(true)
  })

  it('should return true when avatar value changes', () => {
    const records = [{ key: 'avatar', group: 'media', value: 'https://example.com/new.png' }]
    const previousRecords = [{ key: 'avatar', group: 'media', value: 'https://example.com/old.png' }]
    expect(hasAvatarRecordChange(records, previousRecords)).toBe(true)
  })

  it('should return false when avatar is unchanged', () => {
    const records = [{ key: 'avatar', group: 'media', value: 'https://example.com/avatar.png' }]
    const previousRecords = [{ key: 'avatar', group: 'media', value: 'https://example.com/avatar.png' }]
    expect(hasAvatarRecordChange(records, previousRecords)).toBe(false)
  })

  it('should return false when neither has avatar', () => {
    expect(hasAvatarRecordChange([], [])).toBe(false)
  })
})

describe('hasHeaderRecordChange', () => {
  it('should return true when header is being added', () => {
    const records = [{ key: 'header', group: 'media', value: 'https://example.com/header.png' }]
    expect(hasHeaderRecordChange(records, undefined)).toBe(true)
  })

  it('should return true when header is being deleted', () => {
    const records: { key: string; group?: string; value?: string }[] = []
    const previousRecords = [{ key: 'header', group: 'media', value: 'https://example.com/header.png' }]
    expect(hasHeaderRecordChange(records, previousRecords)).toBe(true)
  })

  it('should return true when header value changes', () => {
    const records = [{ key: 'header', group: 'media', value: 'https://example.com/new.png' }]
    const previousRecords = [{ key: 'header', group: 'media', value: 'https://example.com/old.png' }]
    expect(hasHeaderRecordChange(records, previousRecords)).toBe(true)
  })

  it('should return false when header is unchanged', () => {
    const records = [{ key: 'header', group: 'media', value: 'https://example.com/header.png' }]
    const previousRecords = [{ key: 'header', group: 'media', value: 'https://example.com/header.png' }]
    expect(hasHeaderRecordChange(records, previousRecords)).toBe(false)
  })

  it('should return false when header is unchanged', () => {
    expect(hasHeaderRecordChange([], [])).toBe(false)
  })
})
