import { namehash } from './normalise'

export const makeOtherIndexes = (data: string, findStr: string) =>
  Array.from(data.matchAll(findStr as any)).map((x: any) => x.index / 2 - 1)

export const makeNamehashIndexes = (data: string, name: string) =>
  Array.from(data.matchAll(namehash(name).substring(2) as any)).map(
    (x: any) => x.index / 2 - 1,
  )
