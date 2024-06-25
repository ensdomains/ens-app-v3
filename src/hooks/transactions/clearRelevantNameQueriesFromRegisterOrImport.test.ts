import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it } from 'vitest'

import { createQueryKey } from '../useQueryOptions'
import { clearRelevantNameQueriesFromRegisterOrImport } from './clearRelevantNameQueriesFromRegisterOrImport'
import { Transaction } from './transactionStore'

const createTransactionData = ({
  name,
  status = 'confirmed',
  action = 'registerName',
}: {
  name: string
  status?: Transaction['status']
  action?: Transaction['action']
}): Transaction => {
  const registerKey = `register-${name}-0x1234567890123456789012345678901234567890`
  return {
    action,
    status,
    key: registerKey,
    hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
    searchRetries: 0,
  } as Transaction
}

let queryClient = new QueryClient()
const createTestQueryKey = (name: string, override: object = {}) =>
  createQueryKey({
    chainId: 1,
    address: '0x1234',
    queryDependencyType: 'standard',
    functionName: 'unknown',
    params: { name },
    ...override,
  })

describe('clearRelevantNameQueriesFromRegisterOrImport', () => {
  beforeEach(() => {
    queryClient = new QueryClient()
  })
  it('should remove queries with name if registerName transaction is complete', () => {
    const queryKey = createTestQueryKey('test.eth')
    queryClient.setQueryData(queryKey, 'initial')
    clearRelevantNameQueriesFromRegisterOrImport({
      queryClient,
      chainId: 1,
      updatedTransactions: [
        createTransactionData({ name: 'test.eth', status: 'confirmed', action: 'registerName' }),
      ],
    })

    expect(queryClient.getQueryData(queryKey)).toBeUndefined()
  })

  it('should remove queries with name if importDnsName transaction is complete', () => {
    const queryKey = createTestQueryKey('test.eth')
    queryClient.setQueryData(queryKey, 'initial')
    clearRelevantNameQueriesFromRegisterOrImport({
      queryClient,
      chainId: 1,
      updatedTransactions: [
        {
          action: 'importDnsName',
          status: 'confirmed',
          key: `import-test.eth-0x1234567890123456789012345678901234567890`,
          hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
          searchRetries: 0,
        } as Transaction,
      ],
    })

    expect(queryClient.getQueryData(queryKey)).toBeUndefined()
  })

  it('should remove queries with name if claimDnsName transaction is complete', () => {
    const queryKey = createTestQueryKey('test.eth')
    queryClient.setQueryData(queryKey, 'initial')
    clearRelevantNameQueriesFromRegisterOrImport({
      queryClient,
      chainId: 1,
      updatedTransactions: [
        createTransactionData({ name: 'test.eth', status: 'confirmed', action: 'claimDnsName' }),
      ],
    })
    expect(queryClient.getQueryData(queryKey)).toBeUndefined()
  })

  it('should call queryKey with correct name even if it has a lot of dashes ', () => {
    const queryKey = createTestQueryKey('-test-test-test-test-.eth')
    queryClient.setQueryData(queryKey, 'initial')
    clearRelevantNameQueriesFromRegisterOrImport({
      queryClient,
      chainId: 1,
      updatedTransactions: [
        createTransactionData({
          name: '-test-test-test-test-.eth',
          status: 'confirmed',
          action: 'registerName',
        }),
      ],
    })

    expect(queryClient.getQueryData(queryKey)).toBeUndefined()
  })

  it('should call not call queryKey if status or action are incorrect ', () => {
    const queryKey = createTestQueryKey('test.eth')
    queryClient.setQueryData(queryKey, 'initial')
    clearRelevantNameQueriesFromRegisterOrImport({
      queryClient,
      chainId: 1,
      updatedTransactions: [
        createTransactionData({ name: 'test.eth', status: 'pending', action: 'registerName' }),
        createTransactionData({ name: 'test.eth', status: 'confirmed', action: 'commitName' }),
      ],
    })

    expect(queryClient.getQueryData(queryKey)).toBe('initial')
  })

  it('should remove multiple queries', () => {
    const queryKey = createTestQueryKey('test.eth')
    const queryKey2 = createTestQueryKey('test.eth', { functionName: 'getSomethingElse' })
    queryClient.setQueryData(queryKey, 'initial')
    queryClient.setQueryData(queryKey2, 'initial')
    clearRelevantNameQueriesFromRegisterOrImport({
      queryClient,
      chainId: 1,
      updatedTransactions: [
        createTransactionData({ name: 'test.eth', status: 'confirmed', action: 'registerName' }),
      ],
    })

    expect(queryClient.getQueryData(queryKey)).toBeUndefined()
    expect(queryClient.getQueryData(queryKey2)).toBeUndefined()
  })
})
