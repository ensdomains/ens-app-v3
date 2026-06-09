import { ComponentProps } from 'react'

import { Avatar, Space } from '@ensdomains/thorin'

import { QuerySpace } from '@app/types'

type BaseProps = {
  size?: QuerySpace
  noCache?: boolean
}

type Name = {
  name?: string
}

type Address = {
  address?: string
}

// Avatar display is disabled on the SNRC fork (mirrors `useEnsAvatar`
// returning null). The three exports below would otherwise render the
// Thorin Avatar with a generated circular Zorb gradient as the fallback,
// which still shows up as a circular placeholder even when no image is
// set. Short-circuiting to null removes the placeholder from every
// caller (ProfileSnippet header, transaction dialogs, etc.) without
// having to rewire each consumer. Prop types are kept verbatim so the
// callers' TS signatures keep matching upstream ENS.
export const NameAvatar = (_props: ComponentProps<typeof Avatar> & BaseProps & Required<Name>) =>
  null

export const AvatarWithZorb = (
  _props: ComponentProps<typeof Avatar> & BaseProps & Address & Name,
) => null

export const AddressAvatar = (
  _props: ComponentProps<typeof Avatar> & Required<Address> & { size?: Space },
) => null
