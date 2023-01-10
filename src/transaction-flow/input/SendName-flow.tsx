import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Checkbox, Dialog, Helper, Typography, mq } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { DogFood } from '@app/components/@molecules/DogFood'
import { Outlink } from '@app/components/Outlink'
import { useBasicName } from '@app/hooks/useBasicName'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { makeTransactionItem } from '../transaction'

type Data = {
  name: string
  type?: 'manager' | 'owner'
}

type FormData = {
  managerChoice: string
  ownerChoice: string
  dogfoodRaw: string
  address: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

type BasicNameData = ReturnType<typeof useBasicName>

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

export const handleSubmitForm = ({
  basicNameData,
  dispatch,
  newOwner,
  managerChoice,
  ownerChoice,
  canSendOwner,
  canSendManager,
  name,
  address,
  sendNameFunctionCallDetails,
}: {
  basicNameData: BasicNameData
  dispatch: TransactionDialogPassthrough['dispatch']
  newOwner: string
  managerChoice: string
  ownerChoice: string
  canSendOwner: boolean
  canSendManager: boolean
  name: string
  address: string
  sendNameFunctionCallDetails: ReturnType<typeof useSelfAbilities>['sendNameFunctionCallDetails']
}) => {
  const { ownerData } = basicNameData
  const isOwnerOrManager = ownerData?.owner === address || ownerData?.registrant === address
  const transactions = []
  if (canSendManager && managerChoice === 'manager' && sendNameFunctionCallDetails.sendManager) {
    transactions.push(
      makeTransactionItem(isOwnerOrManager ? 'transferName' : 'transferSubname', {
        name,
        newOwner,
        contract: sendNameFunctionCallDetails.sendManager.contract,
        sendType: 'sendManager',
        reclaim: sendNameFunctionCallDetails.sendManager.method === 'reclaim',
      }),
    )
  }

  if (canSendOwner && ownerChoice === 'owner' && sendNameFunctionCallDetails.sendOwner) {
    transactions.push(
      makeTransactionItem(isOwnerOrManager ? 'transferName' : 'transferSubname', {
        name,
        newOwner,
        contract: sendNameFunctionCallDetails.sendOwner!.contract,
        sendType: 'sendOwner',
      }),
    )
  }

  if (transactions.length === 0) return true

  dispatch({
    name: 'setTransactions',
    payload: transactions,
  })
  dispatch({ name: 'setFlowStage', payload: 'transaction' })
}

const InnerContainer = styled.div(() => [
  css`
    width: 100%;
  `,
  mq.sm.min(css`
    width: 510px;
  `),
])

const FooterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const SendName = ({ data, dispatch, onDismiss }: Props) => {
  const { name } = data
  const { t } = useTranslation('profile')
  const basicNameData = useBasicName(name as string)
  const { address = '' } = useAccount()

  const { register, watch, getFieldState, handleSubmit, setValue, getValues, setError, formState } =
    useForm<FormData>({
      mode: 'onChange',
      defaultValues: {
        managerChoice: 'manager',
        ownerChoice: 'owner',
        dogfoodRaw: '',
        address: '',
      },
    })

  const managerChoiceWatch = watch('managerChoice')
  const ownerChoiceWatch = watch('ownerChoice')
  const { canSendOwner, canSendManager, sendNameFunctionCallDetails } = useSelfAbilities(
    address,
    name,
  )
  const loadingAbilities = !canSendOwner && !canSendManager
  const hasChoice =
    (canSendManager && managerChoiceWatch) || (canSendOwner && ownerChoiceWatch) || loadingAbilities

  const hasErrors = Object.keys(formState.errors || {}).length > 0

  const onSubmit = (formData: any) => {
    handleSubmitForm({
      basicNameData,
      dispatch,
      newOwner: formData.address,
      managerChoice: formData.managerChoice,
      ownerChoice: formData.ownerChoice,
      canSendOwner,
      canSendManager,
      name,
      address,
      sendNameFunctionCallDetails,
    })
  }

  return (
    <>
      <Typography variant="extraLarge">{t('details.sendName.title')}</Typography>
      <Typography style={{ textAlign: 'center' }}>{t('details.sendName.description')}</Typography>
      <Outlink href="/faq/managing-a-name#what-are-managers-and-owners">
        {t('details.sendName.learnMore')}
      </Outlink>
      {canSendOwner && (
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
            defaultChecked
            data-testid="owner-checkbox"
            {...register('ownerChoice', { shouldUnregister: true })}
          />
        </SwitchBox>
      )}
      {canSendManager && (
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
            defaultChecked
            data-testid="manager-checkbox"
            {...register('managerChoice', { shouldUnregister: true })}
          />
        </SwitchBox>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <InnerContainer>
          <DogFood
            {...{
              register,
              getFieldState,
              watch,
              setValue,
              getValues,
              setError,
              label: 'Send to',
              formState,
            }}
          />
        </InnerContainer>
        {!hasChoice && (
          <>
            <Spacer $height="3" />
            <Helper type="error">{t('errors.ownerManagerChoice')}</Helper>
          </>
        )}
        <Spacer $height="3" />
        <FooterContainer>
          <Dialog.Footer
            leading={
              <Button variant="secondary" tone="grey" shadowless onClick={onDismiss}>
                {t('action.cancel', { ns: 'common' })}
              </Button>
            }
            trailing={
              <Button
                shadowless
                type="submit"
                disabled={!hasChoice || !formState.isDirty || hasErrors}
              >
                {t('action.next', { ns: 'common' })}
              </Button>
            }
          />
        </FooterContainer>
      </form>
    </>
  )
}

export default SendName
