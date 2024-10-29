import { useState } from 'react'

import { Dialog } from '@ensdomains/thorin'

import { DateSelection } from '@app/components/@molecules/DateSelection/DateSelection'
import { ONE_YEAR } from '@app/utils/time'

export type Props = {}

const BulkRenewalFlow = () => {
  const [seconds, setSeconds] = useState(() => 5 * ONE_YEAR)

  return (
    <>
      <Dialog.Heading title="Bulk Renewal" alert="info" />
      <Dialog.Content>
        <DateSelection {...{ seconds, setSeconds }} minSeconds={5 * ONE_YEAR} durationType="date" />
      </Dialog.Content>
    </>
  )
}

export default BulkRenewalFlow
