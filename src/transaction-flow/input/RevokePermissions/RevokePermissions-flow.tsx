import { ComponentProps, Dispatch, useMemo, useRef, useState } from 'react'
import { Control, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CurrentFuses } from '@ensdomains/ensjs/utils/fuses'
import { Button, Dialog } from '@ensdomains/thorin'

import { TransactionDialogPassthrough, TransactionFlowAction } from '@app/transaction-flow/types'

import { RevokeAdditionalView } from './views/RevokeAdditionalView'
import { RevokeChangeFusesView } from './views/RevokeChangeFusesView'
import { RevokeChangeFusesWarningView } from './views/RevokeChangeFusesWarningView'
import { RevokePCCView } from './views/RevokePCCView'
import { RevokePermissionsView } from './views/RevokePermissionsView'
import { RevokeUnwrapView } from './views/RevokeUnwrapView'
import { RevokeWarningView } from './views/RevokeWarningView'
import { SetExpiryView } from './views/SetExpiryView'

type Data = {
  name: string
  flowType: 'revoke-pcc' | 'revoke-permissions' | 'revoke-change-fuses' | 'grant-extend-expiry'
  owner: string
  fuseObj: CurrentFuses
  minExpiry?: number
  maxExpiry?: number
}

export type Props = {
  data: Data
  onDismiss: () => void
  dispatch: Dispatch<TransactionFlowAction>
} & TransactionDialogPassthrough

type View =
  | 'revokeWarning'
  | 'revokePCC'
  | 'setExpiry'
  | 'revokeAdditional'
  | 'revokeUnwrap'
  | 'revokePermissions'
  | 'revokeChangeFuses'
  | 'revokeChangeFusesWarning'

export type FormData = {
  fuseObj: CurrentFuses
  expiry: number
  expiryType: 'max' | 'custom'
  expiryCustom: number
}

type Fuse = keyof CurrentFuses

const PERMISSIONS: Fuse[] = [
  'CANNOT_CREATE_SUBDOMAIN',
  'CANNOT_TRANSFER',
  'CANNOT_SET_RESOLVER',
  'CANNOT_SET_TTL',
  'CANNOT_BURN_FUSES',
]

const Form = styled.form(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};
  `,
)

const ControlledButton = ({
  view,
  control,
  revokeAdditional,
  availableFuses,
  onIncrement,
  onSubmit,
}: {
  view: View
  control: Control<FormData>
  revokeAdditional: boolean
  availableFuses: Fuse[]
  onIncrement: () => void
  onSubmit: () => void
}) => {
  const { t } = useTranslation('transactionFlow')
  const fuseObj = useWatch({ control, name: 'fuseObj' })

  const props: ComponentProps<typeof Button> = useMemo(() => {
    const defaultProps: ComponentProps<typeof Button> = {
      disabled: false,
      color: 'accent',
      count: 0,
      onClick: onIncrement,
      children: t('action.next', { ns: 'common' }),
    }

    const getCount = () =>
      PERMISSIONS.filter((fuse) => {
        if (!availableFuses.includes(fuse)) return false
        return fuseObj[fuse]
      }).length

    switch (view) {
      case 'revokeWarning':
        return {
          ...defaultProps,
          color: 'red',
          children: t('action.understand', { ns: 'common' }),
        }
      case 'revokePCC':
        return {
          ...defaultProps,
          disabled: fuseObj.PARENT_CANNOT_CONTROL === false,
        }
      case 'revokeAdditional':
        return {
          ...defaultProps,
          onClick: revokeAdditional ? onIncrement : onSubmit,
          children: revokeAdditional
            ? t('action.next', { ns: 'common' })
            : t('action.skip', { ns: 'common' }),
        }
      case 'revokeUnwrap':
        return {
          ...defaultProps,
          disabled: fuseObj.CANNOT_UNWRAP === false,
        }
      case 'revokePermissions':
        return {
          ...defaultProps,
          count: getCount(),
          disabled: getCount() === 0,
          onClick: fuseObj.CANNOT_BURN_FUSES ? onIncrement : onSubmit,
          children: t('input.revokePermissions.action.revoke'),
        }
      case 'revokeChangeFusesWarning':
        return {
          ...defaultProps,
          onClick: onSubmit,
        }
      default:
        return defaultProps
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, fuseObj, revokeAdditional, availableFuses])

  return <Button {...props} />
}

const RevokePermissions = ({ data, onDismiss, dispatch }: Props) => {
  const { name, flowType, owner, fuseObj, minExpiry, maxExpiry } = data
  const formRef = useRef<HTMLFormElement>(null)
  const { t } = useTranslation('transactionFlow')
  const { register, control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      fuseObj,
      expiry: maxExpiry,
      expiryType: 'max',
      expiryCustom: minExpiry,
    },
  })

  console.log(owner, dispatch)

  const [revokeAdditional, setRevokeAdditional] = useState(false)
  const flow = useMemo(() => {
    const _flow: View[] = ['revokeWarning']

    const is2LD = name.split('.').length === 2
    const showSetExpiry = !is2LD && !!minExpiry && !!maxExpiry && minExpiry < maxExpiry
    const showRevokePermissions =
      (flowType === 'revoke-pcc' && revokeAdditional) || flowType === 'revoke-permissions'

    if (flowType === 'revoke-pcc') _flow.push('revokePCC')
    if (flowType === 'revoke-pcc' && showSetExpiry) _flow.push('setExpiry')
    if (flowType === 'revoke-pcc') _flow.push('revokeAdditional')

    if (showRevokePermissions && !fuseObj.CANNOT_UNWRAP) _flow.push('revokeUnwrap')
    if (showRevokePermissions) _flow.push('revokePermissions')

    if (flowType === 'revoke-change-fuses') _flow.push('revokeChangeFuses')
    _flow.push('revokeChangeFusesWarning')
    return _flow
  }, [name, flowType, minExpiry, maxExpiry, revokeAdditional, fuseObj.CANNOT_UNWRAP])

  const [currentIndex, setCurrentIndex] = useState(0)
  const view = flow[currentIndex]

  const availableFuses = useMemo(() => {
    return Object.entries(fuseObj)
      .filter(([, value]) => value === false)
      .map(([key]) => key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) as (keyof CurrentFuses)[]

  const onSubmit = (form: FormData) => {
    console.log(form)
  }

  return (
    <Form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      {
        {
          revokeWarning: <RevokeWarningView />,
          revokePCC: <RevokePCCView manager={name} register={register} onDismiss={onDismiss} />,
          setExpiry: (
            <SetExpiryView
              name={name}
              register={register}
              minExpiry={minExpiry!}
              maxExpiry={maxExpiry!}
            />
          ),
          revokeAdditional: (
            <RevokeAdditionalView
              revokeAdditional={revokeAdditional}
              onChangeRevokeAdditional={(e) => setRevokeAdditional(e.target.checked)}
            />
          ),
          revokeUnwrap: <RevokeUnwrapView register={register} />,
          revokePermissions: (
            <RevokePermissionsView
              fuses={availableFuses}
              showCannotBurnFuses={flowType === 'revoke-pcc'}
              register={register}
              onDismiss={onDismiss}
            />
          ),
          revokeChangeFuses: <RevokeChangeFusesView register={register} />,
          revokeChangeFusesWarning: <RevokeChangeFusesWarningView />,
        }[view]
      }
      <Dialog.Footer
        leading={
          <Button
            colorStyle="accentSecondary"
            onClick={() => setCurrentIndex((index) => index - 1)}
          >
            {currentIndex === 0
              ? t('action.cancel', { ns: 'common' })
              : t('action.back', { ns: 'common' })}
          </Button>
        }
        trailing={
          <ControlledButton
            control={control}
            view={view}
            revokeAdditional={revokeAdditional}
            availableFuses={availableFuses}
            onIncrement={() => setCurrentIndex((index) => index + 1)}
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
