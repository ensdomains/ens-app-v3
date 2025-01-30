import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'

import { validateName } from '@ensdomains/ensjs/utils'
import { Button, Dialog, Input, PlusSVG } from '@ensdomains/thorin'

import { AvatarClickType } from '@app/components/@molecules/ProfileEditor/Avatar/AvatarButton'
import { AvatarViewManager } from '@app/components/@molecules/ProfileEditor/Avatar/AvatarViewManager'
import { AddProfileRecordView } from '@app/components/pages/profile/[name]/registration/steps/Profile/AddProfileRecordView'
import { CustomProfileRecordInput } from '@app/components/pages/profile/[name]/registration/steps/Profile/CustomProfileRecordInput'
import { ProfileRecordInput } from '@app/components/pages/profile/[name]/registration/steps/Profile/ProfileRecordInput'
import { ProfileRecordTextarea } from '@app/components/pages/profile/[name]/registration/steps/Profile/ProfileRecordTextarea'
import { profileEditorFormToProfileRecords } from '@app/components/pages/profile/[name]/registration/steps/Profile/profileRecordUtils'
import { WrappedAvatarButton } from '@app/components/pages/profile/[name]/registration/steps/Profile/WrappedAvatarButton'
import { ProfileRecord } from '@app/constants/profileRecordOptions'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import { useProfileEditorForm } from '@app/hooks/useProfileEditorForm'

import { useValidateSubnameLabel } from '../../hooks/useValidateSubnameLabel'
import { createTransactionItem } from '../transaction'
import { TransactionDialogPassthrough } from '../types'

type Data = {
  parent: string
  isWrapped: boolean
}

type ModalOption = AvatarClickType | 'editor' | 'profile-editor' | 'add-record'

export type Props = {
  data: Data
} & TransactionDialogPassthrough

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

const ParentLabel = styled.div(
  ({ theme }) => css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: ${theme.space['48']};
  `,
)

const useSubnameLabel = (data: Data) => {
  const [label, setLabel] = useState('')
  const [_label, _setLabel] = useState('')

  const {
    valid,
    error,
    expiryLabel,
    isLoading: isUseValidateSubnameLabelLoading,
  } = useValidateSubnameLabel({
    name: data.parent,
    label,
    isWrapped: data.isWrapped,
  })

  const debouncedSetLabel = useDebouncedCallback(setLabel, 500)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const normalised = validateName(e.target.value)
      _setLabel(normalised)
      debouncedSetLabel(normalised)
    } catch {
      _setLabel(e.target.value)
      debouncedSetLabel(e.target.value)
    }
  }

  const isLabelsInsync = label === _label
  const isLoading = isUseValidateSubnameLabelLoading || !isLabelsInsync

  return {
    valid,
    error,
    expiryLabel,
    isLoading,
    label: _label,
    debouncedLabel: label,
    setLabel: handleChange,
  }
}

const CreateSubname = ({ data: { parent, isWrapped }, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('profile')
  const { t: registerT } = useTranslation('register')

  const [view, setView] = useState<ModalOption>('editor')

  const { valid, error, expiryLabel, isLoading, debouncedLabel, label, setLabel } = useSubnameLabel(
    {
      parent,
      isWrapped,
    },
  )

  const name = `${debouncedLabel}.${parent}`

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
  } = useProfileEditorForm([
    {
      key: 'eth',
      value: '',
      type: 'addr',
      group: 'address',
    },
  ])

  const handleSubmit = () => {
    const payload = [
      createTransactionItem('createSubname', {
        contract: isWrapped ? 'nameWrapper' : 'registry',
        label: debouncedLabel,
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
        .with('editor', () => (
          <>
            <Dialog.Heading title={t('details.tabs.subnames.addSubname.dialog.title')} />
            <Dialog.Content>
              <Input
                data-testid="add-subname-input"
                label="Label"
                suffix={<ParentLabel>.{parent}</ParentLabel>}
                value={label}
                onChange={setLabel}
                error={
                  error
                    ? t(`details.tabs.subnames.addSubname.dialog.error.${error}`, {
                        date: expiryLabel,
                      })
                    : undefined
                }
              />
            </Dialog.Content>
            <Dialog.Footer
              leading={
                <Button colorStyle="accentSecondary" onClick={onDismiss}>
                  {t('action.cancel', { ns: 'common' })}
                </Button>
              }
              trailing={
                <Button
                  data-testid="create-subname-next"
                  onClick={() => setView('profile-editor')}
                  disabled={!valid || isLoading}
                >
                  {t('action.next', { ns: 'common' })}
                </Button>
              }
            />
          </>
        ))
        .with('profile-editor', () => (
          <>
            <Dialog.Heading title={t('details.tabs.subnames.setProfile')} />
            <Dialog.Content>
              <WrappedAvatarButton
                disabledUpload
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
                <Button colorStyle="accentSecondary" onClick={() => setView('editor')}>
                  {t('action.cancel', { ns: 'common' })}
                </Button>
              }
              trailing={
                <Button
                  data-testid="create-subname-profile-next"
                  onClick={handleSubmit}
                  disabled={!valid || isLoading}
                >
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
            name={parent} // TODO name
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

export default CreateSubname
