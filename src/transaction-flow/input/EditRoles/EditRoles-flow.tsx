import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { P, match } from 'ts-pattern'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import useRoles from '@app/components/pages/profile/[name]/tabs/OwnershipTab/sections/RolesSection/hooks/useRoles'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { EditRoleView } from './views/EditRoleView'
import { Main } from './views/MainView'

type Data = {
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const EditRoles = ({ data: { name } }: Props) => {
  const roles = useRoles({ name, details: {} as any })
  console.log(roles)

  const [view, setView] = useState<{ name: 'main' } | { name: 'editRole'; index: number }>({
    name: 'main',
  })

  const { control } = useForm({
    defaultValues: {
      roles: roles.data,
    },
  })

  return (
    <>
      <InnerDialog>
        {match(view)
          .with({ name: 'editRole', index: P.number }, ({ index }) => (
            <EditRoleView control={control} index={index} />
          ))
          .otherwise(() => (
            <Main
              control={control}
              onSelectIndex={(index) => setView({ name: 'editRole', index })}
            />
          ))}
      </InnerDialog>
    </>
  )
}

export default EditRoles
