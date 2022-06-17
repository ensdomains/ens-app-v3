import type { ENS } from '@ensdomains/ensjs'

export type Profile = NonNullable<Awaited<ReturnType<ENS['getProfile']>>>
