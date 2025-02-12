/* eslint-disable no-nested-ternary */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'

import { Button, Dialog, PlusSVG } from '@ensdomains/thorin'

import { AvatarClickType } from '@app/components/@molecules/ProfileEditor/Avatar/AvatarButton'
import { AvatarViewManager } from '@app/components/@molecules/ProfileEditor/Avatar/AvatarViewManager'
import { AddProfileRecordView } from '@app/components/pages/profile/[name]/registration/steps/Profile/AddProfileRecordView'
import { CustomProfileRecordInput } from '@app/components/pages/profile/[name]/registration/steps/Profile/CustomProfileRecordInput'
import { ProfileRecordInput } from '@app/components/pages/profile/[name]/registration/steps/Profile/ProfileRecordInput'
import { ProfileRecordTextarea } from '@app/components/pages/profile/[name]/registration/steps/Profile/ProfileRecordTextarea'
import {
  profileEditorFormToProfileRecords,
  profileToProfileRecords,
} from '@app/components/pages/profile/[name]/registration/steps/Profile/profileRecordUtils'
import { ProfileRecord } from '@app/constants/profileRecordOptions'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useProfile } from '@app/hooks/useProfile'
import { useProfileEditorForm } from '@app/hooks/useProfileEditorForm'
import { createTransactionItem } from '@app/transaction-flow/transaction'
import type { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { WrappedAvatarButton } from './ProfileEditor/WrappedAvatarButton'

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
    @media (min-width: ${theme.breakpoints.xs}px) {
      width: ${theme.space.max};
    }
  `,
)

type Data = {
  name: string
  label: string
  parent: string
}

type ModalOption = AvatarClickType | 'profile-editor' | 'add-record'

export type Props = {
  name?: string
  data: Data
  onDismiss?: () => void
} & TransactionDialogPassthrough

const ProfileReclaim = ({ data: { name, label, parent }, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('profile')
  const { t: registerT } = useTranslation('register')

  const [view, setView] = useState<ModalOption>('profile-editor')

  const { data: profile } = useProfile({ name })

  const existingRecords = profileToProfileRecords(profile)

  const defaultResolverAddress = useContractAddress({ contract: 'ensPublicResolver' })

  const {
    isDirty,
    records,
    register,
    trigger,
    control,
    addRecords,
    getValues,
    removeRecordAtIndex,
    setAvatar,
    labelForRecord,
    secondaryLabelForRecord,
    placeholderForRecord,
    validatorForRecord,
    errorForRecordAtIndex,
    isDirtyForRecordAtIndex,
  } = useProfileEditorForm(existingRecords)
  const handleSubmit = () => {
    const payload = [
      createTransactionItem('createSubname', {
        contract: 'nameWrapper',
        label,
        parent,
      }),
    ]

    if (isDirty && records.length) {
      payload.push(
        createTransactionItem('updateProfileRecords', {
          name,
          records: profileEditorFormToProfileRecords(getValues()),
          resolverAddress: defaultResolverAddress,
          clearRecords: false,
        }) as never,
      )
    }
    dispatch({
      name: 'setTransactions',
      payload,
    })
    dispatch({
      name: 'setFlowStage',
      payload: 'transaction',
    })
  }

  const [avatarFile, setAvatarFile] = useState<File | undefined>()
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>()

  const handleDeleteRecord = (_: ProfileRecord, index: number) => {
    removeRecordAtIndex(index)
    process.nextTick(() => trigger())
  }

  return (
    <>
      {match(view)
        .with('profile-editor', () => (
          <>
            <Dialog.Heading title={t('details.tabs.subnames.setProfile')} />
            <Dialog.Content>
              <WrappedAvatarButton
                name={name}
                control={control}
                src={avatarSrc}
                onSelectOption={setView}
                onAvatarChange={(avatar) => setAvatar(avatar)}
                onAvatarFileChange={(file) => setAvatarFile(file)}
                onAvatarSrcChange={(src) => setAvatarSrc(src)}
              />
              {records.map((field, index) =>
                match(field)
                  .with({ group: 'custom' }, () => (
                    <CustomProfileRecordInput
                      key={field.id}
                      register={register}
                      trigger={trigger}
                      index={index}
                      validator={validatorForRecord(field)}
                      validated={isDirtyForRecordAtIndex(index)}
                      error={errorForRecordAtIndex(index, 'key')}
                      onDelete={() => handleDeleteRecord(field, index)}
                    />
                  ))
                  .with({ key: 'description' }, () => (
                    <ProfileRecordTextarea
                      key={field.id}
                      recordKey={field.key}
                      label={labelForRecord(field)}
                      secondaryLabel={secondaryLabelForRecord(field)}
                      placeholder={placeholderForRecord(field)}
                      error={errorForRecordAtIndex(index)}
                      validated={isDirtyForRecordAtIndex(index)}
                      onDelete={() => handleDeleteRecord(field, index)}
                      {...register(`records.${index}.value`, {
                        validate: validatorForRecord(field),
                      })}
                    />
                  ))
                  .otherwise(() => (
                    <ProfileRecordInput
                      key={field.id}
                      recordKey={field.key}
                      group={field.group}
                      label={labelForRecord(field)}
                      secondaryLabel={secondaryLabelForRecord(field)}
                      placeholder={placeholderForRecord(field)}
                      error={errorForRecordAtIndex(index)}
                      validated={isDirtyForRecordAtIndex(index)}
                      onDelete={() => handleDeleteRecord(field, index)}
                      {...register(`records.${index}.value`, {
                        validate: validatorForRecord(field),
                      })}
                    />
                  )),
              )}
              <ButtonContainer>
                <ButtonWrapper>
                  <Button
                    size="medium"
                    onClick={() => setView('add-record')}
                    data-testid="show-add-profile-records-modal-button"
                    prefix={PlusSVG}
                  >
                    {registerT('steps.profile.addMore')}
                  </Button>
                </ButtonWrapper>
              </ButtonContainer>
            </Dialog.Content>
            <Dialog.Footer
              leading={
                <Button colorStyle="accentSecondary" onClick={onDismiss}>
                  {t('action.cancel', { ns: 'common' })}
                </Button>
              }
              trailing={
                <Button data-testid="reclaim-profile-next" onClick={handleSubmit}>
                  {isDirty
                    ? t('action.next', { ns: 'common' })
                    : t('action.skip', { ns: 'common' })}
                </Button>
              }
            />
          </>
        ))
        .with('add-record', () => (
          <AddProfileRecordView
            control={control}
            onAdd={(newRecords) => {
              addRecords(newRecords)
              setView('profile-editor')
            }}
            onClose={() => setView('profile-editor')}
          />
        ))
        .with('upload', 'nft', (type) => (
          <AvatarViewManager
            name={name}
            avatarFile={avatarFile}
            handleCancel={() => setView('profile-editor')}
            type={type}
            handleSubmit={(_, uri, display) => {
              setAvatar(uri)
              setAvatarSrc(display)
              setView('profile-editor')
              trigger()
            }}
          />
        ))
        .exhaustive()}
    </>
  )
}

export default ProfileReclaim
