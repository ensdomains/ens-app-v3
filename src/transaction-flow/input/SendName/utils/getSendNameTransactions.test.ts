import { getSendNameTransactions } from './getSendNameTransactions';
import { makeTransactionItem } from '@app/transaction-flow/transaction';

describe('getSendNameTransactions', () => {
  it('should return 3 transactions (resetProfileWithRecords, transferName, transferName) if setEthRecord, resetProfile, sendManager and sendOwner is true', () => {
    expect(getSendNameTransactions({
      name: 'test.eth',
      recipient:'0xrecipient',
      transactions: {
        setEthRecord: true,
        resetProfile: true,
        sendManager: true,
        sendOwner: true
      },
      abilities: {
        sendNameFunctionCallDetails: {
          sendOwner: {
            contract: 'registry',
            method: 'safeTransferFrom'
          },
          sendManager: {
            contract: 'registry',
            method: 'reclaim'
          }
        }
      } as any, 
      isOwnerOrManager: true,
      resolverAddress: '0xresolver'
    })).toEqual([
      makeTransactionItem('resetProfileWithRecords', { name: 'test.eth', records: {coinTypes: [{key: 'ETH', value: '0xrecipient'}]}, resolver: '0xresolver' }),
      makeTransactionItem('transferName', {name: 'test.eth', newOwner: '0xrecipient', sendType: 'sendManager', contract: 'registry', reclaim: true}),
      makeTransactionItem('transferName', {
        name: 'test.eth',
        newOwner: '0xrecipient',
        sendType: 'sendOwner',
        contract: 'registry',
      })
    ])
  })

  it('should return 3 transactions (resetProfileWithRecords, transferName, transferName) if setEthRecord, resetProfile, sendManager and sendOwner is true', () => {
    expect(getSendNameTransactions({
      name: 'test.eth',
      recipient:'0xrecipient',
      transactions: {
        setEthRecord: false,
        resetProfile: true,
        sendManager: true,
        sendOwner: true
      },
      abilities: {
        sendNameFunctionCallDetails: {
          sendOwner: {
            contract: 'registry',
            method: 'safeTransferFrom'
          },
          sendManager: {
            contract: 'registry',
            method: 'reclaim'
          }
        }
      } as any, 
      isOwnerOrManager: true,
      resolverAddress: '0xresolver'
    })).toEqual([
      makeTransactionItem('resetProfileWithRecords', { name: 'test.eth', records: {coinTypes: [{key: 'ETH', value: '0xrecipient'}]}, resolver: '0xresolver' }),
      makeTransactionItem('transferName', {name: 'test.eth', newOwner: '0xrecipient', sendType: 'sendManager', contract: 'registry', reclaim: true}),
      makeTransactionItem('transferName', {
        name: 'test.eth',
        newOwner: '0xrecipient',
        sendType: 'sendOwner',
        contract: 'registry',
      })
    ])
  })

  it('should return 3 transactions (updateEthAddress, transferName, transferName) if resetProfile, sendManager and sendOwner is true', () => {
    expect(getSendNameTransactions({
      name: 'test.eth',
      recipient:'0xrecipient',
      transactions: {
        setEthRecord: true,
        resetProfile: false,
        sendManager: true,
        sendOwner: true
      },
      abilities: {
        sendNameFunctionCallDetails: {
          sendOwner: {
            contract: 'registry',
            method: 'safeTransferFrom'
          },
          sendManager: {
            contract: 'registry',
            method: 'reclaim'
          }
        }
      } as any, 
      isOwnerOrManager: true,
      resolverAddress: '0xresolver'
    })).toEqual([
      makeTransactionItem('updateEthAddress', { name: 'test.eth', address: '0xrecipient' }),
      makeTransactionItem('transferName', {name: 'test.eth', newOwner: '0xrecipient', sendType: 'sendManager', contract: 'registry', reclaim: true}),
      makeTransactionItem('transferName', {
        name: 'test.eth',
        newOwner: '0xrecipient',
        sendType: 'sendOwner',
        contract: 'registry',
      })
    ])
  })

  it('should return 2 transactions (transferName, transferName) if sendManager and sendOwner is true', () => {
    expect(getSendNameTransactions({
      name: 'test.eth',
      recipient:'0xrecipient',
      transactions: {
        setEthRecord: false,
        resetProfile: false,
        sendManager: true,
        sendOwner: true
      },
      abilities: {
        sendNameFunctionCallDetails: {
          sendOwner: {
            contract: 'registry',
            method: 'safeTransferFrom'
          },
          sendManager: {
            contract: 'registry',
            method: 'reclaim'
          }
        }
      } as any, 
      isOwnerOrManager: true,
      resolverAddress: '0xresolver'
    })).toEqual([
      makeTransactionItem('transferName', {name: 'test.eth', newOwner: '0xrecipient', sendType: 'sendManager', contract: 'registry', reclaim: true}),
      makeTransactionItem('transferName', {
        name: 'test.eth',
        newOwner: '0xrecipient',
        sendType: 'sendOwner',
        contract: 'registry',
      })
    ])
  })

  it('should return 2 transactions (transferSubname, transferSubname) if sendManager and sendOwner is true and isOwnerOrManager is false', () => {
    expect(getSendNameTransactions({
      name: 'test.eth',
      recipient:'0xrecipient',
      transactions: {
        setEthRecord: false,
        resetProfile: false,
        sendManager: true,
        sendOwner: true
      },
      abilities: {
        sendNameFunctionCallDetails: {
          sendOwner: {
            contract: 'registry',
            method: 'safeTransferFrom'
          },
          sendManager: {
            contract: 'registry',
            method: 'reclaim'
          }
        }
      } as any, 
      isOwnerOrManager: true,
      resolverAddress: '0xresolver'
    })).toEqual([
      makeTransactionItem('transferName', {name: 'test.eth', newOwner: '0xrecipient', sendType: 'sendManager', contract: 'registry', reclaim: true}),
      makeTransactionItem('transferName', {
        name: 'test.eth',
        newOwner: '0xrecipient',
        sendType: 'sendOwner',
        contract: 'registry',
      })
    ])
  })

  it('should return 0 transactions if sendManager and sendOwner is true but abilities.sendNameFunctionCallDetails is undefined', () => {
    expect(getSendNameTransactions({
      name: 'test.eth',
      recipient:'0xrecipient',
      transactions: {
        setEthRecord: false,
        resetProfile: false,
        sendManager: true,
        sendOwner: true
      },
      abilities: {
        sendNameFunctionCallDetails: undefined
      } as any, 
      isOwnerOrManager: true,
      resolverAddress: '0xresolver'
    })).toEqual([])
  })
})