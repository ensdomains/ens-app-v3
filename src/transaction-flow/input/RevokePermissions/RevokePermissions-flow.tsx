import { Dispatch, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { AllCurrentFuses } from '@ensdomains/ensjs/utils/fuses'
import { Button, Dialog, mq } from '@ensdomains/thorin'

import { makeTransactionItem } from '@app/transaction-flow/transaction'
import {
  CHILD_FUSES,
  ChildFuse,
  Fuse,
  PARENT_FUSES,
  ParentFuse,
} from '@app/transaction-flow/transaction/changePermissions'
import type changePermissions from '@app/transaction-flow/transaction/changePermissions'
import { TransactionDialogPassthrough, TransactionFlowAction } from '@app/transaction-flow/types'
import { dateTimeLocalToDate, dateToDateTimeLocal } from '@app/utils/datetime-local'

import { ControlledNextButton } from './components/ControlledNextButton'
import { GrantExtendExpiryView } from './views/GrantExtendExpiryView'
import { ParentRevokePermissionsView } from './views/ParentRevokePermissionsView'
import { RevokeChangeFusesView } from './views/RevokeChangeFusesView'
import { RevokeChangeFusesWarningView } from './views/RevokeChangeFusesWarningView'
import { RevokePCCView } from './views/RevokePCCView'
import { RevokePermissionsView } from './views/RevokePermissionsView'
import { RevokeUnwrapView } from './views/RevokeUnwrapView'
import { RevokeWarningView } from './views/RevokeWarningView'
import { SetExpiryView } from './views/SetExpiryView'

export type FlowType =
  | 'revoke-pcc'
  | 'revoke-permissions'
  | 'revoke-change-fuses'
  | 'grant-extend-expiry'

export type FormData = {
  parentFuses: {
    [key in ParentFuse]: boolean
  }
  childFuses: {
    [key in ChildFuse]: boolean
  }
  expiry?: number
  expiryType?: 'max' | 'custom'
  expiryCustom?: string
}

type Data = {
  name: string
  flowType: FlowType
  owner: string
  parentFuses: AllCurrentFuses['parent']
  childFuses: AllCurrentFuses['child']
  minExpiry?: number
  maxExpiry?: number
}

export type Props = {
  data: Data
  onDismiss: () => void
  dispatch: Dispatch<TransactionFlowAction>
} & TransactionDialogPassthrough

export type View =
  | 'revokeWarning'
  | 'revokePCC'
  | 'grantExtendExpiry'
  | 'setExpiry'
  | 'revokeUnwrap'
  | 'parentRevokePermissions'
  | 'revokePermissions'
  | 'revokeChangeFuses'
  | 'revokeChangeFusesWarning'

type TransactionData = Parameters<typeof changePermissions['transaction']>['2']

/**
 * Gets default values for useForm as well as populating data from
 */
const getFormDataDefaultValues = (data: Data, transactionData?: TransactionData): FormData => {
  let parentFuseEntries = PARENT_FUSES.map((fuse) => [fuse, !!data.parentFuses[fuse]]) as [
    ParentFuse,
    boolean,
  ][]
  let childFuseEntries = CHILD_FUSES.map((fuse) => [fuse, !!data.childFuses[fuse]]) as [
    ChildFuse,
    boolean,
  ][]
  const expiry = data.maxExpiry
  let expiryType: FormData['expiryType'] = 'max'
  let expiryCustom = data.minExpiry
    ? dateToDateTimeLocal(new Date(data.minExpiry * 1000))
    : undefined

  if (transactionData?.contract === 'setChildFuses') {
    parentFuseEntries = parentFuseEntries.map(([fuse, value]) => [
      fuse,
      value || !!transactionData?.fuses.parent?.includes(fuse),
    ])
    childFuseEntries = childFuseEntries.map(([fuse, value]) => [
      fuse,
      value || !!transactionData?.fuses.child?.includes(fuse),
    ])
  }
  if (
    transactionData?.contract === 'setChildFuses' &&
    transactionData.expiry &&
    transactionData.expiry !== expiry
  ) {
    expiryType = 'custom'
    expiryCustom = dateToDateTimeLocal(new Date(transactionData.expiry * 1000))
  }
  if (transactionData?.contract === 'setFuses') {
    childFuseEntries = childFuseEntries.map(([fuse, value]) => [
      fuse,
      value || !!transactionData.fuses.includes(fuse),
    ])
  }
  return {
    parentFuses: Object.fromEntries(parentFuseEntries) as { [key in ParentFuse]: boolean },
    childFuses: Object.fromEntries(childFuseEntries) as { [key in ChildFuse]: boolean },
    expiry,
    expiryType,
    expiryCustom,
  }
}

/**
 * When returning from a transaction we need to check if the flow includes `revokeChangeFusesWarning`
 * When moving forward this is handled by the next button to avoid unnecessary rerenders.
 */
const getIntialValueForCurrentIndex = (flow: View[], transactionData?: TransactionData): number => {
  if (!transactionData) return 0
  const childFuses =
    transactionData.contract === 'setChildFuses'
      ? transactionData.fuses.child
      : transactionData.fuses
  if (
    flow[flow.length - 1] === 'revokeChangeFusesWarning' &&
    !childFuses.includes('CANNOT_BURN_FUSES')
  )
    return flow.length - 2
  return flow.length - 1
}

const Form = styled.form(({ theme }) => [
  css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};
  `,
  mq.sm.min(css`
    width: 100vw;
    max-width: 520px;
    padding: ${theme.space['2.5']};
  `),
])

const RevokePermissions = ({ data, transactions, onDismiss, dispatch }: Props) => {
  const { name, flowType, owner, parentFuses, childFuses, minExpiry, maxExpiry } = data
  const formRef = useRef<HTMLFormElement>(null)
  const { t } = useTranslation('transactionFlow')

  const transactionData: any = transactions?.find((tx: any) => tx.name === 'changePermissions')
    ?.data as TransactionData | undefined

  const { register, control, handleSubmit, getValues, trigger } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: getFormDataDefaultValues(data, transactionData),
  })

  const unburnedFuses = useMemo(() => {
    return Object.entries({ ...parentFuses, ...childFuses })
      .filter(([, value]) => value === false)
      .map(([key]) => key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) as Fuse[]

  /** The user flow depending on  */
  const flow = useMemo(() => {
    const isSubname = name.split('.').length > 2
    const isMinExpiryLessThanMaxExpiry =
      isSubname && !!minExpiry && !!maxExpiry && minExpiry < maxExpiry

    switch (flowType) {
      case 'revoke-pcc': {
        return [
          'revokeWarning',
          'revokePCC',
          ...(isMinExpiryLessThanMaxExpiry ? ['setExpiry'] : []),
          'parentRevokePermissions',
          'revokeChangeFusesWarning',
        ]
      }
      case 'grant-extend-expiry': {
        return [
          'revokeWarning',
          'grantExtendExpiry',
          ...(isMinExpiryLessThanMaxExpiry ? ['setExpiry'] : []),
        ]
      }
      case 'revoke-permissions': {
        return [
          'revokeWarning',
          ...(childFuses.CANNOT_UNWRAP ? [] : ['revokeUnwrap']),
          'revokePermissions',
        ]
      }
      case 'revoke-change-fuses': {
        return ['revokeWarning', 'revokeChangeFuses', 'revokeChangeFusesWarning']
      }
      default: {
        return []
      }
    }
  }, [name, flowType, minExpiry, maxExpiry, childFuses.CANNOT_UNWRAP]) as View[]

  const [currentIndex, setCurrentIndex] = useState(
    getIntialValueForCurrentIndex(flow, transactionData),
  )
  const view = flow[currentIndex]

  const onDecrementIndex = () => {
    if (flow[currentIndex - 1]) setCurrentIndex(currentIndex - 1)
    else onDismiss?.()
  }

  const onSubmit = (form: FormData) => {
    // Only allow childfuses to be burned if CU is burned
    const childNamedFuses = form.childFuses.CANNOT_UNWRAP
      ? CHILD_FUSES.filter((fuse) => unburnedFuses.includes(fuse) && form.childFuses[fuse])
      : []

    if (['revoke-pcc', 'grant-extend-expiry'].includes(flowType)) {
      const parentNamedFuses = PARENT_FUSES.filter((fuse) => form.parentFuses[fuse])

      const customExpiry = form.expiryCustom
        ? Math.floor(dateTimeLocalToDate(form.expiryCustom).getTime() / 1000)
        : undefined
      const expiry = form.expiryType === 'max' ? maxExpiry : customExpiry

      dispatch({
        name: 'setTransactions',
        payload: [
          makeTransactionItem('changePermissions', {
            name,
            contract: 'setChildFuses',
            fuses: {
              parent: parentNamedFuses,
              child: childNamedFuses,
            },
            expiry,
          }),
        ],
      })
    } else {
      dispatch({
        name: 'setTransactions',
        payload: [
          makeTransactionItem('changePermissions', {
            name,
            contract: 'setFuses',
            fuses: childNamedFuses,
          }),
        ],
      })
    }

    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

  return (
    <Form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      {
        {
          revokeWarning: <RevokeWarningView />,
          revokePCC: (
            <RevokePCCView managerAddr={owner} register={register} onDismiss={onDismiss} />
          ),
          grantExtendExpiry: <GrantExtendExpiryView register={register} />,
          setExpiry: (
            <SetExpiryView
              name={name}
              register={register}
              control={control}
              minExpiry={minExpiry!}
              maxExpiry={maxExpiry!}
              getValues={getValues}
              trigger={trigger}
            />
          ),
          revokeUnwrap: <RevokeUnwrapView register={register} />,
          parentRevokePermissions: (
            <ParentRevokePermissionsView
              control={control}
              register={register}
              unburnedFuses={unburnedFuses}
            />
          ),
          revokePermissions: (
            <RevokePermissionsView register={register} unburnedFuses={unburnedFuses} />
          ),
          revokeChangeFuses: <RevokeChangeFusesView register={register} />,
          revokeChangeFusesWarning: <RevokeChangeFusesWarningView />,
        }[view]
      }
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onDecrementIndex}>
            {currentIndex === 0
              ? t('action.cancel', { ns: 'common' })
              : t('action.back', { ns: 'common' })}
          </Button>
        }
        trailing={
          <ControlledNextButton
            control={control}
            view={view}
            isLastView={currentIndex >= flow.length - 1}
            unburnedFuses={unburnedFuses}
            onIncrement={() => {
              setCurrentIndex((index) => index + 1)
            }}
            onSubmit={() => {
              formRef.current?.dispatchEvent(
                new Event('submit', { cancelable: false, bubbles: true }),
              )
            }}
          />
        }
      />
    </Form>
  )
}

export default RevokePermissions
