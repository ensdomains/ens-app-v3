import { useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { P, match } from 'ts-pattern'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import useRoles from '@app/hooks/ownership/useRoles/useRoles'
import { useResolverSupportsInterfaces } from '@app/hooks/resolver/useResolverSupportsInterfaces'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useBasicName } from '@app/hooks/useBasicName'
import { useNameType } from '@app/hooks/useNameType'
import { useResolver } from '@app/hooks/useResolver'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { checkCanSend, senderRole } from './utils/checkCanSend'
import { CannotSendView } from './views/CannotSendView'
import { ConfirmationView } from './views/ConfirmationView'
import { SearchView } from './views/SearchView/SearchView'
import { SummaryView } from './views/SummaryView/SummaryView'

export type SendNameForm = {
  query: ''
  recipient: string
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
  const ref = useRef<HTMLFormElement>(null)

  const account = useAccountSafely()
  const abilities = useAbilities(name)
  const nameType = useNameType(name)
  const basic = useBasicName(name)
  const roles = useRoles(name)
  const resolver = useResolver(name)
  const resolverSupport = useResolverSupportsInterfaces({
    resolverAddress: resolver.data,
    interfaces: ['VersionableResolver'],
  })
  const _senderRole = senderRole(nameType.data)

  const flow = ['search', 'summary', 'confirmation'] as const
  const [viewIndex, setViewIndex] = useState(0)
  const view = flow[viewIndex]
  const onNext = () => setViewIndex((i) => Math.min(i + 1, flow.length - 1))
  const onBack = () => setViewIndex((i) => Math.max(i - 1, 0))
  const onConfirm = () =>
    ref.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))

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

  const onSelect = (recipient: string) => {
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

    const setEthRecordOnly = transactions.setEthRecord && !transactions.resetProfile
    const resetProfileOnly = transactions.resetProfile && !transactions.setEthRecord
    const setEthRecordAndResetProfile = transactions.setEthRecord && transactions.resetProfile

    const _transactions = [
      setEthRecordOnly
        ? makeTransactionItem('updateEthAddress', { name, address: recipient })
        : null,
      resetProfileOnly
        ? makeTransactionItem('resetProfile', { name, resolver: resolver.data })
        : null,
      setEthRecordAndResetProfile
        ? makeTransactionItem('resetProfileWithRecords', {
            name,
            records: {
              coinTypes: [{ key: 'ETH', value: recipient }],
            },
            resolver: resolver.data,
          })
        : null,

      transactions.sendManager && !!abilities.data?.sendNameFunctionCallDetails?.sendManager
        ? makeTransactionItem(isOwnerOrManager ? 'transferName' : 'transferSubname', {
            name,
            newOwner: recipient,
            sendType: 'sendManager',
            contract: abilities.data?.sendNameFunctionCallDetails?.sendManager?.contract,
            reclaim: abilities.data?.sendNameFunctionCallDetails?.sendManager?.method === 'reclaim',
          })
        : null,
      transactions.sendOwner && !!abilities.data?.sendNameFunctionCallDetails?.sendOwner
        ? makeTransactionItem(isOwnerOrManager ? 'transferName' : 'transferSubname', {
            name,
            newOwner: recipient,
            sendType: 'sendOwner',
            contract: abilities.data?.sendNameFunctionCallDetails?.sendOwner?.contract,
          })
        : null,
    ].filter((transaction) => !!transaction)

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

  return (
    <FormProvider {...form}>
      <InnerDialog as="form" ref={ref} onSubmit={form.handleSubmit(onSubmit)}>
        {match([canSend, view])
          .with([false, P._], () => <CannotSendView onDismiss={onDismiss} />)
          .with([true, 'confirmation'], () => (
            <ConfirmationView onBack={onBack} onConfirm={onConfirm} />
          ))
          .with([true, 'summary'], () => (
            <SummaryView
              name={name}
              canResetProfile={
                abilities.data.canEditRecords && !!resolverSupport.data?.VersionableResolver
              }
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
      </InnerDialog>
    </FormProvider>
  )
}

export default SendName
