import { describe, expect, it } from 'vitest'

import { createTransactionItem } from '@app/transaction-flow/transaction'

import { getSendNameTransactions } from './getSendNameTransactions'

describe('getSendNameTransactions', () => {
  it('should return 3 transactions (resetProfileWithRecords, transferName, transferName) if setEthRecord, resetProfile, sendManager and sendOwner is true', () => {
    expect(
      getSendNameTransactions({
        name: 'test.eth',
        recipient: '0xrecipient',
        transactions: {
          setEthRecord: true,
          resetProfile: true,
          sendManager: true,
          sendOwner: true,
        },
        abilities: {
          sendNameFunctionCallDetails: {
            sendOwner: {
              contract: 'registry',
              method: 'safeTransferFrom',
            },
            sendManager: {
              contract: 'registrar',
              method: 'reclaim',
            },
          },
        } as any,
        isOwnerOrManager: true,
        resolverAddress: '0xresolver',
      }),
    ).toEqual([
      createTransactionItem('resetProfileWithRecords', {
        name: 'test.eth',
        records: { coins: [{ coin: 'ETH', value: '0xrecipient' }] },
        resolverAddress: '0xresolver',
      }),
      createTransactionItem('transferName', {
        name: 'test.eth',
        newOwnerAddress: '0xrecipient',
        sendType: 'sendManager',
        contract: 'registrar',
        reclaim: true,
      }),
      createTransactionItem('transferName', {
        name: 'test.eth',
        newOwnerAddress: '0xrecipient',
        sendType: 'sendOwner',
        contract: 'registry',
      }),
    ])
  })

  it('should return 3 transactions (resetProfileWithRecords, transferName, transferName) if setEthRecord, resetProfile, sendManager and sendOwner is true', () => {
    expect(
      getSendNameTransactions({
        name: 'test.eth',
        recipient: '0xrecipient',
        transactions: {
          setEthRecord: false,
          resetProfile: true,
          sendManager: true,
          sendOwner: true,
        },
        abilities: {
          sendNameFunctionCallDetails: {
            sendOwner: {
              contract: 'registry',
              method: 'safeTransferFrom',
            },
            sendManager: {
              contract: 'registrar',
              method: 'safeTransferFrom',
            },
          },
        } as any,
        isOwnerOrManager: true,
        resolverAddress: '0xresolver',
      }),
    ).toEqual([
      createTransactionItem('resetProfileWithRecords', {
        name: 'test.eth',
        records: { coins: [{ coin: 'ETH', value: '0xrecipient' }] },
        resolverAddress: '0xresolver',
      }),
      createTransactionItem('transferName', {
        name: 'test.eth',
        newOwnerAddress: '0xrecipient',
        sendType: 'sendManager',
        contract: 'registrar',
        reclaim: false,
      }),
      createTransactionItem('transferName', {
        name: 'test.eth',
        newOwnerAddress: '0xrecipient',
        sendType: 'sendOwner',
        contract: 'registry',
      }),
    ])
  })

  it('should return 3 transactions (updateEthAddress, transferName, transferName) if resetProfile, sendManager and sendOwner is true', () => {
    expect(
      getSendNameTransactions({
        name: 'test.eth',
        recipient: '0xrecipient',
        transactions: {
          setEthRecord: true,
          resetProfile: false,
          sendManager: true,
          sendOwner: true,
        },
        abilities: {
          sendNameFunctionCallDetails: {
            sendOwner: {
              contract: 'registry',
              method: 'safeTransferFrom',
            },
            sendManager: {
              contract: 'registrar',
              method: 'reclaim',
            },
          },
        } as any,
        isOwnerOrManager: true,
        resolverAddress: '0xresolver',
      }),
    ).toEqual([
      createTransactionItem('updateEthAddress', { name: 'test.eth', address: '0xrecipient' }),
      createTransactionItem('transferName', {
        name: 'test.eth',
        newOwnerAddress: '0xrecipient',
        sendType: 'sendManager',
        contract: 'registrar',
        reclaim: true,
      }),
      createTransactionItem('transferName', {
        name: 'test.eth',
        newOwnerAddress: '0xrecipient',
        sendType: 'sendOwner',
        contract: 'registry',
      }),
    ])
  })

  it('should return 2 transactions (transferName, transferName) if sendManager and sendOwner is true', () => {
    expect(
      getSendNameTransactions({
        name: 'test.eth',
        recipient: '0xrecipient',
        transactions: {
          setEthRecord: false,
          resetProfile: false,
          sendManager: true,
          sendOwner: true,
        },
        abilities: {
          sendNameFunctionCallDetails: {
            sendOwner: {
              contract: 'registry',
              method: 'safeTransferFrom',
            },
            sendManager: {
              contract: 'registrar',
              method: 'reclaim',
            },
          },
        } as any,
        isOwnerOrManager: true,
        resolverAddress: '0xresolver',
      }),
    ).toEqual([
      createTransactionItem('transferName', {
        name: 'test.eth',
        newOwnerAddress: '0xrecipient',
        sendType: 'sendManager',
        contract: 'registrar',
        reclaim: true,
      }),
      createTransactionItem('transferName', {
        name: 'test.eth',
        newOwnerAddress: '0xrecipient',
        sendType: 'sendOwner',
        contract: 'registry',
      }),
    ])
  })

  it('should return 2 transactions (transferSubname, transferSubname) if sendManager and sendOwner is true and isOwnerOrManager is false', () => {
    expect(
      getSendNameTransactions({
        name: 'test.eth',
        recipient: '0xrecipient',
        transactions: {
          setEthRecord: false,
          resetProfile: false,
          sendManager: true,
          sendOwner: true,
        },
        abilities: {
          sendNameFunctionCallDetails: {
            sendOwner: {
              contract: 'registry',
              method: 'safeTransferFrom',
            },
            sendManager: {
              contract: 'registrar',
              method: 'reclaim',
            },
          },
        } as any,
        isOwnerOrManager: true,
        resolverAddress: '0xresolver',
      }),
    ).toEqual([
      createTransactionItem('transferName', {
        name: 'test.eth',
        newOwnerAddress: '0xrecipient',
        sendType: 'sendManager',
        contract: 'registrar',
        reclaim: true,
      }),
      createTransactionItem('transferName', {
        name: 'test.eth',
        newOwnerAddress: '0xrecipient',
        sendType: 'sendOwner',
        contract: 'registry',
      }),
    ])
  })

  it('should return 0 transactions if sendManager and sendOwner is true but abilities.sendNameFunctionCallDetails is undefined', () => {
    expect(
      getSendNameTransactions({
        name: 'test.eth',
        recipient: '0xrecipient',
        transactions: {
          setEthRecord: false,
          resetProfile: false,
          sendManager: true,
          sendOwner: true,
        },
        abilities: {
          sendNameFunctionCallDetails: undefined,
        } as any,
        isOwnerOrManager: true,
        resolverAddress: '0xresolver',
      }),
    ).toEqual([])
  })
})
