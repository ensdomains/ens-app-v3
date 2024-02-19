import { describe, expect, it } from 'vitest'

import { GetDnsImportDataReturnType } from '@ensdomains/ensjs/dns'

import { createImportTransactionRequests } from './utils'

const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as const
const testName = 'test.eth' as const
const dnsImportData = [] as GetDnsImportDataReturnType
const publicResolverAddress = '0xpublicresolver'
const dnsRegistrarAddress = '0xdnsregistrar'

describe('createImportTransactionRequests', () => {
  it('creates transactions and estimators with required approval when dns owner is matching', () => {
    const dnsOwnerStatus = 'matching'
    const requiresApproval = true
    expect(
      createImportTransactionRequests({
        address,
        name: testName,
        dnsOwnerStatus,
        dnsImportData,
        requiresApproval,
        publicResolverAddress,
        dnsRegistrarAddress,
      }),
    ).toEqual({
      transactions: [
        {
          name: 'approveDnsRegistrar',
          data: expect.any(Object),
        },
        {
          name: 'claimDnsName',
          data: expect.any(Object),
        },
      ],
      estimators: [
        {
          name: 'approveDnsRegistrar',
          data: expect.any(Object),
        },
        {
          name: 'claimDnsName',
          data: expect.any(Object),
          stateOverride: expect.any(Array),
        },
      ],
    })
  })
  it('creates transaction without required approval when dns owner is matching', () => {
    const dnsOwnerStatus = 'matching'
    const requiresApproval = false
    expect(
      createImportTransactionRequests({
        address,
        name: testName,
        dnsOwnerStatus,
        dnsImportData,
        requiresApproval,
        publicResolverAddress,
        dnsRegistrarAddress,
      }),
    ).toEqual({
      transactions: [
        {
          name: 'claimDnsName',
          data: expect.any(Object),
        },
      ],
    })
  })
  it('creates transaction when dns owner is mismatching', () => {
    const dnsOwnerStatus = 'mismatching'
    const requiresApproval = false
    expect(
      createImportTransactionRequests({
        address,
        name: testName,
        dnsOwnerStatus,
        dnsImportData,
        requiresApproval,
        publicResolverAddress,
        dnsRegistrarAddress,
      }),
    ).toEqual({
      transactions: [
        {
          name: 'importDnsName',
          data: expect.any(Object),
        },
      ],
    })
  })
})
