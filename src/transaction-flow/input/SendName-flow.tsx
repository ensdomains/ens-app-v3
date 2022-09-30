import { ethers } from 'ethers'
import { useRef } from 'react'
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

const TextContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
  `,
)

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
  const formRef = useRef<HTMLFormElement>(null)
  const { getRecords } = useEns()
  const { ownerData, isWrapped } = useBasicName(name as string)
  const parentName = name.split('.').slice(1).join('.')
  const parentNameOwnerData = useBasicName(parentName)
  const { address } = useAccount()
  const { register, watch, getFieldState } = useForm<FormData>({
    mode: 'onChange',
  })

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
    const _canModifyManager = false

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

  const { t } = useTranslation('transactionFlow')

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
      // if is owner but not manager then need to reclaim
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

  const hasErrors = () => {
    if (!managerChoiceWatch && !ownerChoiceWatch) {
      return { formMessage: 'Must choose either Manager or Owner to send' }
    }
    if (getFieldState('sendName').error) return {}
    if (isLoading) return {}
    if (sendNameWatch?.includes('.') && !ethNameValidation)
      return { message: 'No address set on name' }
    return false
  }

  return (
    <>
      <Typography variant="extraLarge">Send Name</Typography>
      <Typography style={{ textAlign: 'center' }}>
        Sending this name will make the new address both the owner and manager.
      </Typography>
      <Outlink href="">Learn more about name ownership.</Outlink>
      {canModify?.canModifyOwner && (
        <SwitchBox>
          <TextContainer>
            <Typography weight="bold">Make Owner</Typography>
            <Typography weight="light" variant="small">
              The owner can send to a new manager
            </Typography>
          </TextContainer>
          <Checkbox
            label=""
            size="large"
            variant="switch"
            value="owner"
            defaultChecked
            data-testid="owner-checkbox"
            {...register('ownerChoice')}
          />
        </SwitchBox>
      )}
      {canModify?.canModifyManager && (
        <SwitchBox>
          <TextContainer>
            <Typography weight="bold">Make Manager</Typography>
            <Typography weight="light" variant="small">
              The Manager can change and set records
            </Typography>
          </TextContainer>
          <Checkbox
            size="large"
            label=""
            variant="switch"
            value="manager"
            defaultChecked
            data-testid="manager-checkbox"
            {...register('managerChoice')}
          />
        </SwitchBox>
      )}
      <InnerContainer>
        <form data-testid="edit-resolver-form" ref={formRef}>
          <Input
            data-testid="send-name-input"
            label="Send to"
            placeholder="Enter an Ethereum address or ENS name"
            {...register('sendName', {
              validate: {
                length: (value) =>
                  !value.includes('.eth') && value.length !== 42
                    ? 'If address it should be 42 characters long'
                    : undefined,
                isAddress: (value) =>
                  !value.includes('.eth') && !ethers.utils.isAddress(value)
                    ? 'Not a valid address'
                    : undefined,
              },
            })}
            error={getFieldState('sendName').error?.message || hasErrors()?.message}
          />
          <Spacer $height="4" />
        </form>
        {primaryName && <NameValue value={primaryName} />}
      </InnerContainer>
      {hasErrors()?.formMessage && <Helper type="error">Must send Owner or Manager</Helper>}
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
          <Button shadowless onClick={handleSubmitForm} disabled={hasErrors()}>
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default SendName
