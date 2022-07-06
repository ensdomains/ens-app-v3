import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { Theme } from 'typings-custom/styled-components'
import { useForm, useWatch } from 'react-hook-form'
import {
  mq,
  Modal,
  Input,
  Textarea,
  Button,
  PlusSVG,
  Avatar,
} from '@ensdomains/thorin'
import { Banner } from '@app/components/@atoms/Banner/Banner'
import { SelectableInput } from '../../../@molecules/SelectableInput/SelectableInput'
import { useProfile } from '../../../../hooks/useProfile'
import addressOptions from './addressOptions'
import accountsOptions from './accountsOptions'
import otherOptions from './otherOptions'
import ScrollIndicatorContainer from './ScrollIndicatorContainer'
import { convertProfileToFormObject, formSafeKey, ProfileType } from './utils'
import useExpandableRecordsGroup from './useExpandableRecordsGroup'
import { validateCryptoAddress } from '../../../../utils/validate'

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
    padding-right: 16px;
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
  mq.sm.min(css`
    font-size: 1.5rem;
    text-align: left;
  `),
])

const ContentContainer = styled.div(
  ({ theme }) => css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
    overflow: hidden;
  `,
)

const TabButtonsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.space['1.25']} ${theme.space['3']};
    padding: 0 ${theme.space['3']};
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
  `,
)

const FooterContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space['3']};
    padding: 0 ${theme.space['3']} ${theme.space['3']} ${theme.space['3']};
  `,
)

type TabType = 'general' | 'accounts' | 'address' | 'website' | 'other'

type ExpandableRecordsGroup = 'accounts' | 'address' | 'other'
type ExpandableRecordsState = {
  [key in ExpandableRecordsGroup]: string[]
}

type Props = {
  open: boolean
  onDismiss?: () => void
}

const ProfileEditor = ({ open, onDismiss }: Props) => {
  const {
    register,
    formState,
    reset,
    setValue,
    getValues,
    getFieldState,
    control,
    handleSubmit,
  } = useForm<ProfileType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      general: {},
      accounts: {},
      address: {},
      website: '',
      other: {},
    },
  })

  const [tab, setTab] = useState<TabType>('address')
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
    changeKey: changeAccountKey,
    hasOptions: hasAccountOptions,
    getOptions: getAccountOptions,
  } = useExpandableRecordsGroup<ProfileType>({
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
    changeKey: changeAddressKey,
    hasOptions: hasAddressOptions,
    getOptions: getAddressOptions,
  } = useExpandableRecordsGroup<ProfileType>({
    group: 'address',
    existingKeys: existingRecords.address,
    options: addressOptions,
    setValue,
    getValues,
  })

  const {
    existingKeys: existingOtherKeys,
    newKeys: newOtherKeys,
    addKey: addOtherKey,
    removeKey: removeOtherKey,
    changeKey: changeOtherKey,
    getOptions: getOtherOptions,
  } = useExpandableRecordsGroup<ProfileType>({
    group: 'other',
    existingKeys: existingRecords.other,
    options: otherOptions,
    setValue,
    getValues,
  })

  const { profile } = useProfile('jefflau.eth', false)
  useEffect(() => {
    if (profile) {
      const defaultValues = convertProfileToFormObject(profile)
      reset(defaultValues)
      const newExistingRecords: ExpandableRecordsState = {
        address: Object.keys(defaultValues.address) || [],
        other: Object.keys(defaultValues.other) || [],
        accounts: Object.keys(defaultValues.accounts) || [],
      }
      setExistingRecords(newExistingRecords)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  console.log(getFieldState(`address.ETH`, formState).error)

  console.log('rerender')

  const avatar = useWatch({
    control,
    name: 'avatar',
  })
  console.log('watch', avatar)

  return (
    <>
      <Modal open={open} onDismiss={onDismiss}>
        <Container onSubmit={handleSubmit((data: any) => console.log(data))}>
          <Banner>
            <AvatarWrapper>
              <Avatar src={avatar} label="profile-editor-avatar" />
            </AvatarWrapper>
          </Banner>
          <NameContainer>yoginth.eth</NameContainer>
          <ContentContainer>
            <TabButtonsContainer>
              <TabButton
                $selected={tab === 'general'}
                $hasError={!!getFieldState('general', formState).error}
                $isDirty={getFieldState('general').isDirty}
                onClick={handleTabClick('general')}
              >
                General
              </TabButton>
              <TabButton
                $selected={tab === 'accounts'}
                $hasError={!!getFieldState('accounts', formState).error}
                $isDirty={getFieldState('accounts').isDirty}
                onClick={handleTabClick('accounts')}
              >
                Accounts
              </TabButton>
              <TabButton
                $selected={tab === 'address'}
                $hasError={!!getFieldState('address', formState).error}
                $isDirty={getFieldState('address').isDirty}
                onClick={handleTabClick('address')}
              >
                Address
              </TabButton>
              <TabButton
                $selected={tab === 'website'}
                $hasError={!!getFieldState('website', formState).error}
                $isDirty={getFieldState('website').isDirty}
                onClick={handleTabClick('website')}
              >
                Website
              </TabButton>
              <TabButton
                $selected={tab === 'other'}
                $hasError={!!getFieldState('other', formState).error}
                $isDirty={getFieldState('other').isDirty}
                onClick={handleTabClick('other')}
              >
                Other
              </TabButton>
            </TabButtonsContainer>
            <TabContentsContainer>
              <ScrollIndicatorContainer>
                <TabContentContainer>
                  {
                    {
                      general: (
                        <>
                          <Input
                            label="Nickname"
                            {...register('general.name')}
                          />
                          <Input label="Website" {...register('general.url')} />
                          <Input
                            label="Location"
                            {...register('general.location')}
                          />
                          <Textarea
                            label="Short Bio"
                            {...register('general.description')}
                          />
                        </>
                      ),
                      accounts: (
                        <>
                          {existingAccountKeys.map((account) => (
                            <SelectableInput
                              key={account}
                              selectProps={{
                                value: formSafeKey(account),
                                options: accountsOptions,
                              }}
                              label={account}
                              readOnly
                              {...register(
                                `accounts.${formSafeKey(account)}` as any,
                                {},
                              )}
                              onDelete={() => removeAccountKey(account)}
                            />
                          ))}{' '}
                          {newAccountKeys.map((key) => (
                            <SelectableInput
                              key={key}
                              selectProps={{
                                value: formSafeKey(key),
                                options: getAccountOptions(key),
                                onChange: (e) =>
                                  changeAccountKey(key, e.target.value),
                              }}
                              error={
                                getFieldState(
                                  `accounts.${formSafeKey(key)}`,
                                  formState,
                                ).error?.message
                              }
                              hasChanges={
                                getFieldState(
                                  `accounts.${formSafeKey(key)}`,
                                  formState,
                                ).isDirty
                              }
                              label={key}
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck={false}
                              onDelete={() =>
                                removeAccountKey(formSafeKey(key))
                              }
                              {...register(`accounts.${formSafeKey(key)}`, {})}
                            />
                          ))}
                          {hasAccountOptions && (
                            <Button
                              outlined
                              prefix={<PlusSVG />}
                              variant="transparent"
                              shadowless
                              onClick={() => addAccountKey()}
                            >
                              Add Account
                            </Button>
                          )}
                        </>
                      ),
                      address: (
                        <>
                          {existingAddressKeys.map((key) => (
                            <SelectableInput
                              key={key}
                              selectProps={{
                                value: key,
                                options: addressOptions,
                              }}
                              label={key}
                              readOnly
                              {...register(`address.${key}`, {})}
                              onDelete={() => removeAddressKey(key)}
                            />
                          ))}
                          {newAddressKeys.map((key) => (
                            <SelectableInput
                              key={key}
                              selectProps={{
                                value: key,
                                autocomplete: true,
                                options: getAddressOptions(key),
                                onChange: (e) =>
                                  changeAddressKey(key, e.target.value),
                              }}
                              error={
                                getFieldState(`address.${key}`, formState).error
                                  ?.message
                              }
                              hasChanges={
                                getFieldState(`address.${key}`, formState)
                                  .isDirty
                              }
                              label={key}
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck={false}
                              onDelete={() => removeAddressKey(key)}
                              {...register(`address.${key}`, {
                                validate: validateCryptoAddress(key),
                              })}
                            />
                          ))}
                          {hasAddressOptions && (
                            <Button
                              outlined
                              prefix={<PlusSVG />}
                              variant="transparent"
                              shadowless
                              onClick={() => addAddressKey()}
                            >
                              Add Address
                            </Button>
                          )}
                        </>
                      ),
                      website: <>website</>,
                      other: (
                        <>
                          {existingOtherKeys.map((key) => (
                            <SelectableInput
                              key={key}
                              selectProps={{
                                value: formSafeKey(key),
                                options: otherOptions,
                              }}
                              label={key}
                              readOnly
                              {...register(`other.${formSafeKey(key)}`, {})}
                              onDelete={() => removeOtherKey(key)}
                            />
                          ))}
                          {newOtherKeys.map((key) => (
                            <SelectableInput
                              key={key}
                              selectProps={{
                                value: formSafeKey(key),
                                options: getOtherOptions(key),
                                createable: true,
                                onChange: (e) =>
                                  changeOtherKey(key, e.target.value),
                                onCreate: (value) => changeOtherKey(key, value),
                              }}
                              error={
                                getFieldState(`other.${key}`, formState).error
                                  ?.message
                              }
                              hasChanges={
                                getFieldState(`other.${key}`, formState).isDirty
                              }
                              label={key}
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck={false}
                              onDelete={() => removeOtherKey(key)}
                              {...register(`other.${formSafeKey(key)}`, {})}
                            />
                          ))}
                          <Button
                            outlined
                            prefix={<PlusSVG />}
                            variant="transparent"
                            shadowless
                            onClick={() => addOtherKey()}
                          >
                            Add Record
                          </Button>
                        </>
                      ),
                    }[tab]
                  }
                </TabContentContainer>
              </ScrollIndicatorContainer>
            </TabContentsContainer>
            <FooterContainer>
              <Button tone="grey" shadowless>
                Cancel
              </Button>
              <Button disabled={hasErrors} type="submit" shadowless>
                Save
              </Button>
            </FooterContainer>
          </ContentContainer>
        </Container>
      </Modal>
    </>
  )
}

export default ProfileEditor
