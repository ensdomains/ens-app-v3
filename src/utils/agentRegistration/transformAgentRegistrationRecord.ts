import type { DecodedText } from '@ensdomains/ensjs/dist/types'

import { getKnownRegistryName } from '@app/constants/knownAgentRegistries'
import { shortenAddress } from '@app/utils/utils'

import { decodeErc7930Address } from './decodeErc7930Address'
import { buildAddressExplorerUrl, getChainInfo } from './getChainInfo'
import { parseAgentRegistrationKey } from './parseAgentRegistrationKey'

export interface AgentRegistrationRecord {
  key: string
  agentId: string
  chainId: number
  chainName: string
  registryAddress: `0x${string}`
  registryDisplayName: string // ENS name or shortened address
  explorerUrl: string | null // Block explorer URL from viem
  displayValue: string // "id: 167 | registry: 8004.eth@ethereum"
  iconKey: 'agent'
}

/**
 * Transforms a raw text record into an AgentRegistrationRecord if it's a valid
 * ENSIP-25 agent-registration record.
 *
 * @param record - The decoded text record from ENS
 * @returns Transformed agent registration record, or null if invalid
 */
export function transformAgentRegistrationRecord(
  record: DecodedText,
): AgentRegistrationRecord | null {
  const parsed = parseAgentRegistrationKey(record.key)
  if (!parsed) return null

  const decoded = decodeErc7930Address(parsed.registryHex)
  if (!decoded) return null

  const chainInfo = getChainInfo(decoded.chainId)
  const knownName = getKnownRegistryName(decoded.chainId, decoded.address)
  const registryDisplayName = knownName ?? shortenAddress(decoded.address, 13, 6, 4)
  const explorerUrl = buildAddressExplorerUrl(chainInfo.explorerUrl, decoded.address)

  return {
    key: record.key,
    agentId: parsed.agentId,
    chainId: decoded.chainId,
    chainName: chainInfo.name,
    registryAddress: decoded.address,
    registryDisplayName,
    explorerUrl,
    displayValue: `id: ${parsed.agentId} | registry: ${registryDisplayName}@${chainInfo.name}`,
    iconKey: 'agent',
  }
}
