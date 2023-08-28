# ![ENSjs](https://user-images.githubusercontent.com/11844316/161689061-98ea01ee-b119-40ac-a512-5370eb8b4107.svg)

The ultimate ENS javascript library, with [ethers.js](https://github.com/ethers-io/ethers.js) under the hood.

## NOTE!!!

ENSjs v3 is currently in the early development stage, meaning that the APIs are subject to change.
We also use undeployed contracts under the hood, so this **will not** work on any mainnet/testnet where the contracts are not deployed.

Given the current development status, we're actively seeking feedback so feel free to create an issue or PR if you notice something!

If you are looking for documentation for **version 2**, it an be found [here](https://github.com/ensdomains/ensjs#readme).

## Features

- Dynamically load **everything**
- Super fast response times (1 call for most RPC calls)
- Easy call batchability
- Written in TypeScript
- Supports the most cutting edge ENS features
- - More

## Installation

Install @ensdomains/ensjs, alongside [ethers](https://github.com/ethers-io/ethers.js).

```sh
npm install @ensdomains/ensjs ethers
```

## Getting Started

All that's needed to get started is an ethers provider instance.
Once you create a new ENS instance, you can pass it in using setProvider.

```js
import { ENS } from '@ensdomains/ensjs'
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider(providerUrl)

const ENSInstance = new ENS()
await ENSInstance.setProvider(provider)
```

**NOTE:**
If using ENSjs with Node, you may need to pass the `--experimental-specifier-resolution=node` flag.

```sh
node --experimental-specifier-resolution=node ./index.js
```

## Batching Calls

The batch function is a large part of this library, and there are plenty of situations where you might want to use it.
**Note that only functions with the `GeneratedRawFunction` type can be batched together.**

```js
/* Batch functions can be called like so, with the function as the first item in an array, with the following items being the function's arguments */
const batched = await ENSInstance.batch(
  ENSInstance.getText.batch('test.eth', 'foo'),
  ENSInstance.getAddr.batch('test.eth'),
  ENSInstance.getOwner.batch('test.eth'),
)

/* The response is formatted like so:
  [
    response1,
    response2,
    response3,
    ...etc,
  ]
*/
```

## Using Custom Graph Node URIs

If you want to use your own graph-node URI, such as a local graph-node URI, you can pass it through when creating a new ENS instance.
Alternatively, if you don't want to use The Graph at all you can pass through `null`.

```js
import { ENS } from '@ensdomains/ensjs'

/* If you want to use a custom URI */
const ENSInstance = new ENS({
  graphURI: 'http://localhost:8000/subgraphs/name/graphprotocol/ens',
})

/* If you want to disable The Graph queries */
const ENSInstance = new ENS({ graphURI: null })
```

## Single-use Providers

If you want to use a specific provider to make a single call occasionally, you can easily do so.

```js
import { ENS } from '@ensdomains/ensjs'

const ENSInstance = new ENS()

const callWithProvider = await ENSInstance.withProvider(otherProvider).getText(
  'test.eth',
  'foo',
)
```

## Profiles

You can fetch almost all information about an ENS name (or address) using getProfile.
If an address is used as the first argument, it will fetch the primary name and give the same response as a name would.
It will automatically get all the records for a name, as well as get the resolver address for the name.
Specific records can also be used as an input, if you only want to get certain ones. If an address is used as an input alongside this,
you also save 1 RPC call.

**NOTE:**  
The profile function will always request an ETH addr record.
For names, this means the address will always at the top level of the returned object.
For addresses, this means the "match" property (a boolean value for matching reverse/forward resolution) will always be at the top level of the returned object.

```js
/* Normal profile fetching */
const profile = await ENSInstance.getProfile('test.eth')

/* Profile fetching from an address */
const profile = await ENSInstance.getProfile(
  '0xeefB13C7D42eFCc655E528dA6d6F7bBcf9A2251d',
)

/* Get all records of a specific type (or multiple) */
const profile = await ENSInstance.getProfile('test.eth', {
  texts: true,
  coinTypes: true,
  contentHash: true,
})

/* Get specific records */
const profile = await ENSInstance.getProfile('test.eth', {
  texts: ['foo'],
  coinTypes: ['ETH'],
})
```

Returns:

```typescript
type RecordItem = {
  key: string | number
  type: 'addr' | 'text' | 'contentHash'
  coin?: string
  addr?: string
  value?: string
}

type ProfileReturn = {
  address?: string // ONLY RETURNED AT TOP-LEVEL FOR NAME QUERIES
  name?: string // ONLY RETURNED AT TOP-LEVEL FOR ADDRESS QUERIES
  records: {
    contentHash?: ContentHashObject | null
    texts?: RecordItem[]
    coinTypes?: RecordItem[]
  }
  resolverAddress: string
}
```

## Name History

Getting the history for a name is very simple and can be done in two ways.
Not all data can be immediately fetched for the history of an ENS name, which is why there is multiple methods for doing so.
Text records do not contain the string value of the changed record, only the key. The value needs to be derived from fetching
the individual transaction hash. This can potentially be very slow if the name has a long history.

```js
/* Normal Fetching, requires a second function for more details */
const history = await ENSInstance.getHistory('test.eth')

/* Details helper for history */
/* You'll need to implement custom logic to get the index if you want to use that parameter, it's not currently done in the function */
const detail = await ENSInstance.getHistoryDetailForTransactionHash(
  transactionHash,
  optionalIndex,
)

/* Fetching with all details upfront */
const historyWithDetail = await ENSInstance.getHistoryWithDetail('test.eth')
```

## Ownership Levels

The `getOwner` function returns not only an owner (and potentially a registrant), but also a ownershipLevel value.
This value essentially means the contract for the "real owner" of any given name. In most cases it means the NFT contract
of the name, but if there is no NFT then it's just the registry. This value is useful for input into the `transferName`
function, where a contract needs to be specified.

## Wrapping Names

Wrapping names is very simple, you can wrap any name from the same function, with the exact contract to use being inferred.
You can specify both the fuses and resolver address to use with the wrapped name, but it's entirely optional.

```js
/* wrap a .eth name */
const tx = await ENSInstance.wrapName(
  'test.eth', // Name to wrap
  '0xeefB13C7D42eFCc655E528dA6d6F7bBcf9A2251d', // New owner of wrapped name
)

/* wrap any other name (e.g. a subname) */
const tx = await ENSInstance.wrapName(
  'sub.test.eth',
  '0xeefB13C7D42eFCc655E528dA6d6F7bBcf9A2251d',
)
```

## Write Transaction Options

Currently, some write functions have an `options` argument. While this may expand over time,
it currently just allows you to pass an address or index for an account array to ethers for specifying the signer of the transaction.

## Internal Structure

### Raw Functions

Raw functions are a crucial part of how ENSjs works. In the function file itself
a `raw` and `decode` function both need to be defined, with the export being an object with those properties.
This allows for the encoding and decoding of contract calls to be split, meaning that multiple calls can be batched together.
For calling a raw function by itself, the raw and decode functions are stitched together with a provider call. This is done
using `importGenerator` which is explained below.

### importGenerator

The importGenerator function generates a wrapped function for any given input.
The result of the wrapped function obfuscates the processing that ENSjs does, and exposes a cleaner API to the user/developer.
The reason we do this is to:

1. Pass through all the required variables for the function
2. Split individual functions from the main class
3. Dynamically load functions and their dependencies
4. Allow each function's dependencies to be imported regularly
5. Remove duplicate code
6. Make it easier to isolate errors
7. Stitch `raw` and `decode` functions together

### ContractManager

The contract manager is where all the contracts are dynamically loaded in and resolved based on the network.
A new instance of ContractManager is created every time you switch providers.

### GqlManager

The GQL manager is used as to separate the reliance of ENSjs from GQL.
It only loads in GQL when it is needed, or not at all if specified in the constructor of the ENS class.
Very simply, it just exposes the core functions needed for ENSjs which can then be accessed.

### initialProvider

The `initialProvider`, and similarly `checkInitialProvider` are used when creating single-use class instances with `withProvider`.
It allows `withProvider` to act as a new ENS instance without having to await a promise, which simplifies the API.
`checkInitialProvider` is run on every function call given that it's extremely lightweight.

## Individual Functions

### Utils

Utils can be imported at follows
`import { encodeContenthash } from '@ensdomains/ensjs/utils/contentHash'`

### getFuses

Gets the fuses for a specified wrapped name.

Input:

- `name`: string
  - Target name

Output:

- `fuseObj`: object
  - Decoded known fuses
- `vulnerability`: string
  - Vulnerability for name
  - Will be "Safe" if no vulnerability
- `vulnerableNode`: string | null
  - Node that is vulnerable in chain
- `rawFuses`: BigNumber
  - Unformatted fuse result

### getHistory

Gets the history for a specified name.

Input:

- `name`: string
  - Target name

Output:

- `domain`: array
  - Domain event item
- `registration`: array
  - Registration event item
- `resolver`: array
  - Resolver event item

### getHistoryWithDetail

Gets the history for a specified name with details.

Input:

- `name`: string
  - Target name

Output:

- `domain`: array
  - Domain event item
- `registration`: array
  - Registration event item
- `resolver`: array
  - Resolver event item

### getHistoryDetailForTransactionHash

Gets the history details for a specified transaction hash.

Input:

- `hash`: string
  - Target transaction hash
- `indexInTransaction`: number?
  - Index of transaction out of same transaction type

Output:

- object | array
  - `key`: string
    - Key for detail
  - `value`: string
    - Value for detail

### getName

Gets the primary name for a specified address.

Input:

- `address`: string
  - Target address

Output:

- `name`: string | null
  - Resolved name
- `match`: boolean
  - Forward resolved match check value

### getOwner

Gets the owner of a specified name. See _ownership levels_ for more details about the output.

Input:

- `name`: string
  - Target name

Output:

- `owner`: string
  - Controller of records for name
- `registrant`: string?
  - NFT Owner
- `ownershipLevel`: string
  - Level at which the ownership data is being read

### getProfile

Gets the profile of a specified name or address, or just certain records if specified.

Input:

- `nameOrAddress`: string
  - Target name or address
- `options`: object?
  - `contentHash`: boolean?
  - `texts`: boolean? | string[]?
    - Array of keys, or true for all keys
  - `coinTypes`: boolean? | string[]?
    - Array of keys, or true for all keys

Output:

- `resolverAddress`: string
  - Address of resolver
- `records`: object
  - matching records from input
  - `contentHash`: object? | null?
    - Decoded content hash
  - `texts`: array?
    - `key`: string
    - `value`: string
  - `coinTypes`: array?
    - `key`: number
    - `coin`: string
      - Coin name
    - `value`: string
      - Decoded address
- `name`: string?
  - _Only applicable for address inputs_
  - Resolved name
- `address`: string?
  - _Only applicable for name inputs_
  - Resolved address
- `match`: boolean?
  - _Only applicable for address inputs_
  - Forward resolved match check value

### getResolver

Gets the resolver for a specified name.

Input:

- `name`: string
  - Target name

Output:

- string
  - Resolver address

### getContentHash

Gets the content hash record for a specified name.

Input:

- `name`: string
  - Target name

Output:

- object | null
  - Decoded content hash

### getText

Gets a text record for a specified name.

Input:

- `name`: string
  - Target name
- `key`: string
  - Target key

Output:

- string | null
  - Text record value

### getAddr

Gets an address record for a specified name.

Input:

- `name`: string
  - Target name
- `coinType`: string? | number?
  - Target coin
  - Defaults to 60 (ETH) if undefined

Output:

- string | null
  - Address record value

### burnFuses

Creates a transaction to burn fuses on a specified wrapped name.

Input:

- `name`: string
  - Target name
- `fusesToBurn`: object
  - Object of fuses intended to be burned.

Output:

- transaction

### createSubname

Creates a subname using the specified contract.

Input:

- object
  - `name`: string
    - Target name
  - `owner`: string
    - New owner of subname
  - `contract`: `registry` | `nameWrapper`
    - Target contract
  - `resolverAddress`: string?
    - Resolver address for name
  - `shouldWrap`: boolean?
    - _Only valid with NameWrapper contract_
    - Initial name wrapped state
  - `fuses`: object?
    - _Only valid with NameWrapper contract_
    - Initial fuses to be burned

Output:

- transaction

### deleteSubname

Deletes a subname using the specified contract.

Input:

- `name`: string
  - Target name
- `contract`: `registry` | `nameWrapper`
  - Target contract

Output:

- transaction

### transferSubname

Transfers a subname using the specified contract.
**Please note that transferring a wrapped name using this method will unwrap the name.**

Input:

- `name`: string
  - Target name
- `contract`: `registry` | `nameWrapper`
  - Target contract
- `address`: string
  - Address to transfer name to

Output:

- transaction

### setName

Sets the primary name for a specified address.

Input:

- `name`: string
  - Name to set
- `address`: string?
  - _Setting other primary names requires authorisation_
  - Address to set name for
- `resolver`: string?
  - _Setting other primary names requires authorisation_
  - Target resolver

Output:

- transaction

### setRecords

Sets multiple records at once for the specified name.

Input:

- `name`: string
  - Target name
- `records`: object
  - `contentHash`: string?
    - Formatted and encoded content hash
  - `texts`: array?
    - object
      - `key`: string
        - Text key
      - `value`: string
        - Text value
  - `coinTypes`: array?
    - object
      - `key`: string
        - Coin name or ID
      - `value`: string
        - Coin address

Output:

- transaction

### setResolver

Sets the resolver for the specified name, using the specified contract.

Input:

- `name`: string
  - Target Name
- `contract`: `registry` | `nameWrapper`
  - Target contract
- `resolver`: string?
  - _Leaving this undefined will use the default public resolver_

Output:

- transaction

### transferName

Transfers a name, using the specified contract.

Input:

- `name`: string
  - Target name
- `newOwner`: string
  - Address to transfer name to
- `contract`: `registry` | `nameWrapper` | `baseRegistrar`
  - Target contract

Output:

- transaction

### wrapName

Wraps a name.

Input:

- `name`: string
  - Target name
- `wrappedOwner`: string
  - New owner of wrapped name
- `fuseOptions`: object?
  - Initial fuses to burn
- `resolverAddress`: string?
  - Initial resolver address

Output:

- transaction

### unwrapName

Unwraps a name.

Input:

- `name`: string
  - Target name
- `newController`: string
  - New controller for name
- `newRegistrant`: string?
  - New registrant for name

Output:

- transaction

### universalWrapper

Wraps a function so it is directed to the universal resolver instead of the default public resolver.

Input:

- `name`: string
  - Name to resolve
- `data`: string
  - Hex encoded function data

Output:

- object
  - `data`: string
    - Hex encoded function result
  - `resolver`: string
    - Used resolver address

Examples for universalWrapper can be found in `getSpecificRecord`.

### resolverMulticallWrapper

Wraps multiple resolver calls so they are made into a single resolver multicall.

Input:

- array
  - object
    - `to`: string
      - Placeholder for standard function calls, ignore this.
    - `data`: string
      - Hex encoded function data

Output:

- array
  - string
    - Hex encoded function result

Examples for resolverMulticallWrapper can be found in `getProfile`.
