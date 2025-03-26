# ![ENSjs](https://user-images.githubusercontent.com/11844316/161689061-98ea01ee-b119-40ac-a512-5370eb8b4107.svg)

The ultimate ENS javascript library, with [viem](https://github.com/wagmi-dev/viem) under the hood.

## Features

- Super fast response times
- Easy call batchability
- Written in TypeScript
- Supports the most cutting edge ENS features
- Full tree-shaking support

## Installation

Install @ensdomains/ensjs, alongside [viem](https://github.com/wagmi-dev/viem).

```sh
npm install @ensdomains/ensjs viem
```

## Getting Started

The most simple way to get started is to create a public ENS client, with a supported
chain and transport imported from viem. The public client has all the read functions available on it,
as well as all subgraph functions.

```ts
// Import viem transport, viem chain, and ENSjs
import { http } from 'viem'
import { mainnet } from 'viem/chains'
import { createEnsPublicClient } from '@ensdomains/ensjs'

// Create the client
const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
})

// Use the client
const ethAddress = client.getAddressRecord({ name: 'ens.eth' })
```

## Docs

Docs can be found [here](https://github.com/ensdomains/ensjs-v3/tree/main/docs). Full docs site coming soon.
