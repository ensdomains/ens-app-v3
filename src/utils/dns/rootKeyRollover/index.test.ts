import { createPublicKey, verify } from 'node:crypto'

import {
  ContractFunctionRevertedError,
  createPublicClient,
  encodeErrorResult,
  http,
  toBytes,
  toHex,
  type Hex,
} from 'viem'
import { readContract } from 'viem/actions'
import { mainnet, sepolia } from 'viem/chains'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DNSProver, SignedSet } from '@ensdomains/dnsprovejs'
import { getKeyTag } from '@ensdomains/dnsprovejs/dist/prove'
import { addEnsContracts, DnsNewerRecordTypeAvailableError } from '@ensdomains/ensjs'
import { getDnsImportData } from '@ensdomains/ensjs/dns'

import {
  assertDnsImportProofNotExpired,
  getDnsImportDataWithRootKeyRollover,
  ROOT_KEY_ROLLOVER_EXPIRY,
} from './index'
import historicalRoot from './root-dnskey-ksk20326-20261001.json'

vi.mock('@ensdomains/ensjs/dns', async (original) => ({
  ...(await original<typeof import('@ensdomains/ensjs/dns')>()),
  getDnsImportData: vi.fn(),
}))
vi.mock('viem/actions', async (original) => ({
  ...(await original<typeof import('viem/actions')>()),
  readContract: vi.fn(),
}))

const client = createPublicClient({ chain: addEnsContracts(mainnet), transport: http() })
const parameters = { name: 'example.com' }
const rootProof = { rrset: historicalRoot.rrset as Hex, sig: historicalRoot.sig as Hex }
const missingProofAbi = [
  { type: 'error', name: 'NoMatchingProof', inputs: [{ name: 'signerName', type: 'bytes' }] },
] as const
const missingProof = (abi = missingProofAbi as readonly unknown[]) =>
  new ContractFunctionRevertedError({
    abi: abi as typeof missingProofAbi,
    functionName: 'verifyRRSet',
    data: encodeErrorResult({ abi: missingProofAbi, errorName: 'NoMatchingProof', args: ['0x00'] }),
  })
const root = {
  signature: { name: '.', data: { typeCovered: 'DNSKEY', keyTag: 38696 } },
}
const zone = {
  toWire: () => toBytes('0x1234'),
  signature: { data: { signature: toBytes('0x5678') } },
}
const answer = {
  toWire: (signed: boolean) => toBytes(signed ? '0xaabb' : '0xccdd'),
  signature: {
    name: '_ens.example.com',
    data: { signature: toBytes('0xeeff'), inception: 1792000000, typeCovered: 'TXT' },
  },
}
const queryWithProof = vi.fn()

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-10-15T12:00:00Z'))
  vi.mocked(getDnsImportData).mockReset().mockRejectedValue(missingProof())
  vi.mocked(readContract).mockReset().mockResolvedValue(['0xccdd', 1792000000])
  queryWithProof.mockReset().mockResolvedValue({ proofs: [root, zone], answer })
  vi.spyOn(DNSProver, 'create').mockReturnValue({ queryWithProof } as unknown as DNSProver)
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('temporary root key rollover bridge', () => {
  it('keeps the normal path unchanged when the oracle accepts live proofs', async () => {
    const normal = [{ rrset: '0x1234', sig: '0x5678' }] as const
    vi.mocked(getDnsImportData).mockResolvedValue([...normal])
    expect(await getDnsImportDataWithRootKeyRollover(client, parameters)).toEqual(normal)
    expect(queryWithProof).not.toHaveBeenCalled()
    expect(readContract).not.toHaveBeenCalled()
  })

  it.each([mainnet, sepolia])(
    'replaces only the root and verifies against $name',
    async (chain) => {
      const chainClient = createPublicClient({ chain: addEnsContracts(chain), transport: http() })
      const result = await getDnsImportDataWithRootKeyRollover(chainClient, parameters)
      expect(result).toEqual([
        rootProof,
        { rrset: '0x1234', sig: '0x5678' },
        { rrset: '0xaabb', sig: '0xeeff' },
      ])
      expect(queryWithProof).toHaveBeenCalledWith('TXT', '_ens.example.com')
      expect(readContract).toHaveBeenCalledWith(
        chainClient,
        expect.objectContaining({
          address: chainClient.chain.contracts.ensDnssecImpl.address,
          functionName: 'verifyRRSet',
          args: [result],
        }),
      )
    },
  )

  it('handles the undecoded NoMatchingProof error returned by ENSJS’s minimal ABI', async () => {
    vi.mocked(getDnsImportData).mockRejectedValue(missingProof([]))
    expect(await getDnsImportDataWithRootKeyRollover(client, parameters)).toHaveLength(3)
  })

  it('honours a custom DNS endpoint', async () => {
    await getDnsImportDataWithRootKeyRollover(client, {
      ...parameters,
      endpoint: 'https://dns.example/dns-query',
    })
    expect(DNSProver.create).toHaveBeenCalledWith('https://dns.example/dns-query')
  })

  it('propagates unrelated failures without retrying', async () => {
    const error = new Error('RPC unavailable')
    vi.mocked(getDnsImportData).mockRejectedValue(error)
    await expect(getDnsImportDataWithRootKeyRollover(client, parameters)).rejects.toBe(error)
    expect(queryWithProof).not.toHaveBeenCalled()
  })

  it('does not use the bridge on other chains', async () => {
    const otherClient = { ...client, chain: { ...client.chain, id: 31337 } }
    await expect(getDnsImportDataWithRootKeyRollover(otherClient, parameters)).rejects.toThrow()
    expect(queryWithProof).not.toHaveBeenCalled()
  })

  it.each([ROOT_KEY_ROLLOVER_EXPIRY, ROOT_KEY_ROLLOVER_EXPIRY + 1])(
    'disables fallback at/after expiry (%s)',
    async (time) => {
      vi.setSystemTime(time)
      await expect(getDnsImportDataWithRootKeyRollover(client, parameters)).rejects.toThrow()
      expect(queryWithProof).not.toHaveBeenCalled()
    },
  )

  it('still permits the normal path after expiry', async () => {
    vi.setSystemTime(ROOT_KEY_ROLLOVER_EXPIRY)
    vi.mocked(getDnsImportData).mockResolvedValue([])
    expect(await getDnsImportDataWithRootKeyRollover(client, parameters)).toEqual([])
  })

  it.each([
    null,
    { proofs: [], answer },
    { proofs: [{ ...root, signature: { ...root.signature, name: 'com' } }], answer },
  ])('rejects an absent or unexpected root', async (result) => {
    queryWithProof.mockResolvedValue(result)
    await expect(getDnsImportDataWithRootKeyRollover(client, parameters)).rejects.toThrow()
    expect(readContract).not.toHaveBeenCalled()
  })

  it('propagates rejection of the bridged proof by the oracle', async () => {
    const error = new Error('InvalidSignature')
    vi.mocked(readContract).mockRejectedValue(error)
    await expect(getDnsImportDataWithRootKeyRollover(client, parameters)).rejects.toBe(error)
  })

  it('rejects mismatched final record data', async () => {
    vi.mocked(readContract).mockResolvedValue(['0xdead', 1792000000])
    await expect(getDnsImportDataWithRootKeyRollover(client, parameters)).rejects.toThrow(
      'Mismatched proof data',
    )
  })

  it('preserves the ENSJS newer-record check', async () => {
    vi.mocked(readContract).mockResolvedValue(['0xccdd', 1792000001])
    await expect(getDnsImportDataWithRootKeyRollover(client, parameters)).rejects.toBeInstanceOf(
      DnsNewerRecordTypeAvailableError,
    )
  })

  it('checks expiry again after verification', async () => {
    vi.mocked(readContract).mockImplementation(async () => {
      vi.setSystemTime(ROOT_KEY_ROLLOVER_EXPIRY)
      return ['0xccdd', 1792000000]
    })
    await expect(getDnsImportDataWithRootKeyRollover(client, parameters)).rejects.toThrow('expired')
  })

  it('rejects cached bridge proofs at transaction preparation after expiry', () => {
    expect(() => assertDnsImportProofNotExpired([rootProof])).not.toThrow()
    vi.setSystemTime(ROOT_KEY_ROLLOVER_EXPIRY)
    expect(() => assertDnsImportProofNotExpired([rootProof])).toThrow('expired')
    expect(() => assertDnsImportProofNotExpired([{ rrset: '0x1234', sig: '0x5678' }])).not.toThrow()
  })

  it('contains an authentic 20326-signed root set with key 38696 and the documented expiry', () => {
    const set = SignedSet.fromWire(
      Buffer.from(toBytes(rootProof.rrset)),
      Buffer.from(toBytes(rootProof.sig)),
    )
    expect(set.signature.data.expiration * 1000).toBe(ROOT_KEY_ROLLOVER_EXPIRY)
    expect(set.signature.data.keyTag).toBe(20326)
    expect(set.records.map(getKeyTag)).toContain(38696)
    const key = set.records.find((record) => getKeyTag(record) === 20326)!
    const bytes = key.data.key
    const exponentLength = bytes[0]
    const publicKey = createPublicKey({
      format: 'jwk',
      key: {
        kty: 'RSA',
        e: bytes.subarray(1, 1 + exponentLength).toString('base64url'),
        n: bytes.subarray(1 + exponentLength).toString('base64url'),
      },
    })
    expect(verify('RSA-SHA256', set.toWire(true), publicKey, set.signature.data.signature)).toBe(
      true,
    )
  })
})
