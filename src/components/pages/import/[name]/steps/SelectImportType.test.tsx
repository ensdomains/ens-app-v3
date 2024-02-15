import { useDnsOffchainStatus } from '@app/hooks/dns/useDnsOffchainStatus'

import { calculateDnsSteps } from './SelectImportType'

describe('calculateDnsSteps', () => {
  describe('offchain', () => {
    const importType = 'offchain' as const
    const dnsOwner = null
    const dnsOwnerStatus = null
    it('returns correct steps for: dnssec not enabled, resolved address not matching', () => {
      const isDnsSecEnabled = false
      const offchainDnsStatus = { address: null } as ReturnType<typeof useDnsOffchainStatus>['data']
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual(['selectType', 'enableDnssec', 'verifyOffchainOwnership', 'completeOffchain'])
    })
    it('returns correct steps for: dnssec enabled, resolved address not matching', () => {
      const isDnsSecEnabled = true
      const offchainDnsStatus = { address: null } as ReturnType<typeof useDnsOffchainStatus>['data']
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual(['selectType', 'verifyOffchainOwnership', 'completeOffchain'])
    })
    it('returns correct steps for: dnssec not enabled, resolved address matching', () => {
      const isDnsSecEnabled = false
      const offchainDnsStatus = { address: { status: 'matching' } } as ReturnType<
        typeof useDnsOffchainStatus
      >['data']
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual(['selectType', 'enableDnssec', 'completeOffchain'])
    })
    it('returns correct steps for: dnssec enabled, resolved address matching', () => {
      const isDnsSecEnabled = true
      const offchainDnsStatus = { address: { status: 'matching' } } as ReturnType<
        typeof useDnsOffchainStatus
      >['data']
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual(['selectType', 'completeOffchain'])
    })
  })
  describe('onchain', () => {
    const importType = 'onchain' as const
    const offchainDnsStatus = undefined
    it('returns correct steps for: dnssec not enabled, dns owner not matching', () => {
      const isDnsSecEnabled = false
      const dnsOwner = null
      const dnsOwnerStatus = null
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual([
        'selectType',
        'enableDnssec',
        'verifyOnchainOwnership',
        'transaction',
        'completeOnchain',
      ])
    })
    it('returns correct steps for: dnssec enabled, dns owner not matching', () => {
      const isDnsSecEnabled = true
      const dnsOwner = null
      const dnsOwnerStatus = null
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual(['selectType', 'verifyOnchainOwnership', 'transaction', 'completeOnchain'])
    })
    it('returns correct steps for: dnssec not enabled, dns owner matching', () => {
      const isDnsSecEnabled = false
      const dnsOwner = '0x1234'
      const dnsOwnerStatus = 'matching'
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual(['selectType', 'enableDnssec', 'transaction', 'completeOnchain'])
    })
    it('returns correct steps for: dnssec enabled, dns owner matching', () => {
      const isDnsSecEnabled = true
      const dnsOwner = '0x1234'
      const dnsOwnerStatus = 'matching'
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual(['selectType', 'transaction', 'completeOnchain'])
    })
  })
})
