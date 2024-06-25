import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useResolver } from '@app/hooks/ensjs/public/useResolver'
import { useNameType } from '@app/hooks/nameType/useNameType'
import useRoles from '@app/hooks/ownership/useRoles/useRoles'
import { useBasicName } from '@app/hooks/useBasicName'
import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { checkCanSend, senderRole } from './utils/checkCanSend'
import { getSendNameTransactions } from './utils/getSendNameTransactions'
import { CannotSendView } from './views/CannotSendView'
import { ConfirmationView } from './views/ConfirmationView'
import { SearchView } from './views/SearchView/SearchView'
import { SummaryView } from './views/SummaryView/SummaryView'

export type SendNameForm = {
  query: ''
  recipient: Address | undefined
  transactions: {
    sendOwner: boolean
    sendManager: boolean
    setEthRecord: boolean
    resetProfile: boolean
  }
}

type Data = {
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const SendName = ({ data: { name }, dispatch, onDismiss }: Props) => {
  const account = useAccountSafely()
  const abilities = useAbilities({ name })
  const nameType = useNameType(name)
  const basic = useBasicName({ name })
  const roles = useRoles(name)
  const resolver = useResolver({ name })
  const resolverSupport = useResolverHasInterfaces({
    interfaceNames: ['VersionableResolver'],
    resolverAddress: resolver.data as Address,
    enabled: !!resolver.data,
  })
  const _senderRole = senderRole(nameType.data)

  const flow = ['search', 'summary', 'confirmation'] as const
  const [viewIndex, setViewIndex] = useState(0)
  const view = flow[viewIndex]
  const onNext = () => setViewIndex((i) => Math.min(i + 1, flow.length - 1))
  const onBack = () => setViewIndex((i) => Math.max(i - 1, 0))

  const form = useForm<SendNameForm>({
    defaultValues: {
      query: '',
      recipient: undefined,
      transactions: {
        sendOwner: false,
        sendManager: false,
        setEthRecord: false,
        resetProfile: false,
      },
    },
  })
  const { setValue } = form

  const onSelect = (recipient: Address) => {
    if (!recipient) return
    const currentOwner = roles.data?.find((role) => role.role === 'owner')?.address
    const currentManager = roles.data?.find((role) => role.role === 'manager')?.address
    const currentEthRecord = roles.data?.find((role) => role.role === 'eth-record')?.address

    setValue('recipient', recipient)
    setValue('transactions', {
      sendOwner:
        abilities.data.canSendOwner && recipient.toLowerCase() !== currentOwner?.toLowerCase(),
      sendManager:
        abilities.data.canSendManager && recipient.toLowerCase() !== currentManager?.toLowerCase(),
      setEthRecord:
        abilities.data.canEditRecords &&
        recipient.toLowerCase() !== currentEthRecord?.toLowerCase(),
      resetProfile: false,
    })
    onNext()
  }

  const onSubmit = ({ recipient, transactions }: SendNameForm) => {
    const isOwnerOrManager =
      account.address === basic.ownerData?.owner || basic.ownerData?.registrant === account.address

    const _transactions = getSendNameTransactions({
      name,
      recipient,
      transactions,
      isOwnerOrManager,
      abilities: abilities.data,
      resolverAddress: resolver.data,
    })

    if (_transactions.length === 0) return

    dispatch({
      name: 'setTransactions',
      payload: _transactions,
    })

    dispatch({
      name: 'setFlowStage',
      payload: 'transaction',
    })
  }

  const canSend = checkCanSend({ abilities: abilities.data, nameType: nameType.data })
  const canResetProfile =
    abilities.data.canEditRecords && !!resolverSupport.data?.every((i) => !!i) && !!resolver.data

  return (
    <FormProvider {...form}>
      {match([canSend, view])
        .with([false, P._], () => <CannotSendView onDismiss={onDismiss} />)
        .with([true, 'confirmation'], () => (
          <ConfirmationView onBack={onBack} onSubmit={form.handleSubmit(onSubmit)} />
        ))
        .with([true, 'summary'], () => (
          <SummaryView
            name={name}
            canResetProfile={canResetProfile}
            onBack={onBack}
            onNext={onNext}
          />
        ))
        .with([true, 'search'], () => (
          <SearchView
            name={name}
            senderRole={_senderRole}
            onCancel={onDismiss}
            onSelect={onSelect}
          />
        ))
        .exhaustive()}
    </FormProvider>
  )
}

export default SendName
