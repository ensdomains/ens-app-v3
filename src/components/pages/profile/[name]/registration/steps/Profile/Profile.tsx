import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'
import { Button, Dialog, DownChevronSVG, Helper, Tag, Typography, mq } from '@ensdomains/thorin'

import { Banner } from '@app/components/@atoms/Banner/Banner'
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import BurnFusesContent, {
  baseFuseObj,
} from '@app/components/@molecules/BurnFuses/BurnFusesContent'
import AddRecord from '@app/components/@molecules/ProfileEditor/AddRecord'
import AvatarButton, {
  AvatarClickType,
} from '@app/components/@molecules/ProfileEditor/Avatar/AvatarButton'
import { AvatarViewManager } from '@app/components/@molecules/ProfileEditor/Avatar/AvatarViewManager'
import ProfileTabContents from '@app/components/@molecules/ProfileEditor/ProfileTabContents'
import ProfileEditorTabs from '@app/components/@molecules/ProfileEditor/ProfileTabs'
import websiteOptions from '@app/components/@molecules/ProfileEditor/options/websiteOptions'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useProfileEditor from '@app/hooks/useProfileEditor'
import { FuseObj } from '@app/types'
import { ProfileFormObject, convertProfileToProfileFormObject } from '@app/utils/editor'

import { BackObj, RegistrationReducerDataItem, RegistrationStepData } from '../../types'
import Resolver from './Resolver'

const StyledCard = styled.form(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
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

type ModalOption = AvatarClickType | 'permissions' | 'resolver'

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  registrationData: RegistrationReducerDataItem
  resolverExists: boolean | undefined
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
  const { t } = useTranslation('register')

  return (
    <AdvancedOptionItem>
      <Typography>{name}</Typography>
      <AdvancedOptionTrailing>
        {isDefault ? (
          <Tag colorStyle="greenSecondary">{t('steps.profile.default')}</Tag>
        ) : (
          <Button onClick={onResetClick} size="small" colorStyle="accentSecondary">
            {t('action.reset', { ns: 'common' })}
          </Button>
        )}
        <Button onClick={onClick} size="small">
          {t('action.edit', { ns: 'common' })}
        </Button>
      </AdvancedOptionTrailing>
    </AdvancedOptionItem>
  )
}

type ValueItem = {
  key: string
  value: any
  dirty: boolean
}

const Profile = ({ nameDetails, callback, registrationData, resolverExists }: Props) => {
  const { t } = useTranslation('register')

  const { address } = useAccount()
  const defaultResolverAddress = useContractAddress('PublicResolver')
  const backRef = useRef<HTMLButtonElement>(null)

  const { normalisedName: name } = nameDetails

  const profile = useMemo(
    () => ({
      isMigrated: true,
      createdAt: `${Date.now()}`,
      records: {
        ...registrationData.records,
        coinTypes: (registrationData.records.coinTypes || []).map((c) => ({
          coin: c.key,
          addr: c.value,
        })),
      },
    }),
    [registrationData.records],
  )

  const [fuses, setFuses] = useState(registrationData.permissions)
  const [resolver, setResolver] = useState(registrationData.resolver || defaultResolverAddress)

  const isDefaultFuses = Object.values(fuses).every((fuse) => !fuse)
  const isDefaultResolver = useMemo(
    () => resolver === defaultResolverAddress,
    [resolver, defaultResolverAddress],
  )

  const _callback = useCallback(
    (_profile: RecordOptions, event?: React.BaseSyntheticEvent) => {
      const nativeEvent = event?.nativeEvent as SubmitEvent | undefined
      callback({
        records: {
          ..._profile,
          clearRecords: resolver === defaultResolverAddress ? resolverExists : false,
        },
        resolver,
        permissions: fuses,
        back: nativeEvent?.submitter === backRef.current,
      })
    },
    [fuses, callback, resolver, defaultResolverAddress, resolverExists],
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

  const checkForDirtyTab = useCallback(
    (recordsAsTabs: ProfileFormObject) =>
      (curr: ValueItem[], [tabKey, tabValue]: [string, any]) => {
        // if the tab has no records, skip
        if (Object.keys(tabValue).length > 0 && tabKey !== 'website') {
          const subKeys = Object.entries(tabValue).map(([k, v]) => ({
            key: `${tabKey}.${k}`,
            value: v,
            dirty: !(tabKey === 'address' && k === 'ETH' && v === address),
          }))
          return [
            ...curr,
            {
              key: tabKey,
              value: tabValue,
              dirty: subKeys.some(({ dirty }) => dirty), // if any of the individual keys are dirty, then the whole tab is dirty
            },
            ...subKeys,
          ]
        }
        // if key is website, set the website option
        if (tabKey === 'website' && tabValue) {
          const protocol = recordsAsTabs.website?.match(/^[^:]+/)?.[0]?.toLowerCase()
          if (protocol) {
            const option = websiteOptions.find(({ value: _val }) => _val === protocol)
            setWebsiteOption(option || undefined)
          }
          setValue(tabKey, tabValue as string, { shouldDirty: true, shouldTouch: true })
        }
        // dont touch the tab if no sub-keys are dirty
        return curr
      },
    [address, setValue, setWebsiteOption],
  )

  useEffect(() => {
    const recordsAsTabs = convertProfileToProfileFormObject(profile as any)
    const newExistingRecords = {
      address: Object.keys(recordsAsTabs.address) || [],
      other: Object.keys(recordsAsTabs.other) || [],
      accounts: Object.keys(recordsAsTabs.accounts) || [],
    }
    setExistingRecords(newExistingRecords)

    // iterate over record tabs
    Object.entries(recordsAsTabs)
      .reduce(checkForDirtyTab(recordsAsTabs), [] as { key: string; value: any; dirty: boolean }[])
      .forEach(({ key, value, dirty }) => {
        setValue(key as any, value, {
          shouldDirty: dirty,
          shouldTouch: key.includes('.') ? true : undefined,
        })
      })
  }, [
    address,
    checkForDirtyTab,
    profile,
    setExistingRecords,
    setHasExistingWebsite,
    setValue,
    setWebsiteOption,
  ])

  const trailingButton = useMemo(() => {
    if (hasChanges || !isDefaultFuses) {
      return (
        <Button data-testid="next-button" disabled={hasErrors} type="submit">
          {t('action.next', { ns: 'common' })}
        </Button>
      )
    }
    return (
      <Button data-testid="next-button" colorStyle="accentSecondary" type="submit">
        {t('action.skip', { ns: 'common' })}
      </Button>
    )
  }, [t, hasChanges, hasErrors, isDefaultFuses])

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
      case 'upload':
      case 'nft':
        return (
          <AvatarViewManager
            name={name}
            avatar={_avatar}
            handleCancel={() => setModalOpen(false)}
            type={modalOption}
            handleSubmit={(display: string, uri?: string) => {
              if (uri) {
                setValue('avatar', uri, { shouldDirty: true, shouldTouch: true })
                setAvatarDisplay(display)
              } else {
                setValue('avatar', display, { shouldDirty: true, shouldTouch: true })
              }
              setModalOpen(false)
            }}
          />
        )
      case 'permissions': {
        return (
          <BurnFusesContent
            fuseData={{ fuseObj: fuses }}
            onDismiss={() => setModalOpen(false)}
            canUnsetFuse
            onSubmit={(newFuses) => {
              const _newFuses = newFuses as unknown as keyof FuseObj
              const newFuseObj = Object.keys(fuses).reduce((acc, key) => {
                return { ...acc, [key]: _newFuses.includes(key) }
              }, fuses)
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
        <Banner zIndex={2}>
          <AvatarWrapper>
            <AvatarButton
              validated={avatar !== undefined}
              src={avatarDisplay || avatar}
              onSelectOption={setModalOption}
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
          <Helper type="info">{t('steps.profile.visibilityMessage')}</Helper>
          <AdvancedOptions>
            <AdvancedOptionsButton
              $pressed={advancedOpen}
              onClick={(e) => {
                e.preventDefault()
                setAdvancedOpen((prev) => !prev)
              }}
            >
              <Typography>{t('steps.profile.advanced')}</Typography>
              <DownChevronSVG />
            </AdvancedOptionsButton>
            {advancedOpen && (
              <AdvancedOptionsContent>
                <AdvancedOption
                  name={t('steps.profile.permissions')}
                  isDefault={isDefaultFuses}
                  onClick={() => setModalOption('permissions')}
                  onResetClick={() => {
                    setFuses({ ...baseFuseObj })
                  }}
                />
                <AdvancedOption
                  name={t('steps.profile.resolver')}
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
              <Button ref={backRef} type="submit" colorStyle="accentSecondary">
                {t('action.back', { ns: 'common' })}
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
