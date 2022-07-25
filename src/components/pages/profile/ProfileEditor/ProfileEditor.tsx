import React, { useState, useEffect, useRef, ComponentProps } from 'react'
import styled, { css } from 'styled-components'
import { Theme } from 'typings-custom/styled-components'
import { useForm, useWatch } from 'react-hook-form'
import { mq, Modal, Input, Textarea, Button } from '@ensdomains/thorin'
import { Banner } from '@app/components/@atoms/Banner/Banner'
import { useTranslation } from 'react-i18next'
import { RecordInput } from '@app/components/@molecules/RecordInput/RecordInput'
import { useProfile } from '@app/hooks/useProfile'
import { validateCryptoAddress } from '@app/utils/validate'
import {
  convertProfileToProfileFormObject,
  formSafeKey,
  getDirtyFields,
  convertFormSafeKey,
} from '@app/utils/editor'
import useExpandableRecordsGroup from '@app/hooks/useExpandableRecordsGroup'
import { useTransaction } from '@app/utils/TransactionProvider'
import { useEns } from '@app/utils/EnsProvider'
import addressOptions from './addressOptions'
import accountsOptions from './accountsOptions'
import websiteOptions from './websiteOptions'
import otherOptions from './otherOptions'
import ScrollIndicatorContainer from '../ScrollIndicatorContainer'
import AvatarButton from './AvatarButton'
import { AddRecordButton } from '../../../@molecules/AddRecordButton/AddRecordButton'

const Container = styled.form(({ theme }) => [
  css`
    width: 100%;
    height: content-height;
    max-height: 90vh;
    background: ${theme.colors.white};
    border-radius: ${theme.space['5']};
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `,
  mq.sm.min`
    width: 95vw;
    max-width: 600px;
  `,
])

const AvatarWrapper = styled.div(
  () => css`
    position: absolute;
    left: 24px;
    bottom: 0;
    height: 90px;
    width: 90px;
    transform: translateY(50%);
  `,
)

const NameContainer = styled.div(({ theme }) => [
  css`
    display: block;
    height: 45px;
    width: 100%;
    padding-left: 134px;
    padding-right: ${theme.space['8']};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    line-height: 45px;
    vertical-align: middle;
    text-align: right;
    font-feature-settings: 'ss01' on, 'ss03' on, 'ss04' on;
    font-weight: ${theme.fontWeights.bold};
    font-size: 1.25rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `,
])

const ContentContainer = styled.div(
  ({ theme }) => css`
    flex: 1;
    display: flex;
    margin-top: ${theme.space['4.5']};
    flex-direction: column;
    gap: ${theme.space['2']};
    overflow: hidden;
    z-index: 1;
  `,
)

const TabButtonsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.space['1.25']} ${theme.space['3']};
    padding: 0 ${theme.space['6']};
  `,
)

const getIndicatorStyle = (
  theme: Theme,
  $selected?: boolean,
  $hasError?: boolean,
  $isDirty?: boolean,
) => {
  let color = ''
  if ($hasError) color = theme.colors.red
  else if ($selected && $isDirty) color = theme.colors.accent
  else if ($isDirty) color = theme.colors.green
  if (!color) return ''
  return css`
    :after {
      content: '';
      position: absolute;
      background-color: ${color};
      width: 12px;
      height: 12px;
      border: 1px solid ${theme.colors.white};
      box-sizing: border-box;
      border-radius: 50%;
      top: 0;
      right: 0;
      transform: translate(70%, 0%);
    }
  `
}

const TabButton = styled.button<{
  $selected?: boolean
  $hasError?: boolean
  $isDirty?: boolean
}>(
  ({ theme, $selected, $hasError, $isDirty }) => css`
    position: relative;
    display: block;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    background: none;
    color: ${$selected ? theme.colors.accent : theme.colors.textTertiary};
    font-size: 1.25rem;
    transition: all 0.15s ease-in-out;
    cursor: pointer;
    font-weight: ${theme.fontWeights.bold};

    &:hover {
      color: ${$selected ? theme.colors.accent : theme.colors.textSecondary};
    }

    ${getIndicatorStyle(theme, $selected, $hasError, $isDirty)}
  `,
)

const TabContentsContainer = styled.div(
  ({ theme }) => css`
    position: relative;
    padding-left: ${theme.space['3']};
    flex: 1;
    overflow: hidden;
    border-radius: ${theme.radii.large};
  `,
)

const TabContentContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['3']};
    padding-right: ${theme.space['3']};
    margin: ${theme.space['2.5']} 0;
  `,
)

const AddRecordContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['2']} ${theme.space['3']};
  `,
)

const FooterContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space['3']};
    padding: 0 ${theme.space['4']} ${theme.space['4']} ${theme.space['4']};
    width: 100%;
    max-width: ${theme.space['96']};
    margin: 0 auto;
  `,
)

export type ProfileEditorType = {
  avatar?: string
  banner?: string
  website?: string
  general: {
    [key: string]: string
  }
  accounts: {
    [key: string]: string
  }
  address: {
    [key: string]: string
  }
  other: {
    [key: string]: string
  }
}

const getFieldsByType = (
  type: 'text' | 'addr' | 'contentHash',
  data: ProfileEditorType,
) => {
  const entries = []
  if (type === 'text') {
    if (data.avatar) entries.push(['avatar', data.avatar])
    if (data.banner) entries.push(['banner', data.banner])
    if (data.general)
      entries.push(
        ...Object.entries(data.general).map(([key, value]) => [
          convertFormSafeKey(key),
          value,
        ]),
      )
    if (data.accounts)
      entries.push(
        ...Object.entries(data.accounts).map(([key, value]) => [
          convertFormSafeKey(key),
          value,
        ]),
      )
    if (data.other)
      entries.push(
        ...Object.entries(data.other).map(([key, value]) => [
          convertFormSafeKey(key),
          value,
        ]),
      )
  } else if (type === 'addr') {
    if (data.address)
      entries.push(
        ...Object.entries(data.address).map(([key, value]) => [
          convertFormSafeKey(key),
          value,
        ]),
      )
  } else if (type === 'contentHash') {
    if (data.website) entries.push(['website', data.website])
  }
  return Object.fromEntries(entries)
}

type RecordOption = ComponentProps<typeof RecordInput>['option']

type TabType = 'general' | 'accounts' | 'address' | 'website' | 'other'

type ExpandableRecordsGroup = 'accounts' | 'address' | 'other'
type ExpandableRecordsState = {
  [key in ExpandableRecordsGroup]: string[]
}

type Props = {
  name?: string
  open: boolean
  onDismiss?: () => void
}

const ProfileEditor = ({ name = '', open, onDismiss }: Props) => {
  const { t } = useTranslation('profile')
  const { setCurrentTransaction } = useTransaction()
  const { setRecords, contracts } = useEns()

  const {
    register,
    unregister,
    formState,
    reset,
    resetField,
    setValue,
    getValues,
    getFieldState,
    control,
    setFocus,
    handleSubmit,
    clearErrors,
  } = useForm<ProfileEditorType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      general: {},
      accounts: {},
      address: {},
      website: '',
      other: {},
    },
    shouldUnregister: false,
  })

  const [tab, setTab] = useState<TabType>('accounts')
  const handleTabClick = (_tab: TabType) => () => setTab(_tab)
  const hasErrors = Object.keys(formState.errors || {}).length > 0

  const [existingRecords, setExistingRecords] =
    useState<ExpandableRecordsState>({
      address: [],
      other: [],
      accounts: [],
    })

  const {
    existingKeys: existingAccountKeys,
    newKeys: newAccountKeys,
    addKey: addAccountKey,
    removeKey: removeAccountKey,
    hasOptions: hasAccountOptions,
    availableOptions: availableAccountOptions,
    getSelectedOption: getSelectedAccountOption,
  } = useExpandableRecordsGroup<ProfileEditorType>({
    group: 'accounts',
    existingKeys: existingRecords.accounts,
    options: accountsOptions,
    setValue,
    getValues,
  })

  const {
    existingKeys: existingAddressKeys,
    newKeys: newAddressKeys,
    addKey: addAddressKey,
    removeKey: removeAddressKey,
    hasOptions: hasAddressOptions,
    availableOptions: availableAddressOptions,
    getSelectedOption: getSelectedAddressOption,
  } = useExpandableRecordsGroup<ProfileEditorType>({
    group: 'address',
    existingKeys: existingRecords.address,
    options: addressOptions,
    setValue,
    getValues,
  })

  const [hasExistingWebsite, setHasExistingWebsite] = useState(false)
  const [websiteOption, setWebsiteOption] = useState<RecordOption | undefined>(
    undefined,
  )

  const {
    existingKeys: existingOtherKeys,
    newKeys: newOtherKeys,
    addKey: addOtherKey,
    removeKey: removeOtherKey,
  } = useExpandableRecordsGroup<ProfileEditorType>({
    group: 'other',
    existingKeys: existingRecords.other,
    options: otherOptions,
    setValue,
    getValues,
  })

  const AddButtonProps = (() => {
    switch (tab) {
      case 'accounts':
        if (!hasAccountOptions) return null
        return {
          autocomplete: true,
          options: availableAccountOptions,
          messages: {
            addRecord: t('profileEditor.tabs.accounts.addAccount'),
            noOptions: t('profileEditor.tabs.accounts.noOptions'),
          },
          onAddRecord: (key: string) => {
            addAccountKey(key)
            process.nextTick(() => {
              setFocus(`accounts.${key}`)
            })
          },
        }
      case 'address':
        if (!hasAddressOptions) return null
        return {
          autocomplete: true,
          options: availableAddressOptions,
          messages: {
            addRecord: t('profileEditor.tabs.address.addAddress'),
            noOptions: t('profileEditor.tabs.address.noOptions'),
          },
          onAddRecord: (key: string) => {
            addAddressKey(key)
            process.nextTick(() => {
              setFocus(`address.${key}`)
            })
          },
        }
      case 'website':
        if (websiteOption) return undefined
        return {
          options: websiteOptions,
          messages: {
            selectOption: t('profileEditor.tabs.contentHash.addContentHash'),
          },
          onAddRecord: (key: string) => {
            const option = websiteOptions.find(({ value }) => value === key)
            if (!option) return
            setWebsiteOption(option)
            process.nextTick(() => {
              setFocus('website')
            })
          },
        }
      case 'other':
        return {
          createable: true,
          messages: {
            addRecord: t('profileEditor.tabs.other.addRecord'),
            createRecord: t('profileEditor.tabs.other.createRecord'),
          },
          onAddRecord: (record: string) => {
            addOtherKey(record)
            process.nextTick(() => {
              setFocus(`other.${record}`)
            })
          },
        }
      default:
        return null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })()

  const { profile, loading } = useProfile(name, name !== '')

  useEffect(() => {
    if (profile && open) {
      const newDefaultValues = convertProfileToProfileFormObject(profile)
      const newExistingRecords: ExpandableRecordsState = {
        address: Object.keys(newDefaultValues.address) || [],
        other: Object.keys(newDefaultValues.other) || [],
        accounts: Object.keys(newDefaultValues.accounts) || [],
      }
      reset(newDefaultValues)
      setExistingRecords(newExistingRecords)

      setHasExistingWebsite(!!newDefaultValues.website)
      const protocol = newDefaultValues.website
        ?.match(/^[^:]+/)?.[0]
        ?.toLowerCase()
      if (protocol) {
        const option = websiteOptions.find(({ value }) => value === protocol)
        setWebsiteOption(option || undefined)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, open])

  const handleCancel = () => {
    if (onDismiss) onDismiss()
  }

  const handleTransaction = async (profileData: ProfileEditorType) => {
    const dirtyFields = getDirtyFields(
      formState.dirtyFields,
      profileData,
    ) as ProfileEditorType

    const texts = Object.entries(getFieldsByType('text', dirtyFields)).map(
      ([key, value]) => ({
        key,
        value,
      }),
    ) as { key: string; value: string }[]

    const coinTypes = Object.entries(getFieldsByType('addr', dirtyFields)).map(
      ([key, value]) => ({
        key,
        value,
      }),
    ) as { key: string; value: string }[]

    const contentHash = dirtyFields.website

    const records = {
      texts,
      coinTypes,
      contentHash,
    }

    const resolverAddress = (await contracts!.getPublicResolver()!).address

    setCurrentTransaction(name, async (signer) => ({
      data: [
        {
          actionName: 'setRecords',
          displayItems: [
            {
              label: 'name',
              value: name,
              type: 'name',
            },
          ],
          transaction: await setRecords.populateTransaction(name, {
            records,
            signer,
            resolverAddress,
          }),
        },
      ],
    }))
  }

  const avatar = useWatch({
    control,
    name: 'avatar',
  })

  const hasChanges = Object.keys(formState.dirtyFields || {}).length > 0

  const ref = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLFormElement>(null)
  if (loading) return null
  return (
    <>
      <Modal open={open} onDismiss={onDismiss}>
        <Container
          data-testid="profile-editor"
          onSubmit={handleSubmit(handleTransaction)}
          ref={targetRef}
        >
          <Banner zIndex={10}>
            <AvatarWrapper>
              <AvatarButton src={avatar} />
            </AvatarWrapper>
          </Banner>
          <NameContainer>{name}</NameContainer>
          <ContentContainer>
            <TabButtonsContainer>
              <TabButton
                type="button"
                $selected={tab === 'general'}
                $hasError={!!getFieldState('general', formState).error}
                $isDirty={getFieldState('general').isDirty}
                onClick={handleTabClick('general')}
              >
                {t('profileEditor.tabs.general.label')}
              </TabButton>
              <TabButton
                type="button"
                $selected={tab === 'accounts'}
                $hasError={!!getFieldState('accounts', formState).error}
                $isDirty={getFieldState('accounts').isDirty}
                onClick={handleTabClick('accounts')}
                data-testid="accounts-tab"
              >
                {t('profileEditor.tabs.accounts.label')}
              </TabButton>
              <TabButton
                type="button"
                $selected={tab === 'address'}
                $hasError={!!getFieldState('address', formState).error}
                $isDirty={getFieldState('address').isDirty}
                onClick={handleTabClick('address')}
                data-testid="address-tab"
              >
                {t('profileEditor.tabs.address.label')}
              </TabButton>
              <TabButton
                type="button"
                $selected={tab === 'website'}
                $hasError={!!getFieldState('website', formState).error}
                $isDirty={getFieldState('website').isDirty}
                onClick={handleTabClick('website')}
              >
                {t('profileEditor.tabs.contentHash.label')}
              </TabButton>
              <TabButton
                type="button"
                $selected={tab === 'other'}
                $hasError={!!getFieldState('other', formState).error}
                $isDirty={getFieldState('other').isDirty}
                onClick={handleTabClick('other')}
                data-testid="other-tab"
              >
                {t('profileEditor.tabs.other.label')}
              </TabButton>
            </TabButtonsContainer>
            <TabContentsContainer>
              <ScrollIndicatorContainer ref={ref} page={tab}>
                <TabContentContainer data-testid="tab-container">
                  {
                    {
                      general: (
                        <>
                          <Input
                            label={t('profileEditor.tabs.general.name.label')}
                            placeholder={t(
                              'profileEditor.tabs.general.name.placeholder',
                            )}
                            showDot
                            validated={
                              getFieldState('general.name', formState).isDirty
                            }
                            autoComplete="off"
                            {...register('general.name')}
                          />
                          <Input
                            label={t('profileEditor.tabs.general.url.label')}
                            autoComplete="off"
                            placeholder={t(
                              'profileEditor.tabs.general.url.placeholder',
                            )}
                            showDot
                            validated={
                              getFieldState('general.url', formState).isDirty
                            }
                            {...register('general.url')}
                          />
                          <Input
                            label={t(
                              'profileEditor.tabs.general.location.label',
                            )}
                            autoComplete="off"
                            placeholder={t(
                              'profileEditor.tabs.general.location.placeholder',
                            )}
                            showDot
                            validated={
                              getFieldState('general.location', formState)
                                .isDirty
                            }
                            {...register('general.location')}
                          />
                          <Textarea
                            label={t(
                              'profileEditor.tabs.general.description.label',
                            )}
                            autoComplete="off"
                            placeholder={t(
                              'profileEditor.tabs.general.description.placeholder',
                            )}
                            showDot
                            validated={
                              getFieldState('general.description', formState)
                                .isDirty
                            }
                            {...register('general.description')}
                          />
                        </>
                      ),
                      accounts: (
                        <>
                          {existingAccountKeys.map((account) => (
                            <RecordInput
                              key={account}
                              option={getSelectedAccountOption(account)}
                              placeholder={t([
                                `profileEditor.tabs.accounts.placeholder.${convertFormSafeKey(
                                  account,
                                )}`,
                                `profileEditor.tabs.accounts.placeholder.default`,
                              ])}
                              showDot
                              error={
                                getFieldState(`accounts.${account}`, formState)
                                  .error?.message
                              }
                              validated={
                                getFieldState(`accounts.${account}`, formState)
                                  .isDirty
                              }
                              onDelete={() => {
                                removeAccountKey(account, false)
                              }}
                              {...register(`accounts.${account}` as any, {})}
                            />
                          ))}
                          {newAccountKeys.map((key) => (
                            <RecordInput
                              key={key}
                              option={getSelectedAccountOption(key)}
                              placeholder={t([
                                `profileEditor.tabs.accounts.placeholder.${convertFormSafeKey(
                                  key,
                                )}`,
                                `profileEditor.tabs.accounts.placeholder.default`,
                              ])}
                              error={
                                getFieldState(`accounts.${key}`, formState)
                                  .error?.message
                              }
                              validated={
                                getFieldState(
                                  `accounts.${formSafeKey(key)}`,
                                  formState,
                                ).isDirty
                              }
                              showDot
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck={false}
                              onDelete={() => {
                                removeAccountKey(key)
                                resetField(`accounts.${key}`, {
                                  keepDirty: false,
                                  keepError: false,
                                  keepTouched: false,
                                })
                              }}
                              {...register(`accounts.${key}`, {})}
                            />
                          ))}
                        </>
                      ),
                      address: (
                        <>
                          {existingAddressKeys.map((key) => (
                            <RecordInput
                              key={key}
                              option={getSelectedAddressOption(key)}
                              placeholder={t([
                                `profileEditor.tabs.address.placeholder.${convertFormSafeKey(
                                  key,
                                )}`,
                                `profileEditor.tabs.address.placeholder.default`,
                              ])}
                              showDot
                              error={
                                getFieldState(`address.${key}`, formState).error
                                  ?.message
                              }
                              validated={
                                getFieldState(`address.${key}`, formState)
                                  .isDirty
                              }
                              onDelete={() => {
                                removeAddressKey(key, false)
                                clearErrors([`address.${key}`])
                              }}
                              {...register(`address.${key}`, {
                                validate: validateCryptoAddress(key),
                              })}
                            />
                          ))}
                          {newAddressKeys.map((key) => (
                            <RecordInput
                              key={key}
                              option={getSelectedAddressOption(key)}
                              placeholder={t([
                                `profileEditor.tabs.address.placeholder.${convertFormSafeKey(
                                  key,
                                )}`,
                                `profileEditor.tabs.address.placeholder.default`,
                              ])}
                              error={
                                getFieldState(`address.${key}`, formState).error
                                  ?.message
                              }
                              validated={
                                getFieldState(`address.${key}`, formState)
                                  .isDirty
                              }
                              showDot
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck={false}
                              onDelete={() => {
                                removeAddressKey(key)
                                resetField(`address.${key}`, {
                                  keepDirty: false,
                                  keepError: false,
                                  keepTouched: false,
                                })
                                unregister(`address.${key}`)
                              }}
                              {...register(`address.${key}`, {
                                validate: validateCryptoAddress(key),
                              })}
                            />
                          ))}
                        </>
                      ),
                      website: websiteOption && (
                        <RecordInput
                          option={websiteOption}
                          placeholder={t([
                            `profileEditor.tabs.contentHash.placeholder.${convertFormSafeKey(
                              websiteOption.value,
                            )}`,
                            `profileEditor.tabs.contentHash.placeholder.default`,
                          ])}
                          error={
                            getFieldState(`website`, formState).error?.message
                          }
                          validated={
                            getFieldState(`website`, formState).isDirty
                          }
                          onDelete={() => {
                            if (hasExistingWebsite) {
                              setValue('website', '', { shouldDirty: true })
                            } else {
                              setValue('website', undefined)
                              resetField('website', {
                                keepDirty: false,
                                keepError: false,
                                keepTouched: false,
                              })
                            }

                            setWebsiteOption(undefined)
                          }}
                          {...register('website', {})}
                        />
                      ),
                      other: (
                        <>
                          {existingOtherKeys.map((key) => (
                            <RecordInput
                              key={key}
                              label={key}
                              placeholder={t([
                                `profileEditor.tabs.other.placeholder.${convertFormSafeKey(
                                  key,
                                )}`,

                                `profileEditor.tabs.other.placeholder.default`,
                              ])}
                              error={
                                getFieldState(`other.${key}`, formState).error
                                  ?.message
                              }
                              validated={
                                getFieldState(`other.${key}`, formState).isDirty
                              }
                              onDelete={() => removeOtherKey(key, false)}
                              {...register(`other.${key}`, {})}
                            />
                          ))}
                          {newOtherKeys.map((key) => (
                            <RecordInput
                              key={key}
                              placeholder={t([
                                `profileEditor.tabs.other.placeholder.${convertFormSafeKey(
                                  key,
                                )}`,
                                `profileEditor.tabs.other.placeholder.default`,
                              ])}
                              error={
                                getFieldState(`other.${key}`, formState).error
                                  ?.message
                              }
                              validated={
                                getFieldState(`other.${key}`, formState).isDirty
                              }
                              label={key}
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck={false}
                              onDelete={() => {
                                removeOtherKey(key)
                                resetField(`other.${key}`, {
                                  keepDirty: false,
                                  keepError: false,
                                  keepTouched: false,
                                })
                              }}
                              {...register(`other.${key}`, {})}
                            />
                          ))}
                        </>
                      ),
                    }[tab]
                  }
                </TabContentContainer>
              </ScrollIndicatorContainer>
            </TabContentsContainer>
            {AddButtonProps && (
              <AddRecordContainer>
                <AddRecordButton {...AddButtonProps} />
              </AddRecordContainer>
            )}
            <FooterContainer>
              <Button tone="grey" shadowless onClick={handleCancel}>
                {t('action.cancel', { ns: 'common' })}
              </Button>
              <Button
                disabled={hasErrors || !hasChanges}
                type="submit"
                shadowless
                data-testid="profile-editor-submit"
              >
                {t('action.save', { ns: 'common' })}
              </Button>
            </FooterContainer>
          </ContentContainer>
        </Container>
      </Modal>
    </>
  )
}

export default ProfileEditor
