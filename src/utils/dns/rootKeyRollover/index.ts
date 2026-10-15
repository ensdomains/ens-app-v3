import { BaseError, ContractFunctionRevertedError, toFunctionSelector, toHex, type Hex } from 'viem'
import { readContract } from 'viem/actions'

import { DnsNewerRecordTypeAvailableError } from '@ensdomains/ensjs'
import { dnssecImplVerifyRrSetSnippet, getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { getDnsImportData, type GetDnsImportDataReturnType } from '@ensdomains/ensjs/dns'

import historicalRoot from './root-dnskey-ksk20326-20261001.json'

// Temporary bridge to the legacy oracle's 20326 anchor. See README.md for removal.
export const ROOT_KEY_ROLLOVER_EXPIRY = Date.parse('2026-10-22T00:00:00Z')

const isExpired = () => Date.now() >= ROOT_KEY_ROLLOVER_EXPIRY

export const assertDnsImportProofNotExpired = (proofs: GetDnsImportDataReturnType) => {
  if (proofs[0]?.rrset === historicalRoot.rrset && isExpired())
    throw new Error('The temporary DNS root proof expired on 22 October 2026 at 00:00 UTC')
}

const isMissingTrustAnchor = (error: unknown) =>
  error instanceof BaseError &&
  !!error.walk(
    (cause) =>
      cause instanceof ContractFunctionRevertedError &&
      (cause.data?.errorName === 'NoMatchingProof' ||
        cause.signature === toFunctionSelector('NoMatchingProof(bytes)')),
  )

/** Prefer ENSJS unchanged; bridge only a legacy oracle's missing trust anchor. */
export const getDnsImportDataWithRootKeyRollover: typeof getDnsImportData = async (
  client,
  parameters,
) => {
  try {
    return await getDnsImportData(client, parameters)
  } catch (error) {
    if (![1, 11155111].includes(client.chain.id) || isExpired() || !isMissingTrustAnchor(error))
      throw error

    const { DNSProver } = await import('@ensdomains/dnsprovejs')
    const prover = DNSProver.create(parameters.endpoint ?? 'https://cloudflare-dns.com/dns-query')
    const result = await prover.queryWithProof('TXT', `_ens.${parameters.name}`)
    if (!result) throw error

    const root = result.proofs[0]
    if (
      root?.signature.name !== '.' ||
      root.signature.data.typeCovered !== 'DNSKEY' ||
      root.signature.data.keyTag !== 38696
    )
      throw error

    // Replace only the root. The live TLD, zone and TXT proofs remain untouched.
    const proofs: GetDnsImportDataReturnType = [
      { rrset: historicalRoot.rrset as Hex, sig: historicalRoot.sig as Hex },
      ...[...result.proofs.slice(1), result.answer].map((proof) => ({
        rrset: toHex(proof.toWire(true)),
        sig: toHex(proof.signature.data.signature),
      })),
    ]
    assertDnsImportProofNotExpired(proofs)

    // Preserve ENSJS's verification and freshness checks for the adapted proof.
    const [onchainRrData, inception] = await readContract(client, {
      abi: dnssecImplVerifyRrSetSnippet,
      address: getChainContractAddress({ client, contract: 'ensDnssecImpl' }),
      functionName: 'verifyRRSet',
      args: [proofs],
    })
    const lastProof = result.answer
    const dnsInception = lastProof.signature.data.inception
    if (
      (inception < dnsInception && dnsInception - inception > 0x7fffffff) ||
      (inception > dnsInception && inception - dnsInception < 0x7fffffff)
    )
      throw new DnsNewerRecordTypeAvailableError({
        typeCovered: lastProof.signature.data.typeCovered,
        signatureName: lastProof.signature.name,
        onchainInception: inception,
        dnsInception,
      })
    if (toHex(lastProof.toWire(false)) !== onchainRrData) throw new Error('Mismatched proof data')

    assertDnsImportProofNotExpired(proofs)
    return proofs
  }
}
