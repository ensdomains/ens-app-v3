// @ts-check
'use strict'
const { Buffer } = require('buffer')

/**
 * @typedef {Object} Codec
 * @property {function(Uint8Array):string} encode
 * @property {function(string):Uint8Array} decode
 *
 * @typedef {function(string):Codec} CodecFactory
 */

class Base {
  /**
   * @param {string} name
   * @param {string} code
   * @param {CodecFactory} implementation
   * @param {string} alphabet
   */
  constructor (name, code, implementation, alphabet) {
    this.name = name
    this.code = code
    this.codeBuf = Buffer.from(this.code)
    this.alphabet = alphabet
    this.engine = implementation(alphabet)
  }

  /**
   * @param {Uint8Array} buf
   * @returns {string}
   */
  encode (buf) {
    return this.engine.encode(buf)
  }

  /**
   * @param {string} string
   * @returns {Uint8Array}
   */
  decode (string) {
    for (const char of string) {
      if (this.alphabet && this.alphabet.indexOf(char) < 0) {
        throw new Error(`invalid character '${char}' in '${string}'`)
      }
    }
    return this.engine.decode(string)
  }
}

module.exports = Base
