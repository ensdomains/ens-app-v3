import { ENSArgs } from '..'

export default async function (
  { transferSubname }: ENSArgs<'transferSubname'>,
  name: string,
  {
    contract,
  }: {
    contract: 'registry' | 'nameWrapper'
  },
) {
  return transferSubname.populateTransaction(name, {
    contract,
    address: '0x0000000000000000000000000000000000000000',
  })
}
