/* eslint-disable no-nested-ternary */
import { BaseSyntheticEvent, useEffect, useRef, useState } from 'react'
import { Control, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'
import { useAccount } from 'wagmi'

import { Button, Dialog, PlusSVG, Typography } from '@ensdomains/thorin'

import { ConfirmationDialogView } from '@app/components/@molecules/ConfirmationDialogView/ConfirmationDialogView'
import { AvatarClickType } from '@app/components/@molecules/ProfileEditor/Avatar/AvatarButton'
import { AvatarViewManager } from '@app/components/@molecules/ProfileEditor/Avatar/AvatarViewManager'
import { ProfileRecord } from '@app/constants/profileRecordOptions'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { ProfileEditorForm, useProfileEditorForm } from '@app/hooks/useProfileEditorForm'

import { BackObj, RegistrationReducerDataItem, RegistrationStepData } from '../../types'
import { AddProfileRecordView } from './AddProfileRecordView'
import { CustomProfileRecordInput } from './CustomProfileRecordInput'
import { ProfileRecordInput } from './ProfileRecordInput'
import { ProfileRecordTextarea } from './ProfileRecordTextarea'
import { profileEditorFormToProfileRecords } from './profileRecordUtils'
import { WrappedAvatarButton } from './WrappedAvatarButton'

const StyledCard = styled.form(({ theme }) => [
  css`
    max-width: 780px;
    margin: 0 auto;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.02);
    border-radius: ${theme.radii['2xLarge']};
    background-color: ${theme.colors.background};
    overflow: hidden;
    padding: ${theme.space['4']};

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};

    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['6']};
      gap: ${theme.space['6']};
    }
  `,
])

const CenterAlignedTypography = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

const Divider = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    height: ${theme.space.px};
    background: ${theme.colors.border};
  `,
)

const ButtonWrapper = styled.div(({ theme }) => [
  css`
    width: ${theme.space.full};
    @media (min-width: 360px) {
      width: initial;
    }
  `,
])

const SubmitButton = ({
  control,
  disabled,
}: {
  control: Control<ProfileEditorForm>
  disabled: boolean
}) => {
  const { address } = useAccount()
  const { t } = useTranslation('register')

  const records = useWatch({
    control,
    name: 'records',
  })

  const avatar = useWatch({
    control,
    name: 'avatar',
  })

  const hasEthRecord = records.some((record) => record.key === 'eth' && record.value === address)
  const hasAvatar = !!avatar
  const hasOneRecord = records.length === 1
  const isClean = hasEthRecord && !hasAvatar && hasOneRecord

  const message = isClean
    ? t('steps.profile.actions.skipProfile')
    : t('action.next', { ns: 'common' })

  return (
    <Button type="submit" disabled={disabled} data-testid="profile-submit-button">
      {message}
    </Button>
  )
}

type ModalOption = AvatarClickType | 'add-record' | 'clear-eth' | 'public-notice'

type Props = {
  name: string
  registrationData: RegistrationReducerDataItem
  resolverExists: boolean | undefined
  callback: (data: RegistrationStepData['profile'] & BackObj) => void
}

const Profile = ({ name, callback, registrationData, resolverExists }: Props) => {
  const { t } = useTranslation('register')

  const defaultResolverAddress = useContractAddress({ contract: 'ensPublicResolver' })
  const clearRecords =
    registrationData.resolverAddress === defaultResolverAddress ? resolverExists : false
  const backRef = useRef<HTMLButtonElement>(null)

  const {
    records,
    register,
    trigger,
    control,
    handleSubmit,
    addRecords,
    removeRecordAtIndex,
    removeRecordByGroupAndKey: removeRecordByTypeAndKey,
    setAvatar,
    labelForRecord,
    secondaryLabelForRecord,
    placeholderForRecord,
    validatorForRecord,
    errorForRecordAtIndex,
    isDirtyForRecordAtIndex,
    hasErrors,
  } = useProfileEditorForm(registrationData.records)

  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false)

  const [avatarFile, setAvatarFile] = useState<File | undefined>()
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>()
  useEffect(() => {
    const storage = localStorage.getItem(`avatar-src-${name}`)
    if (storage) setAvatarSrc(storage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const setAvatarSrcStorage = () => {
    if (avatarSrc) localStorage.setItem(`avatar-src-${name}`, avatarSrc)
    else localStorage.removeItem(`avatar-src-${name}`)
  }

  const [modalOpen, setModalOpen] = useState(false)
  const [modalOption, _setModalOption] = useState<ModalOption | null>(null)
  const setModalOption = (option: ModalOption) => {
    _setModalOption(option)
    setIsAvatarDropdownOpen(false)
    setModalOpen(true)
  }

  const [hasConfirmedPublicNotice, setHasConfirmedPublicNotice] = useLocalStorage(
    'confirm-profile-is-public',
    false,
  )
  const handleShowAddRecordModal = () => {
    if (hasConfirmedPublicNotice) return setModalOption('add-record')
    setModalOption('public-notice')
  }

  const handleDeleteRecord = (record: ProfileRecord, index: number) => {
    if (record.key === 'eth') return setModalOption('clear-eth')
    removeRecordAtIndex(index)
    process.nextTick(() => trigger())
  }

  const onSubmit = (data: ProfileEditorForm, e?: BaseSyntheticEvent<object, any, any>) => {
    e?.preventDefault()
    setAvatarSrcStorage()
    const nativeEvent = e?.nativeEvent as SubmitEvent | undefined
    const newRecords = profileEditorFormToProfileRecords(data)

    callback({
      records: newRecords,
      clearRecords,
      resolverAddress: registrationData.resolverAddress,
      back: nativeEvent?.submitter === backRef.current,
    })
  }

  return (
    <>
      <Dialog
        onDismiss={() => setModalOpen(false)}
        onClose={() => setModalOpen(false)}
        variant="blank"
        open={modalOpen}
      >
        {match(modalOption)
          .with('upload', 'nft', (_modalOption) => (
            <AvatarViewManager
              name={name}
              avatarFile={avatarFile}
              handleCancel={() => setModalOpen(false)}
              type={_modalOption}
              handleSubmit={(type: 'nft' | 'upload', uri: string, display?: string) => {
                setAvatar(uri)
                setAvatarSrc(display)
                setModalOpen(false)
                trigger()
              }}
            />
          ))
          .with('add-record', () => (
            <AddProfileRecordView
              control={control}
              showDismiss
              onAdd={(newRecords) => {
                addRecords(newRecords)
                setModalOpen(false)
              }}
            />
          ))
          .with('public-notice', () => (
            <ConfirmationDialogView
              title={t('steps.profile.confirmations.publicNotice.title')}
              description={t('steps.profile.confirmations.publicNotice.description')}
              confirmLabel={t('steps.profile.confirmations.publicNotice.confirm')}
              declineLabel={t('steps.profile.confirmations.publicNotice.decline')}
              onConfirm={() => {
                setHasConfirmedPublicNotice(true)
                setModalOption('add-record')
              }}
              onDecline={() => setModalOpen(false)}
            />
          ))
          .with('clear-eth', () => (
            <ConfirmationDialogView
              title={t('steps.profile.confirmations.clearEth.title')}
              description={t('steps.profile.confirmations.clearEth.description')}
              confirmLabel={t('steps.profile.confirmations.clearEth.confirm')}
              declineLabel={t('steps.profile.confirmations.clearEth.decline')}
              onConfirm={() => {
                removeRecordByTypeAndKey('address', 'eth')
                setModalOpen(false)
              }}
              onDecline={() => setModalOpen(false)}
            />
          ))
          .otherwise(() => null)}
      </Dialog>
      <StyledCard onSubmit={handleSubmit(onSubmit)}>
        <CenterAlignedTypography fontVariant="headingTwo">
          {t('steps.profile.title')}
        </CenterAlignedTypography>
        <WrappedAvatarButton
          control={control}
          src={avatarSrc}
          isOpen={isAvatarDropdownOpen}
          onSelectOption={setModalOption}
          onAvatarChange={(avatar) => setAvatar(avatar)}
          onAvatarFileChange={(file) => setAvatarFile(file)}
          onAvatarSrcChange={(src) => setAvatarSrc(src)}
          setIsOpen={setIsAvatarDropdownOpen}
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
                disabled={field.key === 'eth' && registrationData.reverseRecord}
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
        <Divider />
        <Dialog.Footer
          leading={
            <Button
              id="profile-back-button"
              ref={backRef}
              type="submit"
              colorStyle="accentSecondary"
              disabled={hasErrors}
              data-testid="profile-back-button"
            >
              {t('action.back', { ns: 'common' })}
            </Button>
          }
          trailing={<SubmitButton control={control} disabled={hasErrors} />}
        />
      </StyledCard>
    </>
  )
}

export default Profile
