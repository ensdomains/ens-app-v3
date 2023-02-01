import { useEffect, useState } from 'react'
import { useProvider } from 'wagmi'

import { ChildFuses, ParentFuses } from '@ensdomains/ensjs'
import { decodeFuses } from '@ensdomains/ensjs/utils/fuses'

import { useGetHistory } from '../useGetHistory'

type NameWrapperEventData = {
  fuses: number
  expiry?: number
}

type ParentFuseKeys = ParentFuses['fuse']
type ChildFuseKeys = ChildFuses['fuse']
type AllFuses = ParentFuseKeys | ChildFuseKeys
type Result = {
  [key in AllFuses]?: string
}

const PARENT_FUSES: ParentFuseKeys[] = ['PARENT_CANNOT_CONTROL', 'CAN_EXTEND_EXPIRY']
const CHILD_FUSES: ChildFuseKeys[] = [
  'CANNOT_UNWRAP',
  'CANNOT_CREATE_SUBDOMAIN',
  'CANNOT_TRANSFER',
  'CANNOT_SET_RESOLVER',
  'CANNOT_SET_TTL',
  'CANNOT_BURN_FUSES',
]

/** Need a polyfill because Firefox does not support findLastIndex */
export function findLastIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean,
): number {
  let l = array.length - 1
  while (l >= 0) {
    if (predicate(array[l], l, array)) return l
    l -= 1
  }
  return -1
}

export const useGetFusesSetDates = (name: string, skip?: boolean) => {
  const { history, isCachedData } = useGetHistory(name, skip)
  const provider = useProvider()

  const [result, setResult] = useState<Result>({})

  useEffect(() => {
    if (!history || !provider) return setResult({})
    ;(async () => {
      try {
        const lastNameWrappedEventIndex = findLastIndex(
          history.domain,
          ({ type }) => type === 'NameWrapped',
        )
        if (lastNameWrappedEventIndex === -1) return setResult({})

        const nameWrapperEventsSinceLastNameWrappedEvent = history.domain
          .slice(lastNameWrappedEventIndex)
          .filter(({ type }) => ['NameWrapped', 'FusesSet'].includes(type))

        // Create entries in reverse order so that earlier events overwrite the later results
        const fusesSetDateEntries = await Promise.all(
          nameWrapperEventsSinceLastNameWrappedEvent.reverse().map(async (event) => {
            const { fuses } = event.data as NameWrapperEventData
            const decodedFuses = decodeFuses(fuses)
            const burnedParentFuses = PARENT_FUSES.filter((key) => decodedFuses.parent[key])
            const burnedChildFuses = CHILD_FUSES.filter((key) => decodedFuses.child[key])
            const date = await provider.getBlock(event.blockNumber)
            const dateStr = new Date(date.timestamp * 1000).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
            return [...burnedParentFuses, ...burnedChildFuses].map((key) => [key, dateStr])
          }),
        )
        const fusesSetDates = Object.fromEntries(fusesSetDateEntries.flat()) as Result
        setResult(fusesSetDates)
      } catch (e) {
        console.error(e)
        setResult({})
      }
    })()
  }, [history, provider])
  return {
    fusesSetDates: result,
    isCachedData,
  }
}
