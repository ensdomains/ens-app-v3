import packet from 'dns-packet'
export const hexEncodeName = (name) =>
  `0x${packet.name.encode(name).toString('hex')}`
