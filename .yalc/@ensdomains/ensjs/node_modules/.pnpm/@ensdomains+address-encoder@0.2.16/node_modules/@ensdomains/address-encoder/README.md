# address-encoder
This typescript library encodes and decodes address formats for various cryptocurrencies.

Text-format addresses are decoded into their native binary representations, and vice-versa. In the case of Bitcoin-derived chains, this means their scriptPubKey; for Ethereum-derived chains this is their hash.

This library was written for use with [EIP 2304](https://eips.ethereum.org/EIPS/eip-2304), but may be useful for anyone looking for a general purpose cryptocurrency address codec.

EVM compatible chains are either specified using SLIP44 coinType or `0x800000000 | chainId` where 0x800000000 is msb (most significant bit) reserved at SLIP44 and no coin types exist in that range. This is to avoid number colision with th existing coin types.

For example, cointype of ARB1 is 2147441487(`0x80000000 | 42161`).

## Installation

### Using NPM

```
npm install --save @ensdomains/address-encoder
```

## Usage

```
import { formatsByName, formatsByCoinType } from '@ensdomains/address-encoder';

const data = formatsByName['BTC'].decoder('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
console.log(data.toString('hex')); // 76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac
const addr = formatsByCoinType[0].encoder(data);
console.log(addr); // 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
```

## Supported cryptocurrencies

This library currently supports the following cryptocurrencies and address formats (ordered alphabetically):

 - ABBC (base58 + ripemd160-checksum)
 - ADA (base58, no check + crc32-checksum and bech32)
 - AE (base58check)
 - AIB (base58check P2PKH and P2SH)
 - AION (hex)
 - ALGO (checksummed-base32)
 - AR (base64url)
 - ARB1 (checksummed-hex)
 - ARDR
 - ARK (base58check)
 - ATOM (bech32)
 - AVAX (bech32)
 - BCD (base58check P2PKH and P2SH, and bech32 segwit)
 - BCH (base58check and cashAddr; decodes to cashAddr)
 - BCN (base58xmr)
 - BDX (base58xmr)
 - BNB (bech32)
 - BPS (base58check P2PKH and P2SH)
 - BSC (checksummed-hex)
 - BSV (base58check)
 - BTC (base58check P2PKH and P2SH, and bech32 segwit)
 - BTG (base58check P2PKH and P2SH, and bech32 segwit)
 - BTM (bech32 segwit)
 - BTS (base58 + ripemd160-checksum)
 - CCA (base58check P2PKH and P2SH)
 - CCXX (base58check P2PKH and P2SH, and bech32 segwit)
 - CELO (checksummed-hex)
 - CKB (bech32)
 - CLO (checksummed-hex)
 - DASH (base58check P2PKH and P2SH)
 - DCR (base58, no check)
 - DGB (base58check P2PKH and P2SH, and bech32 segwit)
 - DIVI (base58check P2PKH and P2SH)
 - DOGE (base58check P2PKH and P2SH)
 - DOT (ss58)
 - EGLD (bech32)
 - ELA (base58)
 - EOS (base58 + ripemd160-checksum)
 - ETC (checksummed-hex)
 - ETH (checksummed-hex)
 - ETN (base58xmr)
 - EWT (checksummed-hex)
 - FIL (base10 + leb128 and base32 + blake2b checksum)
 - FIO (base58 + ripemd160-checksum)
 - FIRO (base58check P2PKH and P2SH)
 - FLOW (hex)
 - FTM (checksummed-hex)
 - GO (checksummed-hex)
 - GRIN (base58check)
 - GRS (base58check P2PKH and P2SH, and bech32 segwit)
 - GXC (base58 + ripemd160-checksum)
 - HBAR
 - HIVE (base58 + ripemd160-checksum)
 - HNS
 - HNT (base58check)
 - ICX
 - IOST (base58, no check)
 - IOTA (iotaBech32)
 - IOTX (bech32)
 - IRIS (bech32)
 - KAVA (bech32)
 - KMD (base58check)
 - KSM (ss58)
 - LCC (base58check P2PKH and P2SH, and bech32 segwit)
 - LRG (base58check P2PKH and P2SH)
 - LSK (hex with suffix)
 - LTC (base58check P2PHK and P2SH, and bech32 segwit)
 - LUNA (bech32)
 - MATIC (checksummed-hex)
 - MONA (base58check P2PKH and P2SH, and bech32 segwit)
 - NANO (nano-base32)
 - NAS(base58 + sha3-256-checksum)
 - NEAR
 - NEM(XEM) (base32)
 - NEO (base58check)
 - NMC (base58check)
 - NRG (checksummed-hex)
 - NULS (base58)
 - ONE (bech32)
 - ONT (base58check)
 - OPT (checksummed-hex)
 - POA (checksummed-hex)
 - PPC (base58check P2PKH and P2SH)
 - QTUM (base58check)
 - RDD (base58check P2PKH and P2SH)
 - RSK (checksummed-hex)
 - RUNE (bech32)
 - RVN (base58check P2PKH and P2SH)
 - SC (blake2b checksum)
 - SERO (base58, no check)
 - SOL (base58, no check)
 - SRM (base58, no check)
 - STEEM (base58 + ripemd160-checksum)
 - STRAT (base58check P2PKH and P2SH)
 - STX (crockford base32 P2PKH and P2SH + ripemd160-checksum)
 - SYS (base58check P2PKH and P2SH, and bech32 segwit)
 - TFUEL (checksummed-hex)
 - THETA (base58check)
 - TOMO (checksummed-hex)
 - TRX (base58check)
 - TT (checksummed-hex)
 - VET (checksummed-hex)
 - VIA (base58check P2PKH and P2SH)
 - VLX (base58, no check)
 - VSYS
 - WAN (checksummed-hex)
 - WAVES (base58)
 - WICC (base58check P2PKH and P2SH)
 - XCH (bech32m)
 - XDAI (checksummed-hex)
 - XHV (base58xmr)
 - XLM (ed25519 public key)
 - XMR (base58xmr)
 - XRP (base58check-ripple)
 - XTZ (base58check)
 - XVG (base58check P2PKH and P2SH)
 - ZEC (transparent addresses: base58check P2PKH and P2SH, and Sapling shielded payment addresses: bech32; doesn't support Sprout shielded payment addresses)
 - ZEL (transparent addresses: base58check P2PKH and P2SH, and Sapling shielded payment addresses: bech32; doesn't support Sprout shielded payment addresses)
 - ZEN (base58 check)
 - ZIL (bech32)


## Development guide

We welcome PRs to add additional chains and address types.

The hardest part of adding new cointype is to find out the address format of each coin. [Many coins derived from and share the same attributes as Bitcoin, Ethereum, and other popular blockchains](https://github.com/satoshilabs/slips/pull/1024/files). In that case, adding these coins can be as easy as a few lines of code. However, if the address format is unique and no js libraries available (or existing library file size too big), then you may have to port the encoding/verification from other languages into js by yourself, which could become time-consuming with lots of effort.

In either case, please follow the following guides and best practices.

## Reference where the address format is specified.

When we review your pull request, we conduct the following checks.

- The cointype correctly came from [SLIP 44 ](https://github.com/satoshilabs/slips/blob/master/slip-0044.md). If you don't find your coin in the list, raise PR to add it ([example](https://github.com/satoshilabs/slips/pull/1024))
- Check coin address from block explorer and compare that the test addresses are in a similar format
- Read the reference code to see the pull request matches with the specification.

Please make sure that you include all the reference information so that we don't have to spend hours googling the relevant info which you must have done already.

## Reuse existing functions where necessary.

If there are reusable components, please reuse the function rather than duplicating the similar code.

## Avoid requiring big encoding/encryption library.

This library will be used in many mobile wallets where size bloat impacts the performance of the wallet. If your solution simply imports existing libraries, it may

## Validate address format, not just encode/decode

Some specifications simply use base58 encoding without specific checksum. However, if there are any extra address format (such as address prefix or address length) exists, please also add that check so that we can prevent users from adding wrong coin address.
