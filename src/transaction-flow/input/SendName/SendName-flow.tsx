import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { match } from 'ts-pattern'

import { Dialog } from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { SearchView } from './views/SearchView'
import { SummaryView } from './views/SummaryView'

type Data = {
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const SendName = ({ data: { name } }: Props) => {
  const [view] = useState<{ name: 'summary' } | { name: 'search' }>({ name: 'search' })

  const { control } = useForm({
    defaultValues: {
      name,
    },
  })

  return (
    <>
      <Dialog.Heading title="Send name" />
      <InnerDialog>
        {match(view)
          .with({ name: 'summary' }, () => <SummaryView control={control} />)
          .otherwise(() => (
            <SearchView control={control} />
          ))}
      </InnerDialog>
    </>
  )
}

export default SendName
