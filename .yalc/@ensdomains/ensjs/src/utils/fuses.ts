// child named fuses
const CANNOT_UNWRAP = 1
const CANNOT_BURN_FUSES = 2
const CANNOT_TRANSFER = 4
const CANNOT_SET_RESOLVER = 8
const CANNOT_SET_TTL = 16
const CANNOT_CREATE_SUBDOMAIN = 32
const CANNOT_APPROVE = 64

// parent named fuses
const PARENT_CANNOT_CONTROL = 0x10000
const IS_DOT_ETH = 0x20000
const CAN_EXTEND_EXPIRY = 0x40000

// fuse ranges
export const CHILD_CONTROLLED_FUSES = 0x0000ffff
export const PARENT_CONTROLLED_FUSES = 0xffff0000
export const USER_SETTABLE_FUSES = 0xfffdffff

// empty fuse
const CAN_DO_EVERYTHING = 0

export const childFuseEnum = {
  CANNOT_UNWRAP,
  CANNOT_BURN_FUSES,
  CANNOT_TRANSFER,
  CANNOT_SET_RESOLVER,
  CANNOT_SET_TTL,
  CANNOT_CREATE_SUBDOMAIN,
  CANNOT_APPROVE,
} as const

export const parentFuseEnum = {
  PARENT_CANNOT_CONTROL,
  CAN_EXTEND_EXPIRY,
}

export const fullParentFuseEnum = {
  ...parentFuseEnum,
  IS_DOT_ETH,
} as const

export const userSettableFuseEnum = {
  ...childFuseEnum,
  ...parentFuseEnum,
} as const

export const fullFuseEnum = {
  ...userSettableFuseEnum,
  ...fullParentFuseEnum,
  CAN_DO_EVERYTHING,
}

export const unnamedChildFuses = [
  128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
] as const

export const unnamedParentFuses = [
  0x80000, 0x100000, 0x200000, 0x400000, 0x800000, 0x1000000, 0x2000000,
  0x4000000, 0x8000000, 0x10000000, 0x20000000, 0x40000000, 0x80000000,
] as const

export const unnamedUserSettableFuses = [
  ...unnamedChildFuses,
  ...unnamedParentFuses,
] as const

export const childFuseKeys = Object.keys(
  childFuseEnum,
) as (keyof typeof childFuseEnum)[]
export const parentFuseKeys = Object.keys(
  parentFuseEnum,
) as (keyof typeof parentFuseEnum)[]
export const fullParentFuseKeys = Object.keys(
  fullParentFuseEnum,
) as (keyof typeof fullParentFuseEnum)[]
export const userSettableFuseKeys = Object.keys(
  userSettableFuseEnum,
) as (keyof typeof userSettableFuseEnum)[]

type FuseType<
  Enum extends Record<string, number>,
  UnnamedTuple extends readonly number[],
  CustomFuses extends string = never,
> = {
  fuse: keyof Enum
  options: { -readonly [K in keyof Enum]?: boolean }
  current: { [K in keyof Enum]: boolean } & {
    readonly [K in CustomFuses]: boolean
  }
  unnamed: UnnamedTuple
  unnamedValues: UnnamedTuple[number]
  unnamedObject: { [K in UnnamedTuple[number]]: boolean }
}

export type ChildFuses = FuseType<
  typeof childFuseEnum,
  typeof unnamedChildFuses,
  'CAN_DO_EVERYTHING'
>
export type ParentFuses = FuseType<
  typeof parentFuseEnum,
  typeof unnamedParentFuses
>
export type FullParentFuses = FuseType<
  typeof fullParentFuseEnum,
  typeof unnamedParentFuses
>
export type UserSettableFuses = FuseType<
  typeof userSettableFuseEnum,
  typeof unnamedUserSettableFuses
>

type InputFuses<NamedFuse extends string, UnnamedFuse extends number> =
  | {
      named: readonly NamedFuse[]
    }
  | {
      unnamed: readonly UnnamedFuse[]
    }
  | {
      named: readonly NamedFuse[]
      unnamed: readonly UnnamedFuse[]
    }
  | {
      number: number
    }

export type CombinedFuseInput = {
  child: InputFuses<ChildFuses['fuse'], ChildFuses['unnamedValues']>
  parent: InputFuses<ParentFuses['fuse'], ParentFuses['unnamedValues']>
}

type FuseRestriction = 'parent' | 'child'

const checkNumber = (fuses: number) => {
  if (fuses > 2 ** 32 || fuses < 1) {
    throw new Error(
      `Fuse number must be limited to uint32, ${fuses} was too ${
        fuses < 1 ? 'low' : 'high'
      }.`,
    )
  } else if (fuses % 1 !== 0) {
    throw new Error(`Fuse number must be an integer, ${fuses} was not.`)
  } else if ((fuses & USER_SETTABLE_FUSES) !== fuses) {
    throw new Error(
      `Fuse number must be limited to user settable fuses, ${fuses} was not.`,
    )
  }
}

const testFuses = (fuses: any) => {
  if ('named' in fuses && fuses.named.length > 0) {
    return true
  }
  if ('unnamed' in fuses && fuses.unnamed.length > 0) {
    return true
  }
  if ('number' in fuses && fuses.number !== 0) {
    return true
  }
  return false
}

export const hasFuses = (fuses: any) => {
  if (typeof fuses === 'number') {
    return fuses !== 0
  }

  if (typeof fuses === 'object') {
    if ('child' in fuses && testFuses(fuses.child)) {
      return true
    }
    if ('parent' in fuses && testFuses(fuses.parent)) {
      return true
    }
    if (testFuses(fuses)) {
      return true
    }
  }
  return false
}

export function encodeFuses(fuses: Partial<CombinedFuseInput> | number): number
export function encodeFuses(
  fuses: CombinedFuseInput['child'],
  restrictTo: 'child',
): number
export function encodeFuses(
  fuses: CombinedFuseInput['parent'],
  restrictTo: 'parent',
): number
export function encodeFuses<T extends FuseRestriction>(
  fuses: CombinedFuseInput[T],
  restrictTo?: T,
) {
  let encodedFuses: number = 0

  if (typeof fuses === 'number') {
    if (restrictTo) {
      throw new Error('Cannot specify an exact fuse value when restricted.')
    }
    checkNumber(fuses)

    encodedFuses = fuses
  } else {
    let fusesRef = fuses as unknown as CombinedFuseInput
    let allowedNamed: readonly UserSettableFuses['fuse'][] = []
    let allowedUnnamed: readonly UserSettableFuses['unnamedValues'][] = []

    let namedArray: readonly UserSettableFuses['fuse'][] = []
    let unnamedArray: readonly UserSettableFuses['unnamedValues'][] = []

    if (restrictTo) {
      if ('parent' in fuses || 'child' in fuses) {
        throw new Error("Can't specify fuse category when restricted.")
      }
      allowedNamed = restrictTo === 'child' ? childFuseKeys : parentFuseKeys
      allowedUnnamed =
        restrictTo === 'child' ? unnamedChildFuses : unnamedParentFuses

      fusesRef = { [restrictTo]: fuses } as unknown as CombinedFuseInput
    } else {
      allowedNamed = userSettableFuseKeys
      allowedUnnamed = unnamedUserSettableFuses
    }
    if ('parent' in fusesRef) {
      if ('named' in fusesRef.parent) namedArray = fusesRef.parent.named
      if ('unnamed' in fusesRef.parent) unnamedArray = fusesRef.parent.unnamed
      if ('number' in fusesRef.parent) {
        if ('named' in fusesRef.parent || 'unnamed' in fusesRef.parent) {
          throw new Error(
            'Cannot specify both a fuse number and named/unnamed fuses.',
          )
        }
        checkNumber(fusesRef.parent.number)

        if (
          (fusesRef.parent.number & PARENT_CONTROLLED_FUSES) !==
          fusesRef.parent.number
        ) {
          throw new Error(
            "Cannot specify a fuse value to set that is outside of the parent's control.",
          )
        }

        encodedFuses |= fusesRef.parent.number
      }
    }
    if ('child' in fusesRef) {
      if ('named' in fusesRef.child)
        namedArray = [...namedArray, ...fusesRef.child.named]
      if ('unnamed' in fusesRef.child)
        unnamedArray = [...unnamedArray, ...fusesRef.child.unnamed]
      if ('number' in fusesRef.child) {
        if ('named' in fusesRef.child || 'unnamed' in fusesRef.child) {
          throw new Error(
            'Cannot specify both a fuse number and named/unnamed fuses.',
          )
        }
        checkNumber(fusesRef.child.number)

        if (
          (fusesRef.child.number & CHILD_CONTROLLED_FUSES) !==
          fusesRef.child.number
        ) {
          throw new Error(
            "Cannot specify a fuse value to set that is outside of the owner's control.",
          )
        }

        encodedFuses |= fusesRef.child.number
      }
    }

    if (!namedArray.length && !unnamedArray.length && !encodedFuses) {
      throw new Error('Must specify at least one fuse.')
    }

    for (const fuse of namedArray) {
      if (!allowedNamed.includes(fuse)) {
        if (!userSettableFuseKeys.includes(fuse)) {
          throw new Error(`${fuse} is not a valid named fuse.`)
        }
        throw new Error(`Fuse ${fuse} is not allowed for this operation.`)
      }
      encodedFuses |= userSettableFuseEnum[fuse]
    }
    for (const fuse of unnamedArray) {
      if (!allowedUnnamed.includes(fuse)) {
        if (!unnamedUserSettableFuses.includes(fuse)) {
          throw new Error(
            `${fuse} is not a valid unnamed fuse. If you are trying to set a named fuse, use the named property.`,
          )
        }
        throw new Error(`Fuse ${fuse} is not allowed for this operation.`)
      }
      encodedFuses |= fuse
    }
  }

  return encodedFuses
}

const decodeNamedFuses = (fuses: number, arr: readonly string[]) => {
  const fuseObj = Object.fromEntries(
    arr.map((fuse) => [
      fuse,
      (fuses & fullFuseEnum[fuse as keyof typeof fullFuseEnum]) ===
        fullFuseEnum[fuse as keyof typeof fullFuseEnum],
    ]),
  )

  return fuseObj
}

const decodeUnnamedFuses = (fuses: number, arr: readonly number[]) => {
  const fuseObj = Object.fromEntries(
    arr.map((fuse) => [fuse, (fuses & fuse) === fuse]),
  )

  return fuseObj
}

export const decodeFuses = (fuses: number) => {
  const parentNamedFuses = decodeNamedFuses(
    fuses,
    fullParentFuseKeys,
  ) as FullParentFuses['current']
  const parentUnnamedFuses = decodeUnnamedFuses(
    fuses,
    unnamedParentFuses,
  ) as ParentFuses['unnamedObject']

  const childNamedFuses = decodeNamedFuses(
    fuses,
    childFuseKeys,
  ) as ChildFuses['current']
  const childUnnamedFuses = decodeUnnamedFuses(
    fuses,
    unnamedChildFuses,
  ) as ChildFuses['unnamedObject']

  return {
    parent: {
      ...parentNamedFuses,
      unnamed: parentUnnamedFuses,
    },
    child: {
      ...childNamedFuses,
      CAN_DO_EVERYTHING: (fuses & CHILD_CONTROLLED_FUSES) === 0,
      unnamed: childUnnamedFuses,
    },
  }
}

export const checkPCCBurned = (fuses: number) =>
  (fuses & PARENT_CANNOT_CONTROL) === PARENT_CANNOT_CONTROL

export type AllCurrentFuses = ReturnType<typeof decodeFuses>

export default fullFuseEnum
