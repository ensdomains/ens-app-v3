import { describe, expect, it, vi } from 'vitest'

import { reducer } from './reducer'
import { InternalTransactionFlow, TransactionFlowAction } from './types'

describe('reducer', () => {
  it('should not break if resumeFlowWithCheck is called with item', () => {
    const mockPush = vi.fn()
    const action = {
      name: 'resumeFlowWithCheck',
      key: 'key',
      payload: {
        push: mockPush,
      },
    } as TransactionFlowAction
    const draft = {
      items: {
        key: {
          resumeLink: 'resumeLink',
          transactions: [{ hash: 'hash', stage: 'complete' }],
        },
      },
    } as any
    reducer(draft, action)
    expect(mockPush).toHaveBeenCalled()
  })
  it('should break if resumeFlowWithCheck is called wihout item', () => {
    const mockPush = vi.fn()
    const action = {
      name: 'resumeFlowWithCheck',
      key: 'key',
      payload: {
        push: mockPush,
      },
    } as TransactionFlowAction
    const draft = {
      items: {
        otherKey: {
          resumeLink: 'resumeLink',
          transactions: [{ hash: 'hash', stage: 'complete' }],
        },
      },
    } as any
    reducer(draft, action)
    expect(mockPush).not.toHaveBeenCalled()
  })
  it('should not break if resumeFlow is called with item', () => {
    const mockPush = vi.fn()
    const action = {
      name: 'resumeFlow',
      key: 'key',
      payload: {
        push: mockPush,
      },
    } as TransactionFlowAction
    const draft = {
      selectedKey: '',
      items: {
        key: {
          intro: true,
          currentFlowStage: '',
        },
      },
    } as any
    reducer(draft, action)
    expect(draft.selectedKey).toEqual('key')
  })
  it('should break if resumeFlow is called wihout item', () => {
    const mockPush = vi.fn()
    const action = {
      name: 'resumeFlow',
      key: 'key',
      payload: {
        push: mockPush,
      },
    } as TransactionFlowAction
    const draft = {
      selectedKey: '',
      items: {
        otherkey: {
          intro: true,
          currentFlowStage: '',
        },
      },
    } as any
    reducer(draft, action)
    expect(draft.selectedKey).toEqual('')
  })
  it('should update existing transaction item for repriced transaction', () => {
    const action: TransactionFlowAction = {
      name: 'setTransactionStageFromUpdate',
      payload: {
        hash: 'hash' as any,
        key: 'key',
        action: 'action',
        status: 'repriced',
        minedData: {
          timestamp: 1000,
        } as any,
        newHash: 'newHash' as any,
        searchRetries: 0,
      },
    }
    const draft: InternalTransactionFlow = {
      selectedKey: '',
      items: {
        key: {
          transactions: [{ name: 'testSendName', hash: 'hash' as any, stage: 'sent', data: {} }],
          currentTransaction: 0,
          currentFlowStage: 'transaction',
        },
      },
    }
    reducer(draft, action)

    const transaction = draft.items.key.transactions[0]
    expect(transaction.hash).toEqual('newHash')
    expect(transaction.stage).toEqual('sent')
  })
})
