import { ethers } from 'ethers'
import { useEffect } from 'react'
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
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { useEns } from '@app/utils/EnsProvider'

import { makeTransactionItem } from '../transaction'

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

type BasicNameData = ReturnType<typeof useBasicName>

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

const DogFood = ({ register, getFieldState, watch, setValue }) => {
  const { t } = useTranslation('profile')
  const { getRecords } = useEns()

  const inputWatch = watch('dogfoodRaw')
  const { data: ethNameAddress } = useQuery(
    ['ethNameValidation', inputWatch],
    async () => {
      const result = await getRecords(inputWatch)
      return result?.address
    },
    { enabled: inputWatch?.includes('.eth') },
  )
  const { name: primaryName } = usePrimary(ethNameAddress || inputWatch)

  useEffect(() => {
    setValue('address: ', ethNameAddress || inputWatch)
  }, [ethNameAddress, inputWatch, setValue])

  return (
    <InnerContainer>
      <Input
        data-testid="send-name-input"
        label="Send to"
        placeholder={t('details.sendName.inputPlaceholder')}
        {...register('dogfoodRaw', {
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
        error={getFieldState('dogfoodRaw').error?.message}
      />
      <Spacer $height="4" />
      {primaryName && <NameValue value={primaryName} />}
    </InnerContainer>
  )
}

export const handleSubmitForm =
  ({
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
  }) =>
  () => {
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

  const onSubmit = (formData) => {
    console.log(formData)
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
        <DogFood {...{ register, getFieldState, watch, setValue }} />
        {!hasChoice && <Helper type="error">{t('errors.ownerManagerChoice')}</Helper>}
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
      </form>
    </>
  )
}

export default SendName
