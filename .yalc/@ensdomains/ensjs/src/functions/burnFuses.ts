import { ENSArgs } from '..'
import { fuseEnum, unnamedFuses } from '../utils/fuses'
import { namehash } from '../utils/normalise'

type FuseObj = typeof fuseEnum
type UnnamedFuseType = typeof unnamedFuses
type Fuse = keyof FuseObj
type NamedFuseValues = FuseObj[Fuse]
type UnnamedFuseValues = UnnamedFuseType[number]

// We need this type so that the following type isn't infinite. This type limits the max length of the fuse array to 7.
type FuseArrayPossibilities =
  | [Fuse]
  | [Fuse, Fuse]
  | [Fuse, Fuse, Fuse]
  | [Fuse, Fuse, Fuse, Fuse]
  | [Fuse, Fuse, Fuse, Fuse, Fuse]
  | [Fuse, Fuse, Fuse, Fuse, Fuse, Fuse]
  | [Fuse, Fuse, Fuse, Fuse, Fuse, Fuse, Fuse]

/**
 * This type creates a type error if there are any duplicate fuses.
 * It effectively works like a reduce function, starting with 0 included types, adding a type each time, and then checking for duplicates.
 *
 * @template A The array to check for duplicates.
 * @template B The union of all checked existing types.
 */
// CLAUSE A: This extension unwraps the type as a fuse tuple.
type FusesWithoutDuplicates<A, B = never> = A extends FuseArrayPossibilities
  ? // CLAUSE A > TRUE: CLAUSE B: Pick out the first item in the current array, separating the current item from the rest.
    A extends [infer Head, ...infer Tail]
    ? // CLAUSE B > TRUE: CLAUSE C: Check if the current item is a duplicate based on the input union.
      Head extends B
      ? // CLAUSE C > TRUE: Duplicate found, return an empty array to throw a type error.
        []
      : // CLAUSE C > FALSE: Return a new array to continue the recursion, adds the current item type to the union.
        [Head, ...FusesWithoutDuplicates<Tail, Head | B>]
    : // CLAUSE B > FALSE: Return the input array as there is no more array elements to check.
      A
  : // CLAUSE A > FALSE: Return an empty array as it isn't a fuse tuple.
    []

type FusePropsNamedArray<A extends FuseArrayPossibilities> = {
  namedFusesToBurn: FusesWithoutDuplicates<A>
}

type FusePropsUnnamedArray = {
  unnamedFusesToBurn: UnnamedFuseValues[]
}

type FusePropsNumber = {
  fuseNumberToBurn: number
}

type FuseProps<A extends FuseArrayPossibilities> =
  | (Partial<FusePropsNamedArray<A>> & FusePropsUnnamedArray)
  | (FusePropsNamedArray<A> & Partial<FusePropsUnnamedArray>)
  | FusePropsNumber

export default async function <A extends FuseArrayPossibilities>(
  { contracts, signer }: ENSArgs<'contracts' | 'signer'>,
  name: string,
  props: FuseProps<A>,
) {
  const isNumber = 'fuseNumberToBurn' in props
  const hasNamedArray = 'namedFusesToBurn' in props
  const hasUnnamedArray = 'unnamedFusesToBurn' in props

  let encodedFuses: number = 0

  if (isNumber) {
    if (props.fuseNumberToBurn > 2 ** 32 || props.fuseNumberToBurn < 1) {
      throw new Error(
        `Fuse number must be limited to uint32, ${
          props.fuseNumberToBurn
        } was too ${props.fuseNumberToBurn < 1 ? 'low' : 'high'}.`,
      )
    } else if (props.fuseNumberToBurn % 1 !== 0) {
      throw new Error(
        `Fuse number must be an integer, ${props.fuseNumberToBurn} was not.`,
      )
    }
    encodedFuses = props.fuseNumberToBurn
  } else {
    if (!hasNamedArray && !hasUnnamedArray) {
      throw new Error('Please provide fuses to burn')
    }
    if (hasNamedArray) {
      for (const fuse of props.namedFusesToBurn!) {
        if (!(fuse in fuseEnum)) {
          throw new Error(`${fuse} is not a valid named fuse.`)
        }
        encodedFuses |= fuseEnum[fuse]
      }
    }
    if (hasUnnamedArray) {
      for (const fuse of props.unnamedFusesToBurn!) {
        if (!unnamedFuses.includes(fuse)) {
          throw new Error(
            `${fuse} is not a valid unnamed fuse. If you are trying to burn a named fuse, use the namedFusesToBurn property.`,
          )
        }
        encodedFuses |= fuse
      }
    }
  }

  const nameWrapper = (await contracts?.getNameWrapper()!).connect(signer)
  const hash = namehash(name)

  return nameWrapper.populateTransaction.setFuses(hash, encodedFuses)
}
