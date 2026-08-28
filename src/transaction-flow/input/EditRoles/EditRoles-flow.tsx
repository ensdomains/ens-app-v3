import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import useRoles, { Role, RoleRecord } from '@app/hooks/ownership/useRoles/useRoles'
import { getAvailableRoles } from '@app/hooks/ownership/useRoles/utils/getAvailableRoles'
import { useBasicName } from '@app/hooks/useBasicName'
import { createTransactionItem, TransactionItem } from '@app/transaction-flow/transaction'
import { makeTransferNameOrSubnameTransactionItem } from '@app/transaction-flow/transaction/utils/makeTransferNameOrSubnameTransactionItem'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { EditRoleView } from './views/EditRoleView/EditRoleView'
import { MainView } from './views/MainView/MainView'

export type EditRolesForm = {
  roles: RoleRecord[]
}

type Data = {
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const EditRoles = ({ data: { name }, dispatch, onDismiss }: Props) => {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number | null>(null)

  const roles = useRoles(name)
  const abilities = useAbilities({ name })
  const basic = useBasicName({ name })
  const account = useAccountSafely()
  const isLoading = roles.isLoading || abilities.isLoading || basic.isLoading

  const form = useForm<EditRolesForm>({
    defaultValues: {
      roles: [],
    },
  })

  // Set form data when data is loaded and prevent reload on modal refresh
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    if (roles.data && abilities.data && !isLoading && !isLoaded) {
      const availableRoles = getAvailableRoles({
        roles: roles.data,
        abilities: abilities.data,
      })
      form.reset({ roles: availableRoles })
      setIsLoaded(true)
    }
  }, [isLoading, roles.data, abilities.data, form, isLoaded])

  const onSubmit = () => {
    const dirtyValues = form
      .getValues('roles')
      .filter((_, i) => {
        return form.getFieldState(`roles.${i}.address`)?.isDirty
      })
      .reduce<{ [key in Role]?: Address }>((acc, { role, address }) => {
        return {
          ...acc,
          [role]: address,
        }
      }, {})

    const isOwnerOrManager = [basic.ownerData?.owner, basic.ownerData?.registrant].includes(
      account.address,
    )
    const transactions = [
      dirtyValues['eth-record']
        ? createTransactionItem('updateEthAddress', { name, address: dirtyValues['eth-record'] })
        : null,
      dirtyValues.manager
        ? makeTransferNameOrSubnameTransactionItem({
            name,
            newOwnerAddress: dirtyValues.manager,
            sendType: 'sendManager',
            isOwnerOrManager,
            abilities: abilities.data,
          })
        : null,
      dirtyValues.owner
        ? makeTransferNameOrSubnameTransactionItem({
            name,
            newOwnerAddress: dirtyValues.owner,
            sendType: 'sendOwner',
            isOwnerOrManager,
            abilities: abilities.data,
          })
        : null,
    ].filter(
      (
        t,
      ): t is
        | TransactionItem<'transferName'>
        | TransactionItem<'transferSubname'>
        | TransactionItem<'updateEthAddress'> => !!t,
    )

    dispatch({
      name: 'setTransactions',
      payload: transactions,
    })

    dispatch({
      name: 'setFlowStage',
      payload: 'transaction',
    })
  }

  return (
    <FormProvider {...form}>
      {match(selectedRoleIndex)
        .with(P.number, (index) => (
          <EditRoleView
            index={index}
            onBack={() => {
              form.trigger()
              setSelectedRoleIndex(null)
            }}
          />
        ))
        .otherwise(() => (
          <MainView
            onSelectIndex={(index) => setSelectedRoleIndex(index)}
            onCancel={onDismiss}
            onSubmit={form.handleSubmit(onSubmit)}
          />
        ))}
    </FormProvider>
  )
}

export default EditRoles
