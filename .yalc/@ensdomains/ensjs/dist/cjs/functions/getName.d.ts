import { ENSArgs } from '..'
declare const _default: {
  raw: (
    { contracts }: ENSArgs<'contracts'>,
    address: string,
  ) => Promise<{
    to: string
    data: string
  }>
  decode: (
    { contracts }: ENSArgs<'contracts'>,
    data: string,
    address: string,
  ) => Promise<{
    name: any
    match: boolean
  } | null>
}
export default _default
