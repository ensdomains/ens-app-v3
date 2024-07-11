import { ComponentProps, Dispatch, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'
import { Address } from 'viem'

import {
  ChildFuseKeys,
  ChildFuseReferenceType,
  ParentFuseKeys,
  ParentFuseReferenceType,
} from '@ensdomains/ensjs/utils'
import { Button, Dialog } from '@ensdomains/thorin'

import { useExpiry } from '@app/hooks/ensjs/public/useExpiry'
import { createTransactionItem } from '@app/transaction-flow/transaction'
import type changePermissions from '@app/transaction-flow/transaction/changePermissions'
import { TransactionDialogPassthrough, TransactionFlowAction } from '@app/transaction-flow/types'
import { ExtractTransactionData } from '@app/types'
import { dateTimeLocalToDate, dateToDateTimeLocal } from '@app/utils/datetime-local'

import { ControlledNextButton } from './components/ControlledNextButton'
import { GrantExtendExpiryView } from './views/GrantExtendExpiryView'
import { NameConfirmationWarningView } from './views/NameConfirmationWarningView'
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
  | 'revoke-change-fuses'

type CurrentParentFuses = {
  [key in ParentFuseReferenceType['Key']]: boolean
}

type CurrentChildFuses = {
  [key in ChildFuseReferenceType['Key']]: boolean
}

export type FormData = {
  parentFuses: CurrentParentFuses
  childFuses: CurrentChildFuses
  expiry?: number
  expiryType?: 'max' | 'custom'
  expiryCustom?: string
}

type FlowWithExpiry = {
  flowType: 'revoke-pcc' | 'grant-extend-expiry'
  minExpiry?: number
  maxExpiry: number
}

type FlowWithoutExpiry = {
  flowType: 'revoke-permissions' | 'revoke-change-fuses' | 'revoke-permissions'
  minExpiry?: never
  maxExpiry?: never
}

type Data = {
  name: string
  flowType: FlowType
  owner: Address
  parentFuses: CurrentParentFuses
  childFuses: CurrentChildFuses
} & (FlowWithExpiry | FlowWithoutExpiry)

export type RevokePermissionsDialogContentProps = ComponentProps<typeof Dialog.Content>

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
  | 'lastWarning'

type TransactionData = ExtractTransactionData<typeof changePermissions>

/**
 * Gets default values for useForm as well as populating data from
 */
const getFormDataDefaultValues = (data: Data, transactionData?: TransactionData): FormData => {
  let parentFuseEntries = ParentFuseKeys.map((fuse) => [fuse, !!data.parentFuses[fuse]]) as [
    ParentFuseReferenceType['Key'],
    boolean,
  ][]
  let childFuseEntries = ChildFuseKeys.map((fuse) => [fuse, !!data.childFuses[fuse]]) as [
    ChildFuseReferenceType['Key'],
    boolean,
  ][]
  const expiry = data.maxExpiry
  let expiryType: FormData['expiryType'] = 'max'
  let expiryCustom = dateToDateTimeLocal(
    new Date(
      // set default to min + 1 day if min is larger than current time
      // otherwise set to current time + 1 day
      // max value is the maximum expiry
      Math.min(
        Math.max((data.minExpiry || 0) * 1000, Date.now()) + 60 * 60 * 24 * 1000,
        data.maxExpiry ? data.maxExpiry * 1000 : Infinity,
      ),
    ),
    true,
  )

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
    expiryCustom = dateToDateTimeLocal(new Date(transactionData.expiry * 1000), true)
  }
  if (transactionData?.contract === 'setFuses') {
    childFuseEntries = childFuseEntries.map(([fuse, value]) => [
      fuse,
      value || !!transactionData.fuses.includes(fuse),
    ])
  }
  return {
    parentFuses: Object.fromEntries(parentFuseEntries) as {
      [key in ParentFuseReferenceType['Key']]: boolean
    },
    childFuses: Object.fromEntries(childFuseEntries) as {
      [key in ChildFuseReferenceType['Key']]: boolean
    },
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

const RevokePermissions = ({ data, transactions, onDismiss, dispatch }: Props) => {
  const {
    name,
    flowType,
    owner,
    parentFuses: initialParentFuses,
    childFuses: initialChildFuses,
    minExpiry,
    maxExpiry,
  } = data

  const formRef = useRef<HTMLFormElement>(null)
  const { t } = useTranslation('transactionFlow')

  const { data: expiry } = useExpiry({ name })

  const transactionData: any = transactions?.find((tx: any) => tx.name === 'changePermissions')
    ?.data as TransactionData | undefined

  const { register, control, handleSubmit, getValues, trigger, formState } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: getFormDataDefaultValues(data, transactionData),
  })

  const isCustomExpiryValid = formState.errors.expiryCustom === undefined

  const [parentFuses, childFuses] = useWatch({ control, name: ['parentFuses', 'childFuses'] })

  const unburnedFuses = useMemo(() => {
    return Object.entries({ ...initialParentFuses, ...initialChildFuses })
      .filter(([, value]) => value === false)
      .map(([key]) => key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) as (ParentFuseReferenceType['Key'] | ChildFuseReferenceType['Key'])[]

  /** The user flow depending on  */
  const flow = useMemo(() => {
    const isSubname = name.split('.').length > 2
    const isMinExpiryAtLeastEqualToMaxExpiry =
      isSubname && !!minExpiry && !!maxExpiry && minExpiry >= maxExpiry

    switch (flowType) {
      case 'revoke-pcc': {
        return [
          'revokeWarning',
          'revokePCC',
          ...(!isMinExpiryAtLeastEqualToMaxExpiry ? ['setExpiry'] : []),
          'parentRevokePermissions',
          ...(childFuses.CANNOT_UNWRAP && childFuses.CANNOT_BURN_FUSES
            ? ['revokeChangeFusesWarning']
            : []),
          'lastWarning',
        ]
      }
      case 'grant-extend-expiry': {
        return [
          'revokeWarning',
          'grantExtendExpiry',
          ...(!isMinExpiryAtLeastEqualToMaxExpiry ? ['setExpiry'] : []),
        ]
      }
      case 'revoke-permissions': {
        return [
          'revokeWarning',
          ...(initialChildFuses.CANNOT_UNWRAP ? [] : ['revokeUnwrap']),
          'revokePermissions',
          'lastWarning',
        ]
      }
      case 'revoke-change-fuses': {
        return ['revokeWarning', 'revokeChangeFuses', 'revokeChangeFusesWarning', 'lastWarning']
      }
      default: {
        return []
      }
    }
  }, [name, flowType, minExpiry, maxExpiry, childFuses, initialChildFuses]) as View[]

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
      ? ChildFuseKeys.filter((fuse) => unburnedFuses.includes(fuse) && form.childFuses[fuse])
      : []

    if (['revoke-pcc', 'grant-extend-expiry'].includes(flowType)) {
      const parentNamedFuses = ParentFuseKeys.filter((fuse) => form.parentFuses[fuse])

      const customExpiry = form.expiryCustom
        ? Math.floor(dateTimeLocalToDate(form.expiryCustom).getTime() / 1000)
        : undefined

      dispatch({
        name: 'setTransactions',
        payload: [
          createTransactionItem('changePermissions', {
            name,
            contract: 'setChildFuses',
            fuses: {
              parent: parentNamedFuses,
              child: childNamedFuses,
            },
            expiry: form.expiryType === 'max' ? maxExpiry : customExpiry,
          }),
        ],
      })
    } else {
      dispatch({
        name: 'setTransactions',
        payload: [
          createTransactionItem('changePermissions', {
            name,
            contract: 'setFuses',
            fuses: childNamedFuses,
          }),
        ],
      })
    }

    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

  const [isDisabled, setDisabled] = useState(true)

  const dialogContentProps: RevokePermissionsDialogContentProps = {
    as: 'form',
    ref: formRef,
    onSubmit: handleSubmit(onSubmit),
  }

  return (
    <>
      {match(view)
        .with('revokeWarning', () => <RevokeWarningView {...dialogContentProps} />)
        .with('revokePCC', () => (
          <RevokePCCView
            managerAddress={owner}
            register={register}
            onDismiss={onDismiss}
            {...dialogContentProps}
          />
        ))
        .with('grantExtendExpiry', () => (
          <GrantExtendExpiryView register={register} {...dialogContentProps} />
        ))
        .with('setExpiry', () => (
          <SetExpiryView
            name={name}
            register={register}
            control={control}
            minExpiry={minExpiry as FlowWithExpiry['minExpiry']}
            maxExpiry={maxExpiry as FlowWithExpiry['maxExpiry']}
            getValues={getValues}
            trigger={trigger}
            {...dialogContentProps}
          />
        ))
        .with('revokeUnwrap', () => (
          <RevokeUnwrapView register={register} {...dialogContentProps} />
        ))
        .with('parentRevokePermissions', () => (
          <ParentRevokePermissionsView
            control={control}
            register={register}
            unburnedFuses={unburnedFuses}
            {...dialogContentProps}
          />
        ))
        .with('revokePermissions', () => (
          <RevokePermissionsView
            register={register}
            unburnedFuses={unburnedFuses as ChildFuseReferenceType['Key'][]}
            {...dialogContentProps}
          />
        ))
        .with('lastWarning', () => (
          <NameConfirmationWarningView
            expiry={expiry?.expiry.date!}
            name={name}
            setDisabled={setDisabled}
            {...dialogContentProps}
          />
        ))
        .with('revokeChangeFuses', () => (
          <RevokeChangeFusesView register={register} {...dialogContentProps} />
        ))
        .with('revokeChangeFusesWarning', () => (
          <RevokeChangeFusesWarningView {...dialogContentProps} />
        ))
        .exhaustive()}
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
            {...{ childFuses, parentFuses, unburnedFuses, view, isCustomExpiryValid }}
            disabled={isDisabled}
            isLastView={currentIndex >= flow.length - 1}
            onIncrement={() => {
              setCurrentIndex((index) => index + 1)
            }}
            onSubmit={() => {
              formRef.current?.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true }),
              )
            }}
          />
        }
      />
    </>
  )
}

export default RevokePermissions
