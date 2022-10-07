# IDNA-UTS #46 in JavaScript

[![npm version](https://img.shields.io/npm/v/idna-uts46-hx.svg?style=flat)](https://www.npmjs.com/package/idna-uts46-hx)
[![node](https://img.shields.io/node/v/idna-uts46-hx.svg)](https://www.npmjs.com/package/idna-uts46-hx)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![build](https://travis-ci.com/hexonet/idna-uts46.svg?branch=master)](https://travis-ci.com/hexonet/idna-uts46)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hexonet/idna-uts46/blob/master/CONTRIBUTING.md)

This module is a IDNA UTS46 connector library for javascript.
This is a maintained fork of the idna-uts46 library originally written by jcranmer.

The [JS Punycode converter library](https://github.com/bestiejs/punycode.js/) is
a great tool for handling Unicode domain names, but it only implements the
Punycode encoding of domain labels, not the full IDNA algorithm. In simple
cases, a mere conversion to lowercase text before input would seem sufficient,
but the real mapping for strings is far more complex. This library implements
the full mapping for these strings, as defined by
[UTS #46](http://unicode.org/reports/tr46/).

## Resources

* [Usage Guide](https://github.com/hexonet/idna-uts46/blob/master/README.md#how-to-use-this-module-in-your-project)
* [Release Notes](https://github.com/hexonet/idna-uts46/releases)
* [Development Guide](https://github.com/hexonet/idna-uts46/wiki/Development-Guide)

## How to use this module in your project

### Requirements

* Installed nodejs/npm, if you plan running it on webserver-side. We suggest using [nvm](https://github.com/creationix/nvm).

### NodeJS Version Compatibility

| Version  | NodeJS |
| -------- | ------ |
| >= 3.2.2 | >= 9.x |
| >= 3.1.0 | >= 6.x |
| <= 3.0.0 | >= 4.x |

### Installation / Update

```bash
    npm i idna-uts46-hx@latest --save
```

### Usage Examples

We provide only documentation and examples for the latest release.

#### IDNA mess for dummies

Unfortunately, the situation of internationalized domain names is rather
complicated by the existence of multiple incompatible standards (IDNA2003 and
IDNA2008, predominantly). While UTS #46 tries to bridge the incompatibility,
there are four characters which cannot be so bridged: ß (the German sharp s),
ς (Greek final sigma), and the ZWJ and ZWNJ characters. These are handled
differently depending on the mode; in ``transitional`` mode, these strings are
mapped to different ones, preserving capability with IDNA2003; in
``nontransitional`` mode, these strings are mapped to themselves, in accordance
with IDNA2008.

Presently, this library uses ``transitional`` mode, compatible with all known
browser implementations at this point. It is expected that, in the future, this
will be changed to ``nontransitional`` mode.

`It is highly recommended that you use the ASCII form of the label for storing
or comparing strings.`

#### API

##### `uts46.toAscii(domain, options={transitional: false, useStd3ASCII: false, verifyDnsLength: false })`

Converts a domain name to the correct ASCII label. The second parameter is an
optional options parameter, which has two configurable options. The
`transitional` option controls whether or not transitional processing (see the
IDNA mess for dummies section for more details) is requested, defaulting to
false. The `useStd3ASCII` option controls whether or not characters that are
illegal in domain names per the DNS specification should be omitted. The
`verifyDnsLength` option controls whether or not the resulting DNS label should
be checked for length validity (i.e., no empty components and not too long). The
options parameter and its associated fields are all optional and should be
omitted for most users.

```js
/* eslint-disable */
uts46.toAscii('öbb.at') // 'xn-bb-eka.at'
uts46.toAscii('ÖBB.AT') // 'xn-bb-eka.at'
uts46.toAscii('XN-BB-EKA.AT') // 'xn-bb-eka.at'
uts46.toAscii('faß.de') // 'fass.de'
uts46.toAscii('faß.de', { transitional: true }) // 'fass.de'
uts46.toAscii('faß.de', { transitional: false }) // 'xn--fa-hia.de'
uts46.toAscii('xn--fa-hia.de', { transitional: false }) // 'xn--fa-hia.de'
uts46.toAscii(String.fromCodePoint(0xd0000)) // Error (as it is unassigned)
```

##### `uts46.toUnicode(domain, options={useStd3ASCII: false})`

Converts a domain name to a normalized Unicode label. The second parameter is an
optional options parameter. The `useStd3ASCII` option controls whether or not
characters that are illegal in domain names per the DNS specification should be
omitted. The latter parameter is optional and should be omitted for most users.

```js
/* eslint-disable */
uts46.toUnicode('xn-bb-eka.at') // 'öbb.at'
uts46.toUnicode('ÖBB.AT') // 'öbb.at'
uts46.toUnicode('O\u0308BB.AT') // 'öbb.at'
uts46.toUnicode('faß.de') // 'faß.de'
uts46.toUnicode('xn--fa-hia.de') // 'faß.de'
uts46.toUnicode('﷼') // "ریال"
uts46.toUnicode(String.fromCodePoint(0xd0000)) // Error (as it is unassigned)
```

##### `uts46.convert(domain)`

Converts a domain name in correct way. Returning IDNA2003 / IDNA2008 strings
where it makes sense as this is dependent on the domain extension / TLD.

```js
/* eslint-disable */
uts46.convert('xn-bb-eka.at') // { IDN: 'öbb.at', PC: 'xn-bb-eka.at' }
uts46.convert(['öbb.at', 'xn--fa-hia.de']) // { IDN: ['öbb.at', 'faß.de'], PC: ['xn-bb-eka.at', 'xn--fa-hia.de'] }
```

#### Using it in-browser

Use file `uts46bundle.js` as JavaScript include. The Tool will then be available as ispapiIdnconverter object in Javascript.

### Known issues

It also does not try to implement the Bidi and contextual rules for validation:
these do not affect any mapping of the domain names; instead, they restrict the
set of valid domain names. Since registrars shouldn't be accepting these names
in the first place, a domain that violates these rules will simply fail to
resolve.

## Contributing

Please read [our development guide](https://github.com/hexonet/idna-uts46/wiki/Development-Guide) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

NOTE: As mentioned, initial work done by jcranmer.

* **Kai Schwarz** - *lead development* - [PapaKai](https://github.com/papakai)

See also the list of [contributors](https://github.com/hexonet/idna-uts46/graphs/contributors) who participated in this project.

## License

MIT
