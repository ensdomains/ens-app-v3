/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Control, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'

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
import { makeIntroItem } from '@app/transaction-flow/intro'
import { createTransactionItem, TransactionItem } from '@app/transaction-flow/transaction'
import TransactionLoader from '@app/transaction-flow/TransactionLoader'
import type { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { useProfileEditorReducer } from './hooks/useProfileEditorReducer'
import { InvalidResolverView } from './views/InvalidResolverView'
import { MigrateProfileSelectorView } from './views/MigrateProfileSelectorView.tsx'
import { MigrateProfileWarningView } from './views/MigrateProfileWarningView'
import { MigrateRegistryView } from './views/MigrateRegistryView'
import { NoResolverView } from './views/NoResolverView'
import { ResetProfileView } from './views/ResetProfileView'
import { ResolverNotNameWrapperAwareView } from './views/ResolverNotNameWrapperAwareView'
import { ResolverOutOfDateView } from './views/ResolverOutOfDateView'
import { TransferOrResetProfileView } from './views/TransferOrResetProfileView'
import { UpdateResolverOrResetProfileView } from './views/UpdateResolverOrResetProfileView'
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

const CloseButtonBlocker = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    right: 0;
    background: ${theme.colors.backgroundPrimary};
    width: ${theme.space['12']};
    height: ${theme.space['12']};
    z-index: 1000;
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

export type SelectedProfile = 'latest' | 'current' | 'reset'

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

  const { name = '' } = data

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

  const isLoading_ = isLoading || resolverStatus.isLoading
  const [editorState, editorDispatch] = useProfileEditorReducer(
    {
      profile,
      resolverStatus: resolverStatus.data,
      isWrapped,
      isLoading: isLoading_,
    },
    {
      onDismiss,
    },
  )
  const view = editorState.stack[editorState.stack.length - 1]

  const handleDeleteRecord = (record: ProfileRecord, index: number) => {
    removeRecordAtIndex(index)
    process.nextTick(() => trigger())
  }

  const handleShowAddRecordModal = () => {
    editorDispatch({ type: 'pushView', payload: 'addRecord' })
  }

  const handleUpdateResolver = () => {
    dispatch({
      name: 'setTransactions',
      payload: [
        createTransactionItem('updateResolver', {
          name,
          contract: isWrapped ? 'nameWrapper' : 'registry',
          resolverAddress,
        }),
      ],
    })
    dispatch({
      name: 'setFlowStage',
      payload: 'transaction',
    })
  }

  const handleMigrateProfile = () => {
    dispatch({
      name: 'startFlow',
      key: `migrate-profile-${name}`,
      payload: {
        intro: {
          title: ['input.profileEditor.intro.migrateProfile.title', { ns: 'transactionFlow' }],
          content: makeIntroItem('GenericWithDescription', {
            description: t('input.profileEditor.intro.migrateProfile.description', {
              ns: 'transactionFlow',
            }),
          }),
        },
        transactions: [
          createTransactionItem('migrateProfile', {
            name,
          }),
          createTransactionItem('updateResolver', {
            name,
            contract: isWrapped ? 'nameWrapper' : 'registry',
            resolverAddress,
          }),
        ],
      },
    })
  }

  const handleResetProfile = () => {
    dispatch({
      name: 'startFlow',
      key: `reset-profile-${name}`,
      payload: {
        intro: {
          title: ['input.profileEditor.intro.resetProfile.title', { ns: 'transactionFlow' }],
          content: makeIntroItem('GenericWithDescription', {
            description: t('input.profileEditor.intro.resetProfile.description', {
              ns: 'transactionFlow',
            }),
          }),
        },
        transactions: [
          createTransactionItem('resetProfile', {
            name,
            resolverAddress,
          }),
          createTransactionItem('updateResolver', {
            name,
            contract: isWrapped ? 'nameWrapper' : 'registry',
            resolverAddress,
          }),
        ],
      },
    })
  }

  const handleMigrateCurrentProfileToLatest = async () => {
    dispatch({
      name: 'startFlow',
      key: `migrate-profile-with-reset-${name}`,
      payload: {
        intro: {
          title: [
            'input.profileEditor.intro.migrateCurrentProfile.title',
            { ns: 'transactionFlow' },
          ],
          content: makeIntroItem('GenericWithDescription', {
            description: t('input.profileEditor.intro.migrateCurrentProfile.description', {
              ns: 'transactionFlow',
            }),
          }),
        },
        transactions: [
          createTransactionItem('migrateProfileWithReset', {
            name,
            resolverAddress: profile?.resolverAddress!,
          }),
          createTransactionItem('updateResolver', {
            name,
            contract: isWrapped ? 'nameWrapper' : 'registry',
            resolverAddress,
          }),
        ],
      },
    })
  }

  const handleMigrate = () => {
    if (resolverStatus.data?.hasMigratedProfile && resolverStatus.data?.isMigratedProfileEqual)
      editorDispatch({ type: 'pushView', payload: 'updateResolverOrResetProfile' })
    else if (resolverStatus.data?.hasMigratedProfile)
      editorDispatch({ type: 'pushView', payload: 'migrateProfileSelector' })
    else if (resolverStatus.data?.hasProfile)
      editorDispatch({ type: 'pushView', payload: 'transferOrResetProfile' })
    else handleUpdateResolver()
  }

  const canEditRecordsWhenWrapped = !!resolverStatus.data?.isAuthorized

  const shouldInitializeEditorState = !isLoading_ && view === 'loading'
  useEffect(() => {
    if (shouldInitializeEditorState)
      editorDispatch({
        type: 'init',
        payload: {
          profile,
          resolverStatus: resolverStatus.data,
          isWrapped,
          isLoading: isLoading_,
        },
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldInitializeEditorState])

  if (isLoading || resolverStatus.isLoading || !isRecordsUpdated) return <TransactionLoader />

  return (
    <>
      <CloseButtonBlocker />
      {match(view)
        .with('loading', () => <TransactionLoader />)
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
                  onSelectOption={(option) => {
                    editorDispatch({ type: 'pushView', payload: option })
                  }}
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
              editorDispatch({ type: 'popView' })
            }}
            onClose={() => editorDispatch({ type: 'popView' })}
          />
        ))
        .with('upload', 'nft', (type) => (
          <AvatarViewManager
            name={name}
            avatarFile={avatarFile}
            handleCancel={() => editorDispatch({ type: 'popView' })}
            type={type}
            handleSubmit={(_, uri, display) => {
              setAvatar(uri)
              setAvatarSrc(display)
              editorDispatch({ type: 'popView' })
              trigger()
            }}
          />
        ))
        .with('migrateRegistry', () => <MigrateRegistryView name={name} onCancel={onDismiss} />)
        .with('invalidResolver', () => (
          <InvalidResolverView onConfirm={() => handleUpdateResolver()} onCancel={onDismiss} />
        ))
        .with('migrateProfileSelector', () => (
          <MigrateProfileSelectorView
            name={name}
            currentResolverAddress={profile?.resolverAddress!}
            latestResolverAddress={resolverAddress!}
            hasCurrentProfile={resolverStatus.data?.hasProfile!}
            onBack={() => {
              editorDispatch({ type: 'popView' })
            }}
            onNext={(selectedProfile) => {
              if (selectedProfile === 'latest') handleUpdateResolver()
              else if (selectedProfile === 'current')
                editorDispatch({ type: 'pushView', payload: 'migrateProfileWarning' })
              else editorDispatch({ type: 'pushView', payload: 'resetProfile' })
            }}
          />
        ))
        .with('migrateProfileWarning', () => (
          <MigrateProfileWarningView
            onBack={() => {
              editorDispatch({ type: 'popView' })
            }}
            onNext={() => handleMigrateCurrentProfileToLatest()}
          />
        ))
        .with('noResolver', () => (
          <NoResolverView
            onCancel={() => {
              editorDispatch({ type: 'popView' })
            }}
            onConfirm={() => handleMigrate()}
          />
        ))
        .with('resetProfile', () => (
          <ResetProfileView
            onBack={() => {
              editorDispatch({ type: 'popView' })
            }}
            onNext={() => handleResetProfile()}
          />
        ))
        .with('resolverNotNameWrapperAware', () => (
          <ResolverNotNameWrapperAwareView
            onCancel={onDismiss}
            onNext={() => {
              handleMigrate()
            }}
          />
        ))
        .with('resolverOutOfDate', () => (
          <ResolverOutOfDateView
            onCancel={() => {
              editorDispatch({ type: 'popView' })
            }}
            onConfirm={() => {
              handleMigrate()
            }}
          />
        ))
        .with('transferOrResetProfile', () => (
          <TransferOrResetProfileView
            onBack={() => {
              editorDispatch({ type: 'popView' })
            }}
            onNext={(selectedProfile: SelectedProfile) => {
              if (selectedProfile === 'reset') handleUpdateResolver()
              else handleMigrateProfile()
            }}
          />
        ))
        .with('updateResolverOrResetProfile', () => (
          <UpdateResolverOrResetProfileView
            onBack={() => editorDispatch({ type: 'popView' })}
            onNext={(selected) => {
              if (selected === 'reset') handleResetProfile()
              else handleUpdateResolver()
            }}
          />
        ))
        .exhaustive()}
    </>
  )
}

export default ProfileEditor
