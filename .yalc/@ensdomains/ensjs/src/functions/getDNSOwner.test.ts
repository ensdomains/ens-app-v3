import nock from 'nock'
import getDNSOwner, { encodeURLParams } from './getDNSOwner'

function hexDecode(string: string) {
  const bytes: any[] = []
  string.replace(/../g, (pair) => {
    bytes.push(parseInt(pair, 16))
    return pair
  })
  return new Uint8Array(bytes).buffer
}

describe('encodeURLParams', () => {
  it('should encodeURLParams', () => {
    const p: { [key: string]: string } = {
      a: 'b',
      c: 'd',
    }
    const expected = 'a=b&c=d'
    const actual = encodeURLParams(p)
    expect(actual).toEqual(expected)
  })
})

describe('getDNSOwner', () => {
  it('should return the address from the result of a dnsQuery', async () => {
    const dnsName = 'brantly.xyz'

    nock('https://cloudflare-dns.com:443', {
      encodedQueryParams: true,
    })
      .get('/dns-query')
      .query((queryObject) => {
        return (
          queryObject.ct === 'application/dns-udpwireformat' &&
          queryObject.dns ===
            'AAEBAAABAAAAAAABBF9lbnMHYnJhbnRseQN4eXoAABAAAQAAKRAAAACAAAAA'
        )
      })
      .reply(
        200,
        Buffer.from(
          hexDecode(
            '000181a00001000200000001045f656e73076272616e746c790378797a0000100001c00c0010000100000e10002d2c613d307839383331313033303936323044393131373331416330393332323139616630363039316236373434c00c002e000100000e10009f0010080300000e1062df366962c23569d89d076272616e746c790378797a0039c894ca1d7a60c1356e478066d39961a78ec1edbe62e1eb0f13d7947bb72097654648dc79be075ca32625f02e60267f45e88d7c05e9c3ec0cf21ab2dca67a8fbeb8e995644726357628446b888a144cafef5cbfca120c6511fe36de9d3c62dee27680825190c5404ca503904b98dbf62d9122f6fda393dc04b14a89ceb68c7a00002904d0000080000000',
          ),
        ),
        [
          'Server',
          'cloudflare',
          'Date',
          'Wed, 06 Jul 2022 23:37:28 GMT',
          'Content-Type',
          'application/dns-message',
          'Connection',
          'close',
          'Access-Control-Allow-Origin',
          '*',
          'Content-Length',
          '273',
          'CF-RAY',
          '726c2b1d3bab6b74-TPE',
        ],
      )
    expect(await getDNSOwner({}, dnsName)).toEqual(
      '0x983110309620D911731Ac0932219af06091b6744',
    )
  })
  it('should throw if there is an error in the DNS query', async () => {
    const dnsName = 'nick.xyz'

    nock('https://cloudflare-dns.com:443', {
      encodedQueryParams: true,
    })
      .get('/dns-query')
      .query((queryObject) => {
        return (
          queryObject.ct === 'application/dns-udpwireformat' &&
          queryObject.dns ===
            'AAEBAAABAAAAAAABBF9lbnMEbmljawN4eXoAABAAAQAAKRAAAACAAAAA'
        )
      })
      .reply(
        200,
        Buffer.from(
          hexDecode(
            '000181830001000000010001045f656e73046e69636b0378797a0000100001c0110006000100000258003b046e7337310d646f6d61696e636f6e74726f6c03636f6d0003646e73056a6f6d6178036e6574007876d1800000708000001c2000093a800000025800002904d0000080000000',
          ),
        ),
        [
          'Server',
          'cloudflare',
          'Date',
          'Wed, 06 Jul 2022 23:37:28 GMT',
          'Content-Type',
          'application/dns-message',
          'Connection',
          'close',
          'Access-Control-Allow-Origin',
          '*',
          'Content-Length',
          '273',
          'CF-RAY',
          '726c2b1d3bab6b74-TPE',
        ],
      )
    try {
      await getDNSOwner({}, dnsName)
    } catch (error: any) {
      expect(error.message).toEqual('DNS query failed: NXDOMAIN')
    }
  })
})
