import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'
import { Button, Dialog, DownIndicatorSVG, Helper, Tag, Typography, mq } from '@ensdomains/thorin'

import { Banner } from '@app/components/@atoms/Banner/Banner'
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import BurnFusesContent from '@app/components/@molecules/BurnFuses/BurnFusesContent'
import AddRecord from '@app/components/@molecules/ProfileEditor/AddRecord'
import { AvatarViewManager } from '@app/components/@molecules/ProfileEditor/Avatar/AvatarViewManager'
import AvatarButton from '@app/components/@molecules/ProfileEditor/AvatarButton'
import ProfileTabContents from '@app/components/@molecules/ProfileEditor/ProfileTabContents'
import ProfileEditorTabs from '@app/components/@molecules/ProfileEditor/ProfileTabs'
import websiteOptions from '@app/components/@molecules/ProfileEditor/options/websiteOptions'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useProfileEditor from '@app/hooks/useProfileEditor'
import { FuseObj } from '@app/types'
import { convertProfileToProfileFormObject } from '@app/utils/editor'

import { BackObj, RegistrationReducerDataItem, RegistrationStepData } from '../../types'
import Resolver from './Resolver'

const StyledCard = styled.form(
  ({ theme }) => css`
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.02);
    border-radius: ${theme.radii['2xLarge']};
    background-color: ${theme.colors.background};
    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
)

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    position: absolute;
    bottom: 0;
    height: ${theme.space['24']};
    width: ${theme.space.full};
    transform: translate(calc(50% - ${theme.space['12']}), 50%);
    & > div {
      height: ${theme.space['24']};
      width: ${theme.space['24']};
    }
  `,
)

const ContentContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};
    margin-top: ${theme.space['18']};
    padding: ${theme.space['4']};
    padding-top: 0;
    overflow-y: visible;
    position: static;

    & > div:first-of-type {
      align-items: center;
      justify-content: flex-start;
      padding: 0;
      padding-bottom: ${theme.space['2']};
      border-bottom: 1px solid ${theme.colors.grey};
    }

    ${mq.md.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      & > div:first-of-type {
        justify-content: center;
        margin: 0 6px;
      }
    `)}
  `,
)

const AdvancedOptions = styled.div(
  ({ theme }) => css`
    --border-style: 1px solid ${theme.colors.grey};
    display: flex;
    flex-direction: column;
    border: var(--border-style);
    border-radius: ${theme.radii.large};
    overflow: hidden;
  `,
)

const AdvancedOptionsContent = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    padding: 0 ${theme.space['4']};
  `,
)

const AdvancedOptionItem = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.space['4']} 0;
    &:not(:last-of-type) {
      border-bottom: var(--border-style);
    }
  `,
)

const AdvancedOptionTrailing = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.space['2']};
  `,
)

const AdvancedOptionsButton = styled.button<{ $pressed: boolean }>(
  ({ theme, $pressed }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    border-bottom: var(--border-style);
    padding: ${theme.space['4']};
    margin-bottom: -${theme.space.px};

    cursor: pointer;

    svg {
      width: ${theme.space['3']};
      ${$pressed &&
      css`
        transform: rotate(180deg);
      `}
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

type ModalOption = 'avatar' | 'permissions' | 'resolver'

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  registrationData: RegistrationReducerDataItem
  callback: (data: RegistrationStepData['profile'] & BackObj) => void
}

const AdvancedOption = ({
  name,
  isDefault,
  onResetClick,
  onClick,
}: {
  name: string
  isDefault: boolean
  onResetClick: () => void
  onClick: () => void
}) => {
  return (
    <AdvancedOptionItem>
      <Typography>{name}</Typography>
      <AdvancedOptionTrailing>
        {isDefault ? (
          <Tag tone="green">Default</Tag>
        ) : (
          <Button onClick={onResetClick} size="small" shadowless variant="secondary">
            Reset
          </Button>
        )}
        <Button onClick={onClick} size="small" shadowless>
          Edit
        </Button>
      </AdvancedOptionTrailing>
    </AdvancedOptionItem>
  )
}

const defaultFuses: Partial<FuseObj> = {
  CANNOT_BURN_FUSES: false,
  CANNOT_UNWRAP: false,
  CANNOT_CREATE_SUBDOMAIN: false,
  CANNOT_SET_RESOLVER: false,
  CANNOT_SET_TTL: false,
  CANNOT_TRANSFER: false,
  CAN_DO_EVERYTHING: true,
}

const Profile = ({ nameDetails, callback, registrationData }: Props) => {
  const { address } = useAccount()
  const defaultResolverAddress = useContractAddress('PublicResolver')
  const backRef = useRef<HTMLButtonElement>(null)

  const { normalisedName: name } = nameDetails

  const profile = useMemo(
    () => ({
      isMigrated: true,
      createdAt: `${Date.now()}`,
      records:
        Object.keys(registrationData.records).length > 0
          ? {
              ...registrationData.records,
              coinTypes: (registrationData.records.coinTypes || []).map((c) => ({
                coin: c.key,
                addr: c.value,
              })),
            }
          : {
              coinTypes: [{ coin: 'ETH', addr: address! } as any],
            },
    }),
    [address, registrationData.records],
  )

  const [fuses, setFuses] = useState(registrationData.permissions)
  const [resolver, setResolver] = useState(registrationData.resolver || defaultResolverAddress)

  const isDefaultFuses = useMemo(() => !!fuses.CAN_DO_EVERYTHING, [fuses.CAN_DO_EVERYTHING])
  const isDefaultResolver = useMemo(
    () => resolver === defaultResolverAddress,
    [resolver, defaultResolverAddress],
  )

  const _callback = useCallback(
    (_profile: RecordOptions, event?: React.BaseSyntheticEvent) => {
      const nativeEvent = event?.nativeEvent as SubmitEvent | undefined
      const { CAN_DO_EVERYTHING: _, ...newFuses } = fuses
      callback({
        records: _profile,
        resolver,
        permissions: newFuses,
        back: nativeEvent?.submitter === backRef.current,
      })
    },
    [callback, fuses, resolver],
  )

  const profileEditorForm = useProfileEditor({
    callback: _callback,
    profile: undefined,
    returnAllFields: true,
  })
  const {
    avatar,
    setValue,
    _avatar,
    hasErrors,
    hasChanges,
    handleSubmit,
    setExistingRecords,
    newAccountKeys,
    newAddressKeys,
    newOtherKeys,
    existingAccountKeys,
    existingAddressKeys,
    existingOtherKeys,
    setHasExistingWebsite,
    setWebsiteOption,
  } = profileEditorForm

  const accountKeys = [...existingAccountKeys, ...newAccountKeys]
  const addressKeys = [...existingAddressKeys, ...newAddressKeys]
  const otherKeys = [...existingOtherKeys, ...newOtherKeys]

  useEffect(() => {
    const recordsAsReset = convertProfileToProfileFormObject(profile as any)
    const newExistingRecords = {
      address: Object.keys(recordsAsReset.address) || [],
      other: Object.keys(recordsAsReset.other) || [],
      accounts: Object.keys(recordsAsReset.accounts) || [],
    }
    setExistingRecords(newExistingRecords)
    let valueKeys: [string, any, boolean][] = []
    for (const [key, value] of Object.entries(recordsAsReset)) {
      const valueKeysInner: [string, string, boolean][] = []
      if (Object.keys(value).length > 0 && key !== 'website') {
        for (const [k, v] of Object.entries(value)) {
          valueKeysInner.push([
            `${key}.${k}`,
            v,
            !(key === 'address' && k === 'ETH' && v === address),
          ])
        }
        valueKeys = [
          ...valueKeys,
          [key, value, valueKeysInner.some(([, , dirty]) => dirty)],
          ...valueKeysInner,
        ]
      } else if (key === 'website' && value) {
        const protocol = recordsAsReset.website?.match(/^[^:]+/)?.[0]?.toLowerCase()
        if (protocol) {
          const option = websiteOptions.find(({ value: _val }) => _val === protocol)
          setWebsiteOption(option || undefined)
        }
        setValue(key, value as string, { shouldDirty: true, shouldTouch: true })
      }
    }
    valueKeys.forEach(([key, value, dirty]) =>
      setValue(key as any, value, {
        shouldDirty: dirty,
        shouldTouch: key.includes('.') ? true : undefined,
      }),
    )
  }, [address, profile, setExistingRecords, setHasExistingWebsite, setValue, setWebsiteOption])

  const trailingButton = useMemo(() => {
    if (hasChanges) {
      return (
        <Button shadowless disabled={hasErrors} type="submit">
          Next
        </Button>
      )
    }
    return (
      <Button shadowless variant="secondary" type="submit">
        Skip
      </Button>
    )
  }, [hasChanges, hasErrors])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalOption, _setModalOption] = useState<ModalOption | null>(null)
  const setModalOption = (option: ModalOption) => {
    _setModalOption(option)
    setModalOpen(true)
  }

  const [avatarDisplay, setAvatarDisplay] = useState<string | null>(null)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const modalContent = useMemo(() => {
    switch (modalOption) {
      case 'avatar': {
        return (
          <AvatarViewManager
            name={name}
            avatar={_avatar}
            handleCancel={() => setModalOpen(false)}
            handleSubmit={(display: string, uri?: string) => {
              if (uri) {
                setValue('avatar', uri)
                setAvatarDisplay(display)
              } else {
                setValue('avatar', display)
              }
              setModalOpen(false)
            }}
          />
        )
      }
      case 'permissions': {
        return (
          <BurnFusesContent
            fuseData={{ fuseObj: fuses }}
            onDismiss={() => setModalOpen(false)}
            canUnsetFuse
            onSubmit={(newFuses) => {
              const _newFuses = newFuses as unknown as keyof FuseObj
              const currFuses = { ...fuses, CAN_DO_EVERYTHING: false }
              const newFuseObj = Object.keys(currFuses)
                .filter((x) => x !== 'CAN_DO_EVERYTHING')
                .reduce((acc, key) => {
                  acc[key as keyof FuseObj] = _newFuses.includes(key)
                  return acc
                }, currFuses)
              newFuseObj.CAN_DO_EVERYTHING = Object.values(newFuseObj).every((fuse) => !fuse)
              setFuses(newFuseObj)
              setModalOpen(false)
            }}
          />
        )
      }
      case 'resolver': {
        return (
          <Resolver
            resolverAddress={resolver}
            onDismiss={() => setModalOpen(false)}
            onSubmit={(newResolver) => {
              setResolver(newResolver)
              setModalOpen(false)
            }}
          />
        )
      }
      // no default
    }
  }, [_avatar, fuses, modalOption, name, resolver, setValue])

  return (
    <>
      <Dialog onDismiss={() => setModalOpen(false)} variant="blank" open={modalOpen}>
        {modalContent}
      </Dialog>
      <StyledCard onSubmit={handleSubmit}>
        <Banner>
          <AvatarWrapper>
            <AvatarButton
              validated={avatar !== undefined}
              src={avatarDisplay || avatar}
              onSelectOption={() => setModalOption('avatar')}
              setValue={setValue}
              setDisplay={setAvatarDisplay}
            />
          </AvatarWrapper>
        </Banner>
        <ContentContainer>
          <ProfileEditorTabs {...profileEditorForm} />
          <ProfileTabContents
            removePadding
            {...{
              ...profileEditorForm,
              existingAccountKeys: [],
              existingAddressKeys: [],
              existingOtherKeys: [],
              newAccountKeys: accountKeys,
              newAddressKeys: addressKeys,
              newOtherKeys: otherKeys,
            }}
          />
          <AddRecord {...profileEditorForm} />
          <Helper type="info">
            Your profile information will be stored on the blockchain. Anything you add will be
            publicly visible.
          </Helper>
          <AdvancedOptions>
            <AdvancedOptionsButton
              $pressed={advancedOpen}
              onClick={(e) => {
                e.preventDefault()
                setAdvancedOpen((prev) => !prev)
              }}
            >
              <Typography>Advanced</Typography>
              <DownIndicatorSVG />
            </AdvancedOptionsButton>
            {advancedOpen && (
              <AdvancedOptionsContent>
                <AdvancedOption
                  name="Permissions"
                  isDefault={isDefaultFuses}
                  onClick={() => setModalOption('permissions')}
                  onResetClick={() => {
                    setFuses(defaultFuses)
                  }}
                />
                <AdvancedOption
                  name="Resolver"
                  isDefault={isDefaultResolver}
                  onClick={() => setModalOption('resolver')}
                  onResetClick={() => {
                    setResolver(defaultResolverAddress)
                  }}
                />
              </AdvancedOptionsContent>
            )}
          </AdvancedOptions>
          <ButtonContainer>
            <MobileFullWidth>
              <Button ref={backRef} type="submit" shadowless variant="secondary">
                Back
              </Button>
            </MobileFullWidth>
            <MobileFullWidth>{trailingButton}</MobileFullWidth>
          </ButtonContainer>
        </ContentContainer>
      </StyledCard>
    </>
  )
}

export default Profile
