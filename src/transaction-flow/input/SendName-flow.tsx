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
  name,
  address,
  sendNameFunctionCallDetails,
}: {
  basicNameData: BasicNameData
  dispatch: TransactionDialogPassthrough['dispatch']
  newOwner: string
  managerChoice: string
  ownerChoice: string
  name: string
  address: string
  sendNameFunctionCallDetails: ReturnType<typeof useSelfAbilities>['sendNameFunctionCallDetails']
}) => {
  const { ownerData } = basicNameData
  const callCount = Object.keys(sendNameFunctionCallDetails).length
  const isOwnerOrManager = ownerData?.owner === address || ownerData?.registrant === address

  if (callCount > 2) {
    console.error('Too many send transactions')
    return
  }

  if (Object.keys(sendNameFunctionCallDetails).length === 2 && managerChoice && ownerChoice) {
    if (!sendNameFunctionCallDetails.sendManager || !sendNameFunctionCallDetails.sendOwner) return
    // This can only happen as the registrant of a 2LD .eth name
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('transferName', {
          name,
          newOwner,
          contract: sendNameFunctionCallDetails.sendManager.contract,
          reclaim: sendNameFunctionCallDetails.sendManager.method === 'reclaim',
        }),
        makeTransactionItem('transferName', {
          name,
          newOwner,
          contract: sendNameFunctionCallDetails.sendOwner.contract,
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
    return
  }

  const sendType = managerChoice ? 'sendManager' : 'sendOwner'
  if (!sendNameFunctionCallDetails[sendType]) return

  dispatch({
    name: 'setTransactions',
    payload: [
      makeTransactionItem(isOwnerOrManager ? 'transferName' : 'transferSubname', {
        name,
        newOwner,
        contract: sendNameFunctionCallDetails[sendType]!.contract,
        reclaim: sendNameFunctionCallDetails[sendType]!.method === 'reclaim',
      }),
    ],
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
  const {
    register,
    watch,
    getFieldState,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { isValid, isDirty },
  } = useForm<FormData>({
    mode: 'onChange',
  })

  const managerChoiceWatch = watch('managerChoice')
  const ownerChoiceWatch = watch('ownerChoice')
  const hasChoice = managerChoiceWatch || ownerChoiceWatch

  const { canSendOwner, canSendManager, sendNameFunctionCallDetails } = useSelfAbilities(
    address,
    name,
  )

  const onSubmit = (formData: any) => {
    handleSubmitForm({
      basicNameData,
      dispatch,
      newOwner: formData.address,
      managerChoice: formData.managerChoice,
      ownerChoice: formData.ownerChoice,
      name,
      address,
      sendNameFunctionCallDetails,
    })
  }

  return (
    <>
      <Typography variant="extraLarge">{t('details.sendName.title')}</Typography>
      <Typography style={{ textAlign: 'center' }}>{t('details.sendName.description')}</Typography>
      <Outlink href="">{t('details.sendName.learnMore')}</Outlink>
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
            {...{ register, getFieldState, watch, setValue, getValues, setError, label: 'Send to' }}
          />
        </InnerContainer>
        {!hasChoice && <Helper type="error">{t('errors.ownerManagerChoice')}</Helper>}
        <Spacer $height="3" />
        <FooterContainer>
          <Dialog.Footer
            leading={
              <Button variant="secondary" tone="grey" shadowless onClick={onDismiss}>
                {t('action.cancel', { ns: 'common' })}
              </Button>
            }
            trailing={
              <Button shadowless type="submit" disabled={!hasChoice || !isValid || !isDirty}>
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
