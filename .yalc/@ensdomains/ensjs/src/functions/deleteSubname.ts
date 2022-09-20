import { ENSArgs } from '..'

export default async function (
  { transferSubname, signer }: ENSArgs<'transferSubname' | 'signer'>,
  name: string,
  {
    contract,
  }: {
    contract: 'registry' | 'nameWrapper'
  },
) {
  return transferSubname.populateTransaction(name, {
    contract,
    owner: '0x0000000000000000000000000000000000000000',
    signer,
  })
}
