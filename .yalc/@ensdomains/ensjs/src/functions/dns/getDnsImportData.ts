import { SignedSet, type ProvableAnswer } from '@ensdomains/dnsprovejs'
import type * as packet from 'dns-packet'
import { toHex, type Client, type Hex, type Transport } from 'viem'
import { readContract } from 'viem/actions'
import type { ChainWithEns } from '../../contracts/consts.js'
import { dnssecImplVerifyRrSetSnippet } from '../../contracts/dnssecImpl.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import { DnsNewerRecordTypeAvailableError } from '../../index.js'
import type { Endpoint } from './types.js'

export type GetDnsImportDataParameters = {
  /** Name to prepare for DNS import */
  name: string
  /** An RFC-1035 compatible DNS endpoint to use (default: `https://cloudflare-dns.com/dns-query`) */
  endpoint?: Endpoint
}

export type RrSetWithSig = {
  rrset: Hex
  sig: Hex
}

export type GetDnsImportDataReturnType = RrSetWithSig[]

// Compares two serial numbers using RFC1982 serial number math.
const serialNumberGt = (i1: number, i2: number): boolean =>
  (i1 < i2 && i2 - i1 > 0x7fffffff) || (i1 > i2 && i1 - i2 < 0x7fffffff)

const encodeProofs = (
  proofs: SignedSet<packet.Ds | packet.Dnskey | packet.Rtxt>[],
): RrSetWithSig[] =>
  proofs.map((proof) => ({
    rrset: toHex(proof.toWire(true)),
    sig: toHex(proof.signature.data.signature),
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
  client: Client<Transport, ChainWithEns>,
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

  const rrsets = encodeProofs(allProofs)

  const [onchainRrData, inception] = await readContract(client, {
    abi: dnssecImplVerifyRrSetSnippet,
    address: getChainContractAddress({
      client,
      contract: 'ensDnssecImpl',
    }),
    functionName: 'verifyRRSet',
    args: [rrsets],
  })

  const lastProof = allProofs[allProofs.length - 1]
  if (serialNumberGt(inception, lastProof.signature.data.inception))
    throw new DnsNewerRecordTypeAvailableError({
      typeCovered: lastProof.signature.data.typeCovered,
      signatureName: lastProof.signature.name,
      onchainInception: inception,
      dnsInception: lastProof.signature.data.inception,
    })

  if (toHex(lastProof.toWire(false)) !== onchainRrData)
    throw new Error('Mismatched proof data')

  return rrsets
}

export default getDnsImportData
