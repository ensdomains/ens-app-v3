/* eslint-disable no-nested-ternary */
import React, { BaseSyntheticEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Control, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Dialog, PlusSVG, mq } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { ConfirmationDialogView } from '@app/components/@molecules/ConfirmationDialogView/ConfirmationDialogView'
import { AvatarClickType } from '@app/components/@molecules/ProfileEditor/Avatar/AvatarButton'
import { AvatarViewManager } from '@app/components/@molecules/ProfileEditor/Avatar/AvatarViewManager'
import { ProfileRecord } from '@app/constants/profileRecordOptions'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { RegistrationForm, useRegistrationForm } from '@app/hooks/useRegistrationForm'

import { BackObj, RegistrationReducerDataItem, RegistrationStepData } from '../../types'
import { AddProfileRecordView } from './AddProfileRecordView'
import { CustomProfileRecordInput } from './CustomProfileRecordInput'
import { ProfileRecordInput } from './ProfileRecordInput'
import { ProfileRecordTextarea } from './ProfileRecordTextarea'
import { WrappedAvatarButton } from './WrappedAvatarButton'
import { registrationFormToProfileRecords } from './profileRecordUtils'

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
  `,
  mq.md.min(css`
    padding: ${theme.space['6']};
    gap: ${theme.space['6']};
  `),
])

const Heading = styled.h1(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingTwo};
    line-height: ${theme.space['10']};
    font-weight: ${theme.fontWeights.bold};
    color: ${theme.colors.black};
    text-align: center;
  `,
)

const Divider = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    height: ${theme.space.px};
    background-color: ${theme.colors.borderTertiary};
  `,
)

const ButtonWrapper = styled.div(({ theme }) => [
  css`
    width: ${theme.space.full};
  `,
  mq.md.min(css`
    width: initial;
  `),
])

const ButtonInner = styled.div(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.root};
    font-weight: ${theme.fontWeights.bold};
    line-height: ${theme.space['5']};

    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

const ButtonIcon = styled.div(
  ({ theme }) => css`
    svg {
      display: block;
      width: ${theme.space['4']};
      height: ${theme.space['4']};
      stroke-width: 2px;
    }
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

const SubmitButton = ({
  control,
  disabled,
}: {
  control: Control<RegistrationForm>
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

  const hasEthRecord = records.some((record) => record.key === 'ETH' && record.value === address)
  const hasAvatar = !!avatar
  const hasOneRecord = records.length === 1
  const isClean = hasEthRecord && !hasAvatar && hasOneRecord

  const message = isClean
    ? t('steps.profile.actions.skipProfile')
    : t('action.next', { ns: 'common' })

  return (
    <Button
      variant="primary"
      type="submit"
      disabled={disabled}
      shadowless
      data-testid="profile-submit-button"
    >
      <ButtonInner>{message}</ButtonInner>
    </Button>
  )
}

type ModalOption = AvatarClickType | 'add-record' | 'clear-eth' | 'public-notice'

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  registrationData: RegistrationReducerDataItem
  resolverExists: boolean | undefined
  callback: (data: RegistrationStepData['profile'] & BackObj) => void
}

const Profile = ({ nameDetails, callback, registrationData, resolverExists }: Props) => {
  const { t } = useTranslation('register')

  const defaultResolverAddress = useContractAddress('PublicResolver')
  const clearRecords = registrationData.resolver === defaultResolverAddress ? resolverExists : false
  const backRef = useRef<HTMLButtonElement>(null)

  const { normalisedName: name } = nameDetails

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
  } = useRegistrationForm(registrationData.records)

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
    if (record.key === 'ETH') return setModalOption('clear-eth')
    removeRecordAtIndex(index)
  }

  const onSubmit = (data: RegistrationForm, e?: BaseSyntheticEvent<object, any, any>) => {
    e?.preventDefault()
    setAvatarSrcStorage()
    const nativeEvent = e?.nativeEvent as SubmitEvent | undefined
    const newRecords = registrationFormToProfileRecords(data)

    callback({
      records: newRecords,
      clearRecords,
      permissions: registrationData.permissions,
      resolver: registrationData.resolver,
      back: nativeEvent?.submitter === backRef.current,
    })
  }

  const modalContent = useMemo(() => {
    switch (modalOption) {
      case 'upload':
      case 'nft':
        return (
          <AvatarViewManager
            name={name}
            avatarFile={avatarFile}
            handleCancel={() => setModalOpen(false)}
            type={modalOption}
            handleSubmit={(type: 'nft' | 'upload', uri: string, display?: string) => {
              if (type === 'nft') {
                setAvatar(uri)
                setAvatarSrc(display)
              } else {
                setAvatar(`${uri}?timestamp=${Date.now()}`)
                setAvatarSrc(display)
              }
              setModalOpen(false)
              trigger()
            }}
          />
        )
      case 'add-record': {
        return (
          <AddProfileRecordView
            control={control}
            onAdd={(newRecords) => {
              addRecords(newRecords)
              setModalOpen(false)
            }}
            onClose={() => setModalOpen(false)}
          />
        )
      }
      case 'public-notice': {
        return (
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
        )
      }
      case 'clear-eth': {
        return (
          <ConfirmationDialogView
            title={t('steps.profile.confirmations.clearEth.title')}
            description={t('steps.profile.confirmations.clearEth.description')}
            confirmLabel={t('steps.profile.confirmations.clearEth.confirm')}
            declineLabel={t('steps.profile.confirmations.clearEth.decline')}
            onConfirm={() => {
              removeRecordByTypeAndKey('address', 'ETH')
              setModalOpen(false)
            }}
            onDecline={() => setModalOpen(false)}
          />
        )
      }

      // no default
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, avatarFile, modalOption])

  return (
    <>
      <Dialog onDismiss={() => setModalOpen(false)} variant="blank" open={modalOpen}>
        {modalContent}
      </Dialog>
      <StyledCard onSubmit={handleSubmit(onSubmit)}>
        <Heading>{t('steps.profile.title')}</Heading>
        <WrappedAvatarButton
          control={control}
          src={avatarSrc}
          onSelectOption={setModalOption}
          onAvatarChange={(avatar) => setAvatar(avatar)}
          onAvatarFileChange={(file) => setAvatarFile(file)}
          onAvatarSrcChange={(src) => setAvatarSrc(src)}
        />
        {records.map((field, index) =>
          field.group === 'custom' ? (
            <CustomProfileRecordInput
              register={register}
              trigger={trigger}
              index={index}
              validator={validatorForRecord(field)}
              validated={isDirtyForRecordAtIndex(index)}
              error={errorForRecordAtIndex(index, 'key')}
              onDelete={() => handleDeleteRecord(field, index)}
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
              onDelete={() => handleDeleteRecord(field, index)}
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
              onDelete={() => handleDeleteRecord(field, index)}
              {...register(`records.${index}.value`, {
                validate: validatorForRecord(field),
              })}
            />
          ),
        )}
        <ButtonWrapper>
          <Button
            shadowless
            size="medium"
            onClick={handleShowAddRecordModal}
            data-testid="show-add-profile-records-modal-button"
          >
            <ButtonInner>
              <ButtonIcon>
                <PlusSVG />
              </ButtonIcon>
              {t('steps.profile.addMore')}
            </ButtonInner>
          </Button>
        </ButtonWrapper>
        <Divider />
        <ButtonContainer>
          <MobileFullWidth>
            <Button
              id="profile-back-button"
              ref={backRef}
              type="submit"
              shadowless
              variant="secondary"
              disabled={hasErrors}
              data-testid="profile-back-button"
            >
              <ButtonInner>{t('action.back', { ns: 'common' })}</ButtonInner>
            </Button>
          </MobileFullWidth>
          <MobileFullWidth>
            <SubmitButton control={control} disabled={hasErrors} />
          </MobileFullWidth>
        </ButtonContainer>
      </StyledCard>
    </>
  )
}

export default Profile
