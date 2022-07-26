import type { ENS } from '@ensdomains/ensjs'

export type Profile = NonNullable<Awaited<ReturnType<ENS['getProfile']>>>

export type Name = NonNullable<Awaited<ReturnType<ENS['getNames']>>>[0]

export type TransactionDisplayItem = {
  type?: 'name' | 'address'
  label: string
  value: string
  fade?: boolean
  shrink?: boolean
  useRawLabel?: boolean
}
