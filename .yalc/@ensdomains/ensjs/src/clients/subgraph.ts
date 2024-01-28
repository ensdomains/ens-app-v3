import {
  createClient,
  type Chain,
  type Client,
  type ClientConfig,
  type PublicRpcSchema,
  type Transport,
} from 'viem'
import { addEnsContracts } from '../contracts/addEnsContracts.js'
import type { ChainWithEns } from '../contracts/consts.js'
import type { Prettify } from '../types.js'
import {
  ensSubgraphActions,
  type EnsSubgraphActions,
} from './decorators/subgraph.js'

export type EnsSubgraphClientConfig<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
> = Pick<
  ClientConfig<TTransport, TChain>,
  'batch' | 'key' | 'name' | 'pollingInterval' | 'transport'
> & {
  chain: TChain
}

export type EnsSubgraphClient<
  TTransport extends Transport = Transport,
  TChain extends ChainWithEns = ChainWithEns,
> = Prettify<
  Client<TTransport, TChain, undefined, PublicRpcSchema, EnsSubgraphActions>
>

/**
 * Creates a ENS Subgraph Client with a given [Transport](https://viem.sh/docs/clients/intro.html) configured for a [Chain](https://viem.sh/docs/clients/chains.html).
 *
 * @param config - {@link EnsSubgraphClientConfig}
 * @returns An ENS Subgraph Client. {@link EnsSubgraphClient}
 *
 * @example
 * import { http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createEnsSubgraphClient } from '@ensdomains/ensjs'
 *
 * const client = createEnsSubgraphClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 */
export const createEnsSubgraphClient = <
  TTransport extends Transport,
  TChain extends Chain,
>({
  batch,
  chain,
  key = 'ensSubgraph',
  name = 'ENS Subgraph Client',
  transport,
  pollingInterval,
}: EnsSubgraphClientConfig<TTransport, TChain>): EnsSubgraphClient<
  TTransport,
  ChainWithEns<TChain>
> => {
  return createClient({
    batch,
    chain: addEnsContracts(chain),
    key,
    name,
    pollingInterval,
    transport,
    type: 'ensSubgraphClient',
  }).extend(ensSubgraphActions)
}
