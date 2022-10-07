// @ts-check
/* eslint-disable guard-for-in */
/**
 * Multihash implementation in JavaScript.
 *
 * @module multihash
 */
'use strict'

const { Buffer } = require('buffer')
const multibase = require('multibase')
const varint = require('varint')
const { names } = require('./constants')
const { TextDecoder } = require('web-encoding')

const textDecoder = new TextDecoder()
const codes = {}

for (const key in names) {
  codes[names[key]] = key
}
exports.names = names
exports.codes = Object.freeze(codes)

/**
 * Convert the given multihash to a hex encoded string.
 *
 * @param {Uint8Array} hash
 * @returns {string}
 */
exports.toHexString = function toHexString (hash) {
  if (!(hash instanceof Uint8Array)) {
    throw new Error('must be passed a Uint8Array')
  }

  const buffer = Buffer.isBuffer(hash)
    ? hash
    : Buffer.from(hash.buffer, hash.byteOffset, hash.byteLength)

  return buffer.toString('hex')
}

/**
 * Convert the given hex encoded string to a multihash.
 *
 * @param {string} hash
 * @returns {Buffer}
 */
exports.fromHexString = function fromHexString (hash) {
  return Buffer.from(hash, 'hex')
}

/**
 * Convert the given multihash to a base58 encoded string.
 *
 * @param {Uint8Array} hash
 * @returns {string}
 */
exports.toB58String = function toB58String (hash) {
  if (!(hash instanceof Uint8Array)) {
    throw new Error('must be passed a Uint8Array')
  }

  return textDecoder.decode(multibase.encode('base58btc', hash)).slice(1)
}

/**
 * Convert the given base58 encoded string to a multihash.
 *
 * @param {string|Uint8Array} hash
 * @returns {Buffer}
 */
exports.fromB58String = function fromB58String (hash) {
  const encoded = hash instanceof Uint8Array
    ? textDecoder.decode(hash)
    : hash

  return multibase.decode('z' + encoded)
}

/**
 * Decode a hash from the given multihash.
 *
 * @param {Uint8Array} bytes
 * @returns {{code: number, name: string, length: number, digest: Buffer}} result
 */
exports.decode = function decode (bytes) {
  if (!(bytes instanceof Uint8Array)) {
    throw new Error('multihash must be a Uint8Array')
  }
  let buf = Buffer.isBuffer(bytes)
    ? bytes
    : Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)

  if (buf.length < 2) {
    throw new Error('multihash too short. must be > 2 bytes.')
  }

  const code = varint.decode(buf)
  if (!exports.isValidCode(code)) {
    throw new Error(`multihash unknown function code: 0x${code.toString(16)}`)
  }
  buf = buf.slice(varint.decode.bytes)

  const len = varint.decode(buf)
  if (len < 0) {
    throw new Error(`multihash invalid length: ${len}`)
  }
  buf = buf.slice(varint.decode.bytes)

  if (buf.length !== len) {
    throw new Error(`multihash length inconsistent: 0x${buf.toString('hex')}`)
  }

  return {
    code,
    name: codes[code],
    length: len,
    digest: buf
  }
}

/**
 *  Encode a hash digest along with the specified function code.
 *
 * > **Note:** the length is derived from the length of the digest itself.
 *
 * @param {Uint8Array} digest
 * @param {string|number} code
 * @param {number} [length]
 * @returns {Buffer}
 */
exports.encode = function encode (digest, code, length) {
  if (!digest || code === undefined) {
    throw new Error('multihash encode requires at least two args: digest, code')
  }

  // ensure it's a hashfunction code.
  const hashfn = exports.coerceCode(code)

  if (!(digest instanceof Uint8Array)) {
    throw new Error('digest should be a Uint8Array')
  }

  if (length == null) {
    length = digest.length
  }

  if (length && digest.length !== length) {
    throw new Error('digest length should be equal to specified length.')
  }

  const hash = varint.encode(hashfn)
  const len = varint.encode(length)
  const buffer = Buffer.alloc(hash.length + len.length + digest.length)
  buffer.set(hash, 0)
  buffer.set(len, hash.length)
  buffer.set(digest, hash.length + len.length)
  return buffer
}

/**
 * Converts a hash function name into the matching code.
 * If passed a number it will return the number if it's a valid code.
 * @param {string|number} name
 * @returns {number}
 */
exports.coerceCode = function coerceCode (name) {
  let code = name

  if (typeof name === 'string') {
    if (names[name] === undefined) {
      throw new Error(`Unrecognized hash function named: ${name}`)
    }
    code = names[name]
  }

  if (typeof code !== 'number') {
    throw new Error(`Hash function code should be a number. Got: ${code}`)
  }

  if (codes[code] === undefined && !exports.isAppCode(code)) {
    throw new Error(`Unrecognized function code: ${code}`)
  }

  return code
}

/**
 * Checks wether a code is part of the app range
 *
 * @param {number} code
 * @returns {boolean}
 */
exports.isAppCode = function appCode (code) {
  return code > 0 && code < 0x10
}

/**
 * Checks whether a multihash code is valid.
 *
 * @param {number} code
 * @returns {boolean}
 */
exports.isValidCode = function validCode (code) {
  if (exports.isAppCode(code)) {
    return true
  }

  if (codes[code]) {
    return true
  }

  return false
}

/**
 * Check if the given buffer is a valid multihash. Throws an error if it is not valid.
 *
 * @param {Uint8Array} multihash
 * @returns {void}
 * @throws {Error}
 */
function validate (multihash) {
  exports.decode(multihash) // throws if bad.
}
exports.validate = validate

/**
 * Returns a prefix from a valid multihash. Throws an error if it is not valid.
 *
 * @param {Uint8Array} multihash
 * @returns {Buffer}
 * @throws {Error}
 */
exports.prefix = function prefix (multihash) {
  validate(multihash)

  return Buffer.from(multihash.buffer, multihash.byteOffset, 2)
}
