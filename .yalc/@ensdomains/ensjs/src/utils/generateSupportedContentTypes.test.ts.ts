import { generateSupportedContentTypes } from './generateSupportedContentTypes.js'

type FunctionParameters = Parameters<typeof generateSupportedContentTypes>
type EncodeAsParameter = FunctionParameters[0]

describe('generateSupportedContentTypes', () => {
  it.each([
    ['json', 1n],
    ['zlib', 2n],
    ['cbor', 4n],
    ['uri', 8n],
    ['unknown', 0n],
    [['json', 'zlib'], 3n],
    [['zlib', 'cbor'], 6n],
    [['cbor', 'uri'], 12n],
    [['json', 'zlib', 'cbor', 'uri'], 15n],
  ] as [EncodeAsParameter, bigint][])(
    'should return the correct bitwise value supportedContentTypes %p (%p)',
    (encodedAs, expected) => {
      const result = generateSupportedContentTypes(encodedAs)
      expect(result).toEqual(expected)
    },
  )
})
