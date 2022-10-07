js-multibase
============

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](https://protocol.ai)
[![](https://img.shields.io/badge/project-multiformats-blue.svg?style=flat-square)](https://github.com/multiformats/multiformats)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](https://webchat.freenode.net/?channels=%23ipfs)
[![Dependency Status](https://david-dm.org/multiformats/js-multibase.svg?style=flat-square)](https://david-dm.org/multiformats/js-multibase)
[![codecov](https://img.shields.io/codecov/c/github/multiformats/js-multibase.svg?style=flat-square)](https://codecov.io/gh/multiformats/js-multibase)
[![Travis CI](https://flat.badgen.net/travis/multiformats/js-multibase)](https://travis-ci.com/multiformats/js-multibase)

> JavaScript implementation of the [multibase](https://github.com/multiformats/multibase) specification

## Lead Maintainer

[Hugo Dias](https://github.com/hugomrdias)

## Table of Contents

- [Install](#install)
  - [NPM](#npm)
  - [In the Browser through `<script>` tag](#in-the-browser-through-script-tag)
- [Usage](#usage)
  - [Example](#example)
- [API](#api)
  - [`multibase` - Prefixes an encoded buffer with its multibase code](#multibase---prefixes-an-encoded-buffer-with-its-multibase-code)
  - [`multibase.encode` - Encodes a buffer into one of the supported encodings, prefixing it with the multibase code](#multibaseencode---encodes-a-buffer-into-one-of-the-supported-encodings-prefixing-it-with-the-multibase-code)
  - [`multibase.decode` - Decodes a buffer or string](#multibasedecode---decodes-a-buffer-or-string)
  - [`multibase.isEncoded` - Checks if buffer or string is encoded](#multibaseisencoded---checks-if-buffer-or-string-is-encoded)
  - [`multibase.names` - Supported base encoding names](#multibasenames)
  - [`multibase.codes` - Supported base encoding codes](#multibasecodes)
  - [Supported Encodings, see `src/constants.js`](#supported-encodings-see-srcconstantsjs)
- [Architecture and Encoding/Decoding](#architecture-and-encodingdecoding)
- [Adding additional bases](#adding-additional-bases)
- [License](#license)

## Install

### NPM

```sh
$ npm install --save multibase
```

The type definitions for this package are available on http://definitelytyped.org/. To install just use:

```sh
$ npm install -D @types/multibase
```

### In the Browser through `<script>` tag

Loading this module through a script tag will make the ```Multibase``` obj available in the global namespace.

```html
<script src="https://unpkg.com/multibase/dist/index.min.js"></script>
```

## Usage

### Example

```JavaScript
const { Buffer } = require('buffer')
const multibase = require('multibase')

const encodedBuf = multibase.encode('base58btc', new Buffer('hey, how is it going'))

const decodedBuf = multibase.decode(encodedBuf)
console.log(decodedBuf.toString())
// hey, how is it going
```

## API
https://multiformats.github.io/js-multibase/

#### `multibase` - Prefixes an encoded buffer with its multibase code

```
const multibased = multibase(<nameOrCode>, encodedBuf)
```

#### `multibase.encode` - Encodes a buffer into one of the supported encodings, prefixing it with the multibase code

```JavaScript
const encodedBuf = multibase.encode(<nameOrCode>, <buf>)
```

#### `multibase.decode` - Decodes a buffer or string

```JavaScript
const decodedBuf = multibase.decode(bufOrString)
```

#### `multibase.isEncoded` - Checks if buffer or string is encoded

```JavaScript
const value = multibase.isEncoded(bufOrString)
// value is the name of the encoding if it is encoded, false otherwise
```

#### `multibase.encoding` - Get the encoding by name or code

```JavaScript
const value = multibase.encoding(nameOrCode)
// value is an instance of the corresponding `Base`
```

#### `multibase.encodingFromData` - Get the encoding from data either a `string` or `Buffer`

```JavaScript
const value = multibase.encodingFromData(data)
// value is an instance of the corresponding `Base`
```

#### `multibase.names`

A frozen `Object` of supported base encoding names mapped to the corresponding `Base` instance.

#### `multibase.codes`

A frozen `Object` of supported base encoding codes  mapped to the corresponding `Base` instance.

### Supported Encodings, see [`src/constants.js`](/src/constants.js)

## Contribute

Contributions welcome. Please check out [the issues](https://github.com/multiformats/js-multibase/issues).

Check out our [contributing document](https://github.com/multiformats/multiformats/blob/master/contributing.md) for more information on how we work, and about contributing in general. Please be aware that all interactions related to multiformats are subject to the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT](LICENSE) © Protocol Labs Inc.
