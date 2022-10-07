// @ts-check
/**
 * Implementation of the [multibase](https://github.com/multiformats/multibase) specification.
 *
 * @module Multibase
 */
'use strict'

const { Buffer } = require('buffer')
const constants = require('./constants')
const { decodeText, asBuffer } = require('./util')

/** @typedef {import("./base")} Base */

/**
 * Create a new buffer with the multibase varint+code.
 *
 * @param {string|number} nameOrCode - The multibase name or code number.
 * @param {Uint8Array} buf - The data to be prefixed with multibase.
 * @returns {Buffer}
 * @throws {Error} Will throw if the encoding is not supported
 */
function multibase (nameOrCode, buf) {
  if (!buf) {
    throw new Error('requires an encoded buffer')
  }
  const { name, codeBuf } = encoding(nameOrCode)
  validEncode(name, buf)

  const buffer = Buffer.alloc(codeBuf.length + buf.length)
  buffer.set(codeBuf, 0)
  buffer.set(buf, codeBuf.length)

  return buffer
}

/**
 * Encode data with the specified base and add the multibase prefix.
 *
 * @param {string|number} nameOrCode - The multibase name or code number.
 * @param {Uint8Array} buf - The data to be encoded.
 * @returns {Buffer}
 * @throws {Error} Will throw if the encoding is not supported
 *
 */
function encode (nameOrCode, buf) {
  const enc = encoding(nameOrCode)

  return Buffer.concat([enc.codeBuf, Buffer.from(enc.encode(buf))])
}

/**
 * Takes a Uint8Array or string encoded with multibase header, decodes it and
 * returns the decoded buffer
 *
 * @param {Uint8Array|string} data
 * @returns {Buffer}
 * @throws {Error} Will throw if the encoding is not supported
 *
 */
function decode (data) {
  if (ArrayBuffer.isView(data)) {
    data = decodeText(data)
  }
  const prefix = data[0]

  // Make all encodings case-insensitive except the ones that include upper and lower chars in the alphabet
  if (['f', 'F', 'v', 'V', 't', 'T', 'b', 'B', 'c', 'C', 'h', 'k', 'K'].includes(prefix)) {
    data = data.toLowerCase()
  }
  const enc = encoding(data[0])
  return asBuffer(enc.decode(data.substring(1)))
}

/**
 * Is the given data multibase encoded?
 *
 * @param {Uint8Array|string} data
 * @returns {false|string}
 */
function isEncoded (data) {
  if (data instanceof Uint8Array) {
    data = decodeText(data)
  }

  // Ensure bufOrString is a string
  if (Object.prototype.toString.call(data) !== '[object String]') {
    return false
  }

  try {
    const enc = encoding(data[0])
    return enc.name
  } catch (err) {
    return false
  }
}

/**
 * Validate encoded data
 *
 * @param {string} name
 * @param {Uint8Array} buf
 * @returns {void}
 * @throws {Error} Will throw if the encoding is not supported
 */
function validEncode (name, buf) {
  const enc = encoding(name)
  enc.decode(decodeText(buf))
}

/**
 * Get the encoding by name or code
 *
 * @param {string|number} nameOrCode
 * @returns {Base}
 * @throws {Error} Will throw if the encoding is not supported
 */
function encoding (nameOrCode) {
  if (constants.names[nameOrCode]) {
    return constants.names[nameOrCode]
  } else if (constants.codes[nameOrCode]) {
    return constants.codes[nameOrCode]
  } else {
    throw new Error(`Unsupported encoding: ${nameOrCode}`)
  }
}

/**
 * Get encoding from data
 *
 * @param {string|Uint8Array} data
 * @returns {Base}
 * @throws {Error} Will throw if the encoding is not supported
 */
function encodingFromData (data) {
  if (data instanceof Uint8Array) {
    data = decodeText(data)
  }

  return encoding(data[0])
}

exports = module.exports = multibase
exports.encode = encode
exports.decode = decode
exports.isEncoded = isEncoded
exports.encoding = encoding
exports.encodingFromData = encodingFromData
exports.names = Object.freeze(constants.names)
exports.codes = Object.freeze(constants.codes)
