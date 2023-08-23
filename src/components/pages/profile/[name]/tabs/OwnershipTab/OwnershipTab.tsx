import type { useNameDetails } from '@app/hooks/useNameDetails'

import { ExpirySection } from './sections/ExpirySection/ExpirySection'
import { RolesSection } from './sections/RolesSection/RolesSection'

type Props = {
  name: string
  details: ReturnType<typeof useNameDetails>
}

export const OwnershipTab = ({ name, details }: Props) => {
  console.log(details)
  return (
    <>
      <RolesSection name={name} details={details} />
      <ExpirySection name={name} details={details} />
    </>
  )
}
