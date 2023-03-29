import { _fetchData } from '@ethersproject/web'
import * as packet from 'dns-packet'

export function encodeURLParams(p: { [key: string]: string }): string {
  return Object.entries(p)
    .map((kv) => kv.map(encodeURIComponent).join('='))
    .join('&')
}

export const getDNS = async (q: packet.Packet): Promise<packet.Packet> => {
  const url = `https://cloudflare-dns.com/dns-query?${encodeURLParams({
    ct: 'application/dns-udpwireformat',
    dns: packet.encode(q)?.toString('base64'),
    ts: Date.now().toString(),
  })}`
  const response = await _fetchData(url, undefined)
  const arrayBuffer = response.buffer.slice(
    response.byteOffset,
    response.byteLength + response.byteOffset,
  )
  const fromArrayBuffer = Buffer.from(arrayBuffer)
  return packet.decode(fromArrayBuffer)
}

export const dnsQuery = async (
  qtype: string,
  qname: string,
): Promise<packet.Packet> => {
  const query: packet.Packet = {
    type: 'query',
    id: 1,
    flags: packet.RECURSION_DESIRED,
    questions: [
      {
        type: qtype,
        class: 'IN',
        name: qname,
      },
    ],
    additionals: [
      {
        type: 'OPT',
        class: 'IN',
        name: '.',
        udpPayloadSize: 4096,
        flags: packet.DNSSEC_OK,
      },
    ],
    answers: [],
  }

  const response = await getDNS(query)
  if (response.rcode !== 'NOERROR') {
    throw new Error(`DNS query failed: ${response.rcode}`)
  }
  return response
}

export default async function (_: any, dnsName: string) {
  const result = await dnsQuery('TXT', `_ens.${dnsName}`)
  const address = result?.answers?.[0]?.data?.[0]?.toString()?.split('=')?.[1]
  return address
}
