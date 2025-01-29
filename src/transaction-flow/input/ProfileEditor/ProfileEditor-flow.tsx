/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Control, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'
import { useChainId } from 'wagmi'

import { Button, Dialog, PlusSVG } from '@ensdomains/thorin'

import { DisabledButtonWithTooltip } from '@app/components/@molecules/DisabledButtonWithTooltip'
import { AvatarViewManager } from '@app/components/@molecules/ProfileEditor/Avatar/AvatarViewManager'
import { AddProfileRecordView } from '@app/components/pages/profile/[name]/registration/steps/Profile/AddProfileRecordView'
import { CustomProfileRecordInput } from '@app/components/pages/profile/[name]/registration/steps/Profile/CustomProfileRecordInput'
import { ProfileRecordInput } from '@app/components/pages/profile/[name]/registration/steps/Profile/ProfileRecordInput'
import { ProfileRecordTextarea } from '@app/components/pages/profile/[name]/registration/steps/Profile/ProfileRecordTextarea'
import {
  getProfileRecordsDiff,
  isEthAddressRecord,
  profileEditorFormToProfileRecords,
  profileToProfileRecords,
} from '@app/components/pages/profile/[name]/registration/steps/Profile/profileRecordUtils'
import { ProfileRecord } from '@app/constants/profileRecordOptions'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { useIsWrapped } from '@app/hooks/useIsWrapped'
import { useProfile } from '@app/hooks/useProfile'
import { ProfileEditorForm, useProfileEditorForm } from '@app/hooks/useProfileEditorForm'
import { createTransactionItem, TransactionItem } from '@app/transaction-flow/transaction'
import TransactionLoader from '@app/transaction-flow/TransactionLoader'
import type { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { getResolverWrapperAwareness } from '@app/utils/utils'

import ResolverWarningOverlay from './ResolverWarningOverlay'
import { WrappedAvatarButton } from './WrappedAvatarButton'

const AvatarWrapper = styled.div(
  () => css`
    display: flex;
    justify-content: center;
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    padding-bottom: ${theme.space['4']};
  `,
)

const ButtonWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    @media (min-width: 360px) {
      width: max-content;
    }
  `,
)

type Data = {
  name?: string
  resumable?: boolean
}

export type Props = {
  name?: string
  data?: Data
  onDismiss?: () => void
} & TransactionDialogPassthrough

const SubmitButton = ({
  control,
  previousRecords,
  disabled: _disabled,
  canEdit = true,
  onClick,
}: {
  control: Control<ProfileEditorForm>
  previousRecords: ProfileRecord[]
  disabled: boolean
  canEdit: boolean
  onClick: () => void
}) => {
  const { t } = useTranslation('common')

  // Precompute the records that will be submitted
  const form = useWatch({ control }) as ProfileEditorForm
  const currentRecords = profileEditorFormToProfileRecords(form)
  const recordsDiff = getProfileRecordsDiff(currentRecords, previousRecords)

  const disabled = _disabled || recordsDiff.length === 0

  return canEdit ? (
    <Button disabled={disabled} data-testid="profile-submit-button" onClick={onClick}>
      {t('action.save', { ns: 'common' })}
    </Button>
  ) : (
    <DisabledButtonWithTooltip
      buttonId="profile-editor-save-disabled"
      content={t('details.tabs.records.editRecordsDisabled', { ns: 'profile' })}
      buttonText={t('action.save', { ns: 'common' })}
      mobileWidth={150}
      width={150}
      mobilePlacement="top"
      placement="top"
      size="medium"
    />
  )
}

const ProfileEditor = ({ data = {}, transactions = [], dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('register')

  const formRef = useRef<HTMLFormElement>(null)
  const [view, setView] = useState<'editor' | 'upload' | 'nft' | 'addRecord' | 'warning'>('editor')

  const { name = '', resumable = false } = data

  const { data: profile, isLoading: isProfileLoading } = useProfile({ name })
  const { data: isWrapped = false, isLoading: isWrappedLoading } = useIsWrapped({ name })
  const isLoading = isProfileLoading || isWrappedLoading

  const existingRecords = profileToProfileRecords(profile)

  const {
    records: profileRecords,
    register,
    trigger,
    control,
    handleSubmit,
    addRecords,
    updateRecord,
    removeRecordAtIndex,
    updateRecordAtIndex,
    removeRecordByGroupAndKey,
    setAvatar,
    labelForRecord,
    secondaryLabelForRecord,
    placeholderForRecord,
    validatorForRecord,
    errorForRecordAtIndex,
    isDirtyForRecordAtIndex,
    hasErrors,
  } = useProfileEditorForm(existingRecords)

  // Update profile records if transaction data exists
  const [isRecordsUpdated, setIsRecordsUpdated] = useState(false)
  useEffect(() => {
    const updateProfileRecordsWithTransactionData = () => {
      const transaction = transactions.find(
        (item: TransactionItem) => item.name === 'updateProfileRecords',
      ) as TransactionItem<'updateProfileRecords'>
      if (!transaction) return
      const updatedRecords: ProfileRecord[] = transaction?.data?.records || []
      updatedRecords.forEach((record) => {
        if (record.key === 'avatar' && record.group === 'media') {
          setAvatar(record.value)
        } else {
          updateRecord(record)
        }
      })
      existingRecords.forEach((record) => {
        const updatedRecord = updatedRecords.find(
          (r) => r.group === record.group && r.key === record.key,
        )
        if (!updatedRecord) {
          removeRecordByGroupAndKey(record.group, record.key)
        }
      })
    }
    if (!isLoading) {
      updateProfileRecordsWithTransactionData()
      setIsRecordsUpdated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, transactions, setIsRecordsUpdated, isRecordsUpdated])

  const resolverAddress = useContractAddress({ contract: 'ensPublicResolver' })

  const resolverStatus = useResolverStatus({
    name,
  })

  const chainId = useChainId()

  const handleCreateTransaction = useCallback(
    async (form: ProfileEditorForm) => {
      const records = profileEditorFormToProfileRecords(form)
      if (!profile?.resolverAddress) return
      dispatch({
        name: 'setTransactions',
        payload: [
          createTransactionItem('updateProfileRecords', {
            name,
            resolverAddress: profile.resolverAddress,
            records,
            previousRecords: existingRecords,
            clearRecords: false,
          }),
        ],
      })
      dispatch({ name: 'setFlowStage', payload: 'transaction' })
    },
    [profile, name, existingRecords, dispatch],
  )

  const [avatarSrc, setAvatarSrc] = useState<string | undefined>()
  const [avatarFile, setAvatarFile] = useState<File | undefined>()

  useEffect(() => {
    if (
      !resolverStatus.isLoading &&
      !resolverStatus.data?.hasLatestResolver &&
      transactions.length === 0
    ) {
      setView('warning')
    }
  }, [resolverStatus.isLoading, resolverStatus.data?.hasLatestResolver, transactions.length])

  useEffect(() => {
    if (!isProfileLoading && profile?.isMigrated === false) {
      setView('warning')
    }
  }, [isProfileLoading, profile?.isMigrated])

  const handleDeleteRecord = (record: ProfileRecord, index: number) => {
    removeRecordAtIndex(index)
    process.nextTick(() => trigger())
  }

  const handleShowAddRecordModal = () => {
    setView('addRecord')
  }

  const canEditRecordsWhenWrapped = match(isWrapped)
    .with(true, () =>
      getResolverWrapperAwareness({ chainId, resolverAddress: profile?.resolverAddress }),
    )
    .otherwise(() => true)

  if (isLoading || resolverStatus.isLoading || !isRecordsUpdated) return <TransactionLoader />

  return (
    <>
      {match(view)
        .with('editor', () => (
          <>
            <Dialog.Heading title={t('steps.profile.title2')} />
            <Dialog.Content
              as="form"
              ref={formRef}
              data-testid="profile-editor"
              onSubmit={handleSubmit((_data) => {
                handleCreateTransaction(_data)
              })}
              alwaysShowDividers={{ bottom: true }}
            >
              <AvatarWrapper>
                <WrappedAvatarButton
                  name={name}
                  control={control}
                  src={avatarSrc}
                  onSelectOption={(option) => setView(option)}
                  onAvatarChange={(avatar) => setAvatar(avatar)}
                  onAvatarFileChange={(file) => setAvatarFile(file)}
                  onAvatarSrcChange={(src) => setAvatarSrc(src)}
                />
              </AvatarWrapper>
              {profileRecords.map((field, index) =>
                field.group === 'custom' ? (
                  <CustomProfileRecordInput
                    key={field.id}
                    register={register}
                    trigger={trigger}
                    index={index}
                    validator={validatorForRecord(field)}
                    validated={isDirtyForRecordAtIndex(index)}
                    error={errorForRecordAtIndex(index, 'key')}
                    onDelete={() => {
                      handleDeleteRecord(field, index)
                    }}
                  />
                ) : field.key === 'description' ? (
                  <ProfileRecordTextarea
                    key={field.id}
                    recordKey={field.key}
                    label={labelForRecord(field)}
                    secondaryLabel={secondaryLabelForRecord(field)}
                    placeholder={placeholderForRecord(field)}
                    error={errorForRecordAtIndex(index)}
                    validated={isDirtyForRecordAtIndex(index)}
                    onDelete={() => {
                      handleDeleteRecord(field, index)
                    }}
                    {...register(`records.${index}.value`, {
                      validate: validatorForRecord(field),
                    })}
                  />
                ) : (
                  <ProfileRecordInput
                    key={field.id}
                    recordKey={field.key}
                    group={field.group}
                    label={labelForRecord(field)}
                    secondaryLabel={secondaryLabelForRecord(field)}
                    placeholder={placeholderForRecord(field)}
                    error={errorForRecordAtIndex(index)}
                    validated={isDirtyForRecordAtIndex(index)}
                    onDelete={() => {
                      if (isEthAddressRecord(field)) {
                        updateRecordAtIndex(index, { ...field, value: '' })
                      } else {
                        handleDeleteRecord(field, index)
                      }
                    }}
                    {...register(`records.${index}.value`, {
                      validate: validatorForRecord(field),
                    })}
                  />
                ),
              )}
              <ButtonContainer>
                <ButtonWrapper>
                  <Button
                    size="medium"
                    onClick={handleShowAddRecordModal}
                    data-testid="show-add-profile-records-modal-button"
                    prefix={PlusSVG}
                  >
                    {t('steps.profile.addMore')}
                  </Button>
                </ButtonWrapper>
              </ButtonContainer>
            </Dialog.Content>
            <Dialog.Footer
              leading={
                <Button
                  id="profile-back-button"
                  type="button"
                  colorStyle="accentSecondary"
                  data-testid="profile-back-button"
                  onClick={() => {
                    onDismiss?.()
                    // dispatch({ name: 'stopFlow' })
                  }}
                >
                  {t('action.cancel', { ns: 'common' })}
                </Button>
              }
              trailing={
                <SubmitButton
                  control={control}
                  disabled={hasErrors}
                  previousRecords={existingRecords}
                  canEdit={canEditRecordsWhenWrapped}
                  onClick={() =>
                    formRef.current?.dispatchEvent(
                      new Event('submit', { cancelable: true, bubbles: true }),
                    )
                  }
                />
              }
            />
          </>
        ))
        .with('addRecord', () => (
          <AddProfileRecordView
            control={control}
            onAdd={(newRecords) => {
              addRecords(newRecords)
              setView('editor')
            }}
            onClose={() => setView('editor')}
          />
        ))
        .with('warning', () => (
          <ResolverWarningOverlay
            name={name}
            status={resolverStatus.data}
            isWrapped={isWrapped}
            hasOldRegistry={profile?.isMigrated === false}
            resumable={resumable}
            hasNoResolver={!resolverStatus.data?.hasResolver}
            hasMigratedProfile={resolverStatus.data?.hasMigratedProfile}
            latestResolverAddress={resolverAddress!}
            oldResolverAddress={profile?.resolverAddress!}
            dispatch={dispatch}
            onDismiss={() => dispatch({ name: 'stopFlow' })}
            onDismissOverlay={() => setView('editor')}
          />
        ))
        .with('upload', 'nft', (type) => (
          <AvatarViewManager
            name={name}
            avatarFile={avatarFile}
            handleCancel={() => setView('editor')}
            type={type}
            handleSubmit={(_, uri, display) => {
              setAvatar(uri)
              setAvatarSrc(display)
              setView('editor')
              trigger()
            }}
          />
        ))
        .exhaustive()}
    </>
  )
}

export default ProfileEditor
