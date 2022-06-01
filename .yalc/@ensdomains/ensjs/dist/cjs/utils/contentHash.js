'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.encodeContenthash =
  exports.getProtocolType =
  exports.isValidContenthash =
  exports.validateContent =
  exports.decodeContenthash =
    void 0
const content_hash_1 = __importDefault(require('@ensdomains/content-hash'))
const ethers_1 = require('ethers')
const supportedCodecs = [
  'ipns-ns',
  'ipfs-ns',
  'swarm-ns',
  'onion',
  'onion3',
  'skynet-ns',
  'arweave-ns',
]
function matchProtocol(text) {
  return (
    text.match(/^(ipfs|sia|ipns|bzz|onion|onion3|arweave):\/\/(.*)/) ||
    text.match(/\/(ipfs)\/(.*)/) ||
    text.match(/\/(ipns)\/(.*)/)
  )
}
function decodeContenthash(encoded) {
  let decoded, protocolType, error
  if (!encoded || encoded === '0x') {
    return {}
  }
  if (encoded.error) {
    return { protocolType: null, decoded: encoded.error }
  } else if (encoded === false) {
    return { protocolType: null, decoded: 'invalid value' }
  }
  if (encoded) {
    try {
      decoded = content_hash_1.default.decode(encoded)
      const codec = content_hash_1.default.getCodec(encoded)
      if (codec === 'ipfs-ns') {
        protocolType = 'ipfs'
      } else if (codec === 'ipns-ns') {
        protocolType = 'ipns'
      } else if (codec === 'swarm-ns') {
        protocolType = 'bzz'
      } else if (codec === 'onion') {
        protocolType = 'onion'
      } else if (codec === 'onion3') {
        protocolType = 'onion3'
      } else if (codec === 'skynet-ns') {
        protocolType = 'sia'
      } else if (codec === 'arweave-ns') {
        protocolType = 'arweave'
      } else {
        decoded = encoded
      }
    } catch (e) {
      error = e.message
    }
  }
  return { protocolType, decoded, error }
}
exports.decodeContenthash = decodeContenthash
function validateContent(encoded) {
  return (
    content_hash_1.default.isHashOfType(
      encoded,
      content_hash_1.default.Types.ipfs,
    ) ||
    content_hash_1.default.isHashOfType(
      encoded,
      content_hash_1.default.Types.swarm,
    )
  )
}
exports.validateContent = validateContent
function isValidContenthash(encoded) {
  try {
    const codec = content_hash_1.default.getCodec(encoded)
    return (
      ethers_1.utils.isHexString(encoded) && supportedCodecs.includes(codec)
    )
  } catch (e) {
    console.log(e)
  }
}
exports.isValidContenthash = isValidContenthash
function getProtocolType(encoded) {
  let protocolType, decoded
  try {
    let matched = matchProtocol(encoded)
    if (matched) {
      protocolType = matched[1]
      decoded = matched[2]
    }
    return {
      protocolType,
      decoded,
    }
  } catch (e) {
    console.log(e)
  }
}
exports.getProtocolType = getProtocolType
function encodeContenthash(text) {
  let content = text
  let contentType
  let encoded = false
  let error
  if (!!text) {
    let matched = matchProtocol(text)
    if (matched) {
      contentType = matched[1]
      content = matched[2]
    }
    try {
      if (contentType === 'ipfs') {
        if (content.length >= 4) {
          encoded = '0x' + content_hash_1.default.encode('ipfs-ns', content)
        }
      } else if (contentType === 'ipns') {
        encoded = '0x' + content_hash_1.default.encode('ipns-ns', content)
      } else if (contentType === 'bzz') {
        if (content.length >= 4) {
          encoded = '0x' + content_hash_1.default.fromSwarm(content)
        }
      } else if (contentType === 'onion') {
        if (content.length == 16) {
          encoded = '0x' + content_hash_1.default.encode('onion', content)
        }
      } else if (contentType === 'onion3') {
        if (content.length == 56) {
          encoded = '0x' + content_hash_1.default.encode('onion3', content)
        }
      } else if (contentType === 'sia') {
        if (content.length == 46) {
          encoded = '0x' + content_hash_1.default.encode('skynet-ns', content)
        }
      } else if (contentType === 'arweave') {
        if (content.length == 43) {
          encoded = '0x' + content_hash_1.default.encode('arweave-ns', content)
        }
      } else {
        console.warn('Unsupported protocol or invalid value', {
          contentType,
          text,
        })
      }
    } catch (err) {
      const errorMessage = 'Error encoding content hash'
      console.warn(errorMessage, { text, encoded })
      error = errorMessage
      //throw 'Error encoding content hash'
    }
  }
  return { encoded, error }
}
exports.encodeContenthash = encodeContenthash
