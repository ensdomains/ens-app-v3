import { PublicResolver__factory } from '../generated'
import { namehash } from './normalise'
import { generateRecordCallArray, generateSetAddr } from './recordHelpers'

describe('generateSetAddr()', () => {
  it('should allow empty string as address', () => {
    expect(() =>
      generateSetAddr(
        namehash('test'),
        'BNB',
        '',
        PublicResolver__factory.connect(
          '0x0000000000000000000000000000000000000000',
          undefined as any,
        ),
      ),
    ).not.toThrowError()
  })
})

describe('generateRecordCallArray()', () => {
  it('should allow empty string as contenthash', () => {
    expect(
      generateRecordCallArray(
        namehash('test'),
        { contentHash: '' },
        PublicResolver__factory.connect(
          '0x0000000000000000000000000000000000000000',
          undefined as any,
        ),
      ),
    ).toEqual([
      '0x304e6ade04f740db81dc36c853ab4205bddd785f46e79ccedca351fc6dfcbd8cc9a33dd600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000',
    ])
  })
})
