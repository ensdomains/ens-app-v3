import type { ProvableAnswer, SignedSet } from '@ensdomains/dnsprovejs'
import type * as packet from 'dns-packet'
import { toType } from 'dns-packet/types.js'
import { keccak256, toBytes, toHex } from 'viem'
import { readContract } from 'viem/actions'
import type { ClientWithEns } from '../../contracts/consts.js'
import {
  dnssecImplAnchorsSnippet,
  dnssecImplRrDataSnippet,
} from '../../contracts/dnssecImpl.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import { DnsNewerRecordTypeAvailableError } from '../../errors/dns.js'
import { packetToBytes } from '../../utils/hexEncodedName.js'
import type { Endpoint } from './types.js'

export type GetDnsImportDataParameters = {
  /** Name to prepare for DNS import */
  name: string
  /** An RFC-1035 compatible DNS endpoint to use (default: `https://cloudflare-dns.com/dns-query`) */
  endpoint?: Endpoint
}

export type RrSetWithSig = {
  rrset: Uint8Array
  sig: Uint8Array
}

export type GetDnsImportDataReturnType = {
  rrsets: RrSetWithSig[]
  proof: Uint8Array
}

// Compares two serial numbers using RFC1982 serial number math.
const serialNumberGt = (i1: number, i2: number): boolean =>
  (i1 < i2 && i2 - i1 > 0x7fffffff) || (i1 > i2 && i1 - i2 < 0x7fffffff)

const encodeProofs = (
  proofs: SignedSet<packet.Ds | packet.Dnskey | packet.Rtxt>[],
): RrSetWithSig[] =>
  proofs.map((proof) => ({
    rrset: proof.toWire(true),
    sig: proof.signature.data.signature,
  }))

/**
 * Gets DNS import data, used for `importDnsName()`
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetDnsImportDataParameters}
 * @returns DNS import data object, used for proving the value of the `_ens` TXT record
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getDnsImportData } from '@ensdomains/ensjs/dns'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const data = await getDnsImportData(client, {
 *   name: 'example.eth',
 * })
 */
const getDnsImportData = async (
  client: ClientWithEns,
  {
    name,
    endpoint = 'https://cloudflare-dns.com/dns-query',
  }: GetDnsImportDataParameters,
): Promise<GetDnsImportDataReturnType> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DNSProver } = await import('@ensdomains/dnsprovejs')
  const prover = DNSProver.create(endpoint)
  const result = (await prover.queryWithProof(
    'TXT',
    `_ens.${name}`,
  )) as ProvableAnswer<packet.Rtxt>

  const allProofs = (
    result.proofs as SignedSet<packet.Ds | packet.Dnskey | packet.Rtxt>[]
  ).concat([result.answer])

  const ensDnssecImplAddress = getChainContractAddress({
    client,
    contract: 'ensDnssecImpl',
  })

  for (let i = allProofs.length - 1; i >= 0; i -= 1) {
    const proof = allProofs[i]
    const hexEncodedName = toHex(packetToBytes(proof.signature.name))
    const type = toType(proof.signature.data.typeCovered)
    // eslint-disable-next-line no-await-in-loop
    const [inception, expiration, hash] = await readContract(client, {
      abi: dnssecImplRrDataSnippet,
      address: ensDnssecImplAddress,
      functionName: 'rrdata',
      args: [type, hexEncodedName],
    })
    if (serialNumberGt(inception, proof.signature.data.inception))
      throw new DnsNewerRecordTypeAvailableError({
        typeCovered: proof.signature.data.typeCovered,
        signatureName: proof.signature.name,
        onchainInception: inception,
        dnsInception: proof.signature.data.inception,
      })
    const expired = serialNumberGt(Date.now() / 1000, expiration)
    const proofHash = keccak256(proof.toWire(false)).slice(0, 42)
    const isKnownProof = hash === proofHash && !expired
    if (isKnownProof) {
      if (i === allProofs.length - 1) {
        return { rrsets: [], proof: proof.toWire(false) }
      }
      return {
        rrsets: encodeProofs(allProofs.slice(i + 1, allProofs.length)),
        proof: proof.toWire(false),
      }
    }
  }

  return {
    rrsets: encodeProofs(allProofs),
    proof: toBytes(
      await readContract(client, {
        abi: dnssecImplAnchorsSnippet,
        address: ensDnssecImplAddress,
        functionName: 'anchors',
      }),
    ),
  }
}

export default getDnsImportData
