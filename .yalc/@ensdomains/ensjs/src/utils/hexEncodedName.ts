import packet from 'dns-packet'

export const hexEncodeName = (name: string) =>
  `0x${packet.name.encode(name).toString('hex')}`

export const hexDecodeName = (hex: string): string =>
  packet.name.decode(Buffer.from(hex.slice(2), 'hex')).toString()
