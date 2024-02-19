// Only overwrite this if we are in test mode. This is an env var we happen to have in our repo
class ESBuildAndJSDOMCompatibleTextEncoder extends TextEncoder {
  // eslint-disable-next-line class-methods-use-this
  encode(input: string) {
    if (typeof input !== 'string') {
      throw new TypeError('`input` must be a string')
    }

    const decodedURI = decodeURIComponent(encodeURIComponent(input))
    const arr = new Uint8Array(decodedURI.length)
    const chars = decodedURI.split('')
    for (let i = 0; i < chars.length; i += 1) {
      arr[i] = decodedURI[i].charCodeAt(0)
    }
    return arr
  }
}

Object.defineProperty(global, 'TextEncoder', {
  value: ESBuildAndJSDOMCompatibleTextEncoder,
  writable: true,
})
