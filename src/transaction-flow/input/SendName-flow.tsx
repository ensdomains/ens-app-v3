import { ethers } from 'ethers'
import { useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount, useQuery } from 'wagmi'

import { Button, Checkbox, Dialog, Helper, Input, Typography, mq } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { NameAvatar } from '@app/components/AvatarWithZorb'
import { Outlink } from '@app/components/Outlink'
import { useBasicName } from '@app/hooks/useBasicName'
import { useChainId } from '@app/hooks/useChainId'
import { usePrimary } from '@app/hooks/usePrimary'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { useEns } from '@app/utils/EnsProvider'

import { makeTransactionItem } from '../transaction'

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['7']};
    min-width: ${theme.space['7']};
    height: ${theme.space['7']};
  `,
)

const ValueTypography = styled(Typography)(
  () => css`
    text-align: right;
  `,
)

const ValueWithAvatarContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.space['4']};
    padding: 20px;
    width: 100%;
    border-radius: ${theme.radii.extraLarge};
    border: ${theme.borderWidths.px} ${theme.borderStyles.solid}
      rgba(${theme.shadesRaw.foreground}, 0.06);
  `,
)

const SwitchBox = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.space['4']};
    padding: 20px;
    width: 100%;
    border-radius: ${theme.radii.extraLarge};
    border: ${theme.borderWidths.px} ${theme.borderStyles.solid}
      rgba(${theme.shadesRaw.foreground}, 0.06);
  `,
)

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const InnerContainer = styled.div(() => [
  css`
    width: 100%;
  `,
  mq.sm.min(css`
    width: 510px;
  `),
])

const NameValue = ({ value }: { value: string }) => {
  const network = useChainId()

  return (
    <ValueWithAvatarContainer>
      <ValueTypography weight="bold">{value}</ValueTypography>
      <AvatarWrapper>
        <NameAvatar name={value} label={`${value}-avatar`} network={network} />
      </AvatarWrapper>
    </ValueWithAvatarContainer>
  )
}

type Data = {
  name: string
  type?: 'manager' | 'owner'
}

type FormData = {
  managerChoice: string
  ownerChoice: string
  sendName: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

export const SendName = ({ data, dispatch, onDismiss }: Props) => {
  const { name } = data
  const { t } = useTranslation('profile')
  const formRef = useRef<HTMLFormElement>(null)
  const { getRecords } = useEns()
  const { ownerData, isWrapped } = useBasicName(name as string)
  const parentName = name.split('.').slice(1).join('.')
  const parentNameOwnerData = useBasicName(parentName)
  const { address } = useAccount()
  const { register, watch, getFieldState } = useForm<FormData>({
    mode: 'onChange',
  })

  const managerDefaultChecked = data.type !== 'owner'
  const ownerDefaultChecked = data.type !== 'manager'

  const managerChoiceWatch = watch('managerChoice')
  const ownerChoiceWatch = watch('ownerChoice')
  const sendNameWatch = watch('sendName')
  const { data: ethNameValidation, isLoading } = useQuery(
    ['ethNameValidation', sendNameWatch],
    async () => {
      const result = await getRecords(sendNameWatch)
      return result?.address
    },
    { enabled: sendNameWatch?.includes('.eth') },
  )

  const { name: primaryName } = usePrimary(ethNameValidation || sendNameWatch)

  const { data: canModify } = useQuery(['resolver', ownerData?.toString()], () => {
    let _canModifyOwner = false
    let _canModifyManager = false

    if (ownerData?.ownershipLevel === 'registrar') {
      if (address === ownerData?.registrant) {
        _canModifyOwner = address === ownerData?.registrant
        _canModifyManager = true
      } else {
        _canModifyManager = address === ownerData?.owner
      }
    }

    if (ownerData?.ownershipLevel === 'nameWrapper') {
      _canModifyOwner = address === ownerData?.owner
    }

    if (ownerData?.ownershipLevel === 'registry') {
      _canModifyOwner =
        address === ownerData?.owner || address === parentNameOwnerData?.ownerData?.owner
    }

    return {
      canModifyOwner: _canModifyOwner,
      canModifyManager: _canModifyManager,
    }
  })

  const ownershipLevel = ownerData?.ownershipLevel

  const handleSubmitForm = () => {
    const isController = ownerData?.owner === address
    const isRegistrant = ownerData?.registrant === address

    if (ownershipLevel === 'nameWrapper') {
      dispatch({
        name: 'setTransactions',
        payload: [
          makeTransactionItem('transferName', {
            name,
            newOwner: sendNameWatch,
            contract: 'nameWrapper',
          }),
        ],
      })
      dispatch({ name: 'setFlowStage', payload: 'transaction' })
      return
    }

    if (managerChoiceWatch && !ownerChoiceWatch) {
      if (!isController && isRegistrant) {
        dispatch({
          name: 'setTransactions',
          payload: [
            makeTransactionItem('transferController', {
              name,
              newOwner: sendNameWatch,
              isOwner: false,
            }),
          ],
        })
        dispatch({ name: 'setFlowStage', payload: 'transaction' })
        return
      }

      dispatch({
        name: 'setTransactions',
        payload: [
          makeTransactionItem('transferName', {
            name,
            newOwner: sendNameWatch,
            contract: 'registry',
          }),
        ],
      })
      dispatch({ name: 'setFlowStage', payload: 'transaction' })
      return
    }

    if (!managerChoiceWatch && ownerChoiceWatch) {
      if (isWrapped) {
        dispatch({
          name: 'setTransactions',
          payload: [
            makeTransactionItem('transferName', {
              name,
              newOwner: sendNameWatch,
              contract: 'nameWrapper',
            }),
          ],
        })
        dispatch({ name: 'setFlowStage', payload: 'transaction' })
        return
      }

      // subname
      if (name.split('.').length > 2) {
        if (address === ownerData?.owner) {
          dispatch({
            name: 'setTransactions',
            payload: [
              makeTransactionItem('transferName', {
                name,
                newOwner: sendNameWatch,
                contract: 'registry',
              }),
            ],
          })
          dispatch({ name: 'setFlowStage', payload: 'transaction' })
          return
        }

        dispatch({
          name: 'setTransactions',
          payload: [
            makeTransactionItem('transferSubname', {
              name,
              newOwner: sendNameWatch,
              contract: 'registry',
            }),
          ],
        })
        dispatch({ name: 'setFlowStage', payload: 'transaction' })
        return
      }

      // .eth name
      dispatch({
        name: 'setTransactions',
        payload: [
          makeTransactionItem('transferName', {
            name,
            newOwner: sendNameWatch,
            contract: 'baseRegistrar',
          }),
        ],
      })
      dispatch({ name: 'setFlowStage', payload: 'transaction' })
      return
    }

    if (managerChoiceWatch && ownerChoiceWatch) {
      // .eth name
      dispatch({
        name: 'setTransactions',
        payload: [
          makeTransactionItem('transferName', {
            name,
            newOwner: sendNameWatch,
            contract: 'baseRegistrar',
          }),
          makeTransactionItem('transferName', {
            name,
            newOwner: sendNameWatch,
            contract: 'registry',
          }),
        ],
      })
      dispatch({ name: 'setFlowStage', payload: 'transaction' })
    }
  }

  const hasErrors = useMemo(() => {
    const errorData = {
      formMessage: '',
      fieldMessage: '',
      hasError: false,
    }

    if (typeof managerChoiceWatch === 'undefined' && typeof ownerChoiceWatch === 'undefined')
      return errorData

    if (!managerChoiceWatch && !ownerChoiceWatch) {
      return {
        ...errorData,
        formMessage: 'Must choose either Manager or Owner to send',
        hasError: true,
      }
    }
    if (getFieldState('sendName').error) return errorData
    if (isLoading) return errorData
    if (sendNameWatch?.includes('.') && !ethNameValidation)
      return { ...errorData, message: 'No address set on name', hasError: true }

    return errorData
  }, [
    ethNameValidation,
    getFieldState,
    isLoading,
    managerChoiceWatch,
    ownerChoiceWatch,
    sendNameWatch,
  ])

  return (
    <>
      <Typography variant="extraLarge">{t('details.sendName.title')}</Typography>
      <Typography style={{ textAlign: 'center' }}>{t('details.sendName.description')}</Typography>
      <Outlink href="">{t('details.sendName.learnMore')}</Outlink>
      {canModify?.canModifyOwner && (
        <SwitchBox>
          <TextContainer>
            <Typography weight="bold">{t('details.sendName.makeOwner')}</Typography>
            <Typography weight="light" variant="small">
              {t('details.sendName.makeOwnerDescription')}
            </Typography>
          </TextContainer>
          <Checkbox
            label=""
            size="large"
            variant="switch"
            value="owner"
            defaultChecked={ownerDefaultChecked}
            data-testid="owner-checkbox"
            {...register('ownerChoice', { shouldUnregister: true })}
          />
        </SwitchBox>
      )}
      {canModify?.canModifyManager && (
        <SwitchBox>
          <TextContainer>
            <Typography weight="bold">{t('details.sendName.makeManager')}</Typography>
            <Typography weight="light" variant="small">
              {t('details.sendName.makeManagerDescription')}
            </Typography>
          </TextContainer>
          <Checkbox
            size="large"
            label=""
            variant="switch"
            value="manager"
            defaultChecked={managerDefaultChecked}
            data-testid="manager-checkbox"
            {...register('managerChoice', { shouldUnregister: true })}
          />
        </SwitchBox>
      )}
      <InnerContainer>
        <form data-testid="edit-resolver-form" ref={formRef}>
          <Input
            data-testid="send-name-input"
            label="Send to"
            placeholder={t('details.sendName.inputPlaceholder')}
            {...register('sendName', {
              validate: {
                length: (value) =>
                  !value.includes('.eth') && value.length !== 42
                    ? t('errors.addressLength')
                    : undefined,
                isAddress: (value) =>
                  !value.includes('.eth') && !ethers.utils.isAddress(value)
                    ? t('errors.invalidAddress')
                    : undefined,
              },
            })}
            error={getFieldState('sendName').error?.message || hasErrors.fieldMessage}
          />
          <Spacer $height="4" />
        </form>
        {primaryName && <NameValue value={primaryName} />}
      </InnerContainer>
      {hasErrors.formMessage && <Helper type="error">{t('errors.ownerManagerChoice')}</Helper>}
      <Dialog.Footer
        leading={
          <Button
            variant="secondary"
            tone="grey"
            shadowless
            onClick={onDismiss}
            loading={isLoading}
          >
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button shadowless onClick={handleSubmitForm} disabled={hasErrors.hasError}>
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default SendName
