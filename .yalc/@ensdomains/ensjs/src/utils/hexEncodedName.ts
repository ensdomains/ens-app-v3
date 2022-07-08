import packet from 'dns-packet'

export const hexEncodeName = (name: string) =>
  `0x${packet.name.encode(name).toString('hex')}`
