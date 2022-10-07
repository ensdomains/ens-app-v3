// @ts-check
'use strict'

const { Buffer } = require('buffer')
const { TextEncoder, TextDecoder } = require('web-encoding')

const textDecoder = new TextDecoder()
/**
 * @param {ArrayBufferView|ArrayBuffer} bytes
 * @returns {string}
 */
const decodeText = (bytes) => textDecoder.decode(bytes)

const textEncoder = new TextEncoder()
/**
 * @param {string} text
 * @returns {Uint8Array}
 */
const encodeText = (text) => textEncoder.encode(text)

/**
 * @param {ArrayBufferView} bytes
 * @returns {Buffer}
 */
const asBuffer = ({ buffer, byteLength, byteOffset }) =>
  Buffer.from(buffer, byteOffset, byteLength)

module.exports = { decodeText, encodeText, asBuffer }
