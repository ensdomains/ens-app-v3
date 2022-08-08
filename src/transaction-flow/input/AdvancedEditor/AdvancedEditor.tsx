/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { Theme } from 'typings-custom/styled-components'
import { useForm } from 'react-hook-form'
import { mq, Button, ScrollBox } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import { RecordInput } from '@app/components/@molecules/RecordInput/RecordInput'
import { useProfile } from '@app/hooks/useProfile'
import { validateCryptoAddress } from '@app/utils/validate'
import {
  convertFormSafeKey,
  convertProfileToProfileFormObject,
  formSafeKey,
  getDirtyFields,
} from '@app/utils/editor'
import useExpandableRecordsGroup from '@app/hooks/useExpandableRecordsGroup'
import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'
import type { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { AddRecordButton } from '@app/components/@molecules/AddRecordButton/AddRecordButton'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import addressOptions from '../ProfileEditor/addressOptions'
import { textOptions } from './textOptions'

const Container = styled.form(({ theme }) => [
  css`
    width: calc(100% + 2 * ${theme.space['3.5']});
    height: calc(100% + 2 * ${theme.space['3.5']});
    max-height: 90vh;
    margin: -${theme.space[3.5]};
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

const NameContainer = styled.div(({ theme }) => [
  css`
    display: block;
    width: 100%;
    padding-top: ${theme.space['6']};
    padding-left: ${theme.space['7']};
    padding-right: ${theme.space['4']};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    line-height: 45px;
    vertical-align: middle;
    text-align: center;
    font-feature-settings: 'ss01' on, 'ss03' on, 'ss04' on;
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.space['6']};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `,
  mq.sm.min(css`
    text-align: left;
  `),
])

const ContentContainer = styled.div(
  ({ theme }) => css`
    flex: 1;
    display: flex;
    margin-top: ${theme.space['4.5']};
    flex-direction: column;
    overflow: hidden;
    gap: ${theme.space['4']};
  `,
)

const TabButtonsContainer = styled.div(({ theme }) => [
  css`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.space['1.25']} ${theme.space['3']};
    padding: 0 ${theme.space['4']} 0 ${theme.space['7']};
  `,
  mq.sm.min(css`
    padding: 0 ${theme.space['7']};
  `),
])

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
    padding: 0 ${theme.space['1']};
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `,
)

const TabContentContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['3']};
    padding: 0 ${theme.space['2']};
    overflow: hidden;
    flex: 1;
  `,
)

const ScrollBoxDecorator = styled(ScrollBox)(
  () => css`
    height: 100%;
  `,
)

const AddRecordContainer = styled.div(
  ({ theme }) => css`
    padding: 0 ${theme.space['4']};
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

type AdvancedEditorType = {
  text: {
    [key: string]: string
  }
  address: {
    [key: string]: string
  }
  other: {
    contentHash?: string
    publicKey?: string
    abi?: string
  }
}

const getFieldsByType = (type: 'text' | 'addr' | 'contentHash', data: AdvancedEditorType) => {
  const entries = []
  if (type === 'text') {
    if (data.text)
      entries.push(
        ...Object.entries(data.text).map(([key, value]) => [convertFormSafeKey(key), value]),
      )
  } else if (type === 'addr') {
    if (data.address)
      entries.push(
        ...Object.entries(data.address).map(([key, value]) => [convertFormSafeKey(key), value]),
      )
  } else if (type === 'contentHash') {
    if (data.other.contentHash) entries.push(['website', data.other.contentHash])
  }
  return Object.fromEntries(entries)
}

type TabType = 'text' | 'address' | 'other'

type ExpandableRecordsGroup = 'text' | 'address'
type ExpandableRecordsState = {
  [key in ExpandableRecordsGroup]: string[]
}

type Data = {
  name: string
}

type Props = {
  data?: Data
  onDismiss?: () => void
} & TransactionDialogPassthrough

const AdvancedEditor = ({ data, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('profile')
  const name = data?.name || ''

  const {
    register,
    formState,
    reset,
    setValue,
    getValues,
    getFieldState,
    handleSubmit,
    clearErrors,
    setFocus,
    resetField,
  } = useForm<AdvancedEditorType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      text: {},
      address: {},
      other: {},
    },
  })

  const [tab, setTab] = useState<TabType>('text')
  const handleTabClick = (_tab: TabType) => () => setTab(_tab)
  const hasErrors = Object.keys(formState.errors || {}).length > 0

  const [existingRecords, setExistingRecords] = useState<ExpandableRecordsState>({
    address: [],
    text: [],
  })

  const {
    existingKeys: existingTextKeys,
    newKeys: newTextKeys,
    addKey: addTextKey,
    removeKey: removeTextKey,
  } = useExpandableRecordsGroup<AdvancedEditorType>({
    group: 'text',
    existingKeys: existingRecords.text,
    options: textOptions,
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
  } = useExpandableRecordsGroup<AdvancedEditorType>({
    group: 'address',
    existingKeys: existingRecords.address,
    options: addressOptions,
    setValue,
    getValues,
  })

  const AddButtonProps = (() => {
    switch (tab) {
      case 'text':
        return {
          createable: true,
          messages: {
            addRecord: t('advancedEditor.tabs.text.addRecord'),
            createRecord: t('advancedEditor.tabs.text.createRecord'),
          },
          onAddRecord: (record: string) => {
            addTextKey(record)
            process.nextTick(() => {
              setFocus(`text.${record}`)
            })
          },
        }
      case 'address':
        if (!hasAddressOptions) return null
        return {
          autocomplete: true,
          inline: true,
          options: availableAddressOptions,
          messages: {
            addRecord: t('advancedEditor.tabs.address.addRecord'),
            noOptions: t('advancedEditor.tabs.address.noOptions'),
          },
          onAddRecord: (key: string) => {
            addAddressKey(key)
            process.nextTick(() => {
              setFocus(`address.${key}`)
            })
          },
        }
      default:
        return null
    }
  })()

  const { profile, loading } = useProfile(name, name !== '')

  useEffect(() => {
    if (profile) {
      const formObject = convertProfileToProfileFormObject(profile)

      const newDefaultValues = {
        text: {
          ...(formObject.avatar ? { avatar: formObject.avatar } : {}),
          ...(formObject.banner ? { banner: formObject.banner } : {}),
          ...formObject.general,
          ...formObject.accounts,
          ...formObject.other,
        },
        address: formObject.address,
        other: {
          contentHash: formObject.website,
          publicKey: '',
          abi: '',
        },
      }
      reset(newDefaultValues)
      const newExistingRecords: ExpandableRecordsState = {
        address: Object.keys(newDefaultValues.address) || [],
        text: Object.keys(newDefaultValues.text) || [],
      }
      setExistingRecords(newExistingRecords)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  const { hasInterface: hasABIInterface, isLoading: isLoadingABIInterface } =
    useResolverHasInterfaces(['IABIResolver'], profile?.resolverAddress, loading)

  const { hasInterface: hasPublicKeyInterface, isLoading: isLoadingPublicKeyInterface } =
    useResolverHasInterfaces(['IPubkeyResolver'], profile?.resolverAddress, loading)

  const handleCancel = () => {
    if (onDismiss) onDismiss()
  }

  const handleTransaction = async (editorData: AdvancedEditorType) => {
    const dirtyFields = getDirtyFields(formState.dirtyFields, editorData) as AdvancedEditorType

    const texts = Object.entries(getFieldsByType('text', dirtyFields)).map(([key, value]) => ({
      key,
      value,
    })) as { key: string; value: string }[]

    const coinTypes = Object.entries(getFieldsByType('addr', dirtyFields)).map(([key, value]) => ({
      key,
      value,
    })) as { key: string; value: string }[]

    const contentHash = dirtyFields.other?.contentHash

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const records = {
      texts,
      coinTypes,
      contentHash,
    }

    await dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('updateProfile', {
          name,
          resolver: profile!.resolverAddress!,
          records,
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

  const hasChanges = Object.keys(formState.dirtyFields || {}).length > 0

  if (loading || isLoadingABIInterface || isLoadingPublicKeyInterface) return null
  return (
    <Container onSubmit={handleSubmit(handleTransaction)} data-testid="advanced-editor">
      <NameContainer>{t('advancedEditor.title', { name })}</NameContainer>
      <ContentContainer>
        <TabButtonsContainer>
          <TabButton
            $selected={tab === 'text'}
            $hasError={!!getFieldState('text', formState).error}
            $isDirty={getFieldState('text').isDirty}
            onClick={handleTabClick('text')}
            data-testid="text-tab"
            type="button"
          >
            {t('advancedEditor.tabs.text.label')}
          </TabButton>
          <TabButton
            $selected={tab === 'address'}
            $hasError={!!getFieldState('address', formState).error}
            $isDirty={getFieldState('address').isDirty}
            onClick={handleTabClick('address')}
            type="button"
            data-testid="address-tab"
          >
            {t('advancedEditor.tabs.address.label')}
          </TabButton>
          <TabButton
            $selected={tab === 'other'}
            $hasError={!!getFieldState('other', formState).error}
            $isDirty={getFieldState('other').isDirty}
            onClick={handleTabClick('other')}
            type="button"
          >
            {t('advancedEditor.tabs.other.label')}
          </TabButton>
        </TabButtonsContainer>
        <TabContentsContainer>
          <ScrollBoxDecorator>
            <TabContentContainer>
              {
                {
                  text: (
                    <>
                      {existingTextKeys.map((key) => (
                        <RecordInput
                          key={key}
                          label={key}
                          placeholder={t([
                            `advancedEditor.tabs.text.placeholder.${convertFormSafeKey(key)}`,
                            `advancedEditor.tabs.text.placeholder.default`,
                          ])}
                          showDot
                          error={getFieldState(`text.${key}`, formState).error?.message}
                          validated={getFieldState(`text.${key}`, formState).isDirty}
                          onDelete={() => {
                            removeTextKey(key, false)
                            clearErrors([`text.${key}`])
                          }}
                          {...register(`text.${key}`, {})}
                        />
                      ))}
                      {newTextKeys.map((key) => (
                        <RecordInput
                          key={key}
                          label={key}
                          placeholder={t([
                            `advancedEditor.tabs.text.placeholder.${convertFormSafeKey(key)}`,
                            `advancedEditor.tabs.text.placeholder.default`,
                          ])}
                          error={getFieldState(`text.${key}`, formState).error?.message}
                          validated={getFieldState(`text.${key}`, formState).isDirty}
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck={false}
                          showDot
                          onDelete={() => {
                            removeTextKey(formSafeKey(key))
                            resetField(`text.${key}`, {
                              keepDirty: false,
                              keepError: false,
                              keepTouched: false,
                            })
                          }}
                          {...register(`text.${key}`, {})}
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
                            `advancedEditor.tabs.address.placeholder.${convertFormSafeKey(key)}`,
                            `advancedEditor.tabs.address.placeholder.default`,
                          ])}
                          error={getFieldState(`address.${key}`, formState).error?.message}
                          validated={getFieldState(`address.${key}`, formState).isDirty}
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
                            `advancedEditor.tabs.address.placeholder.${convertFormSafeKey(key)}`,
                            `advancedEditor.tabs.address.placeholder.default`,
                          ])}
                          error={getFieldState(`address.${key}`, formState).error?.message}
                          validated={getFieldState(`address.${key}`, formState).isDirty}
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
                          }}
                          {...register(`address.${key}`, {
                            validate: validateCryptoAddress(key),
                          })}
                        />
                      ))}
                    </>
                  ),
                  other: (
                    <>
                      <RecordInput
                        deletable={false}
                        label={t('advancedEditor.tabs.other.contentHash.label')}
                        placeholder={t('advancedEditor.tabs.other.contentHash.placeholder')}
                        showDot
                        validated={getFieldState('other.contentHash', formState).isDirty}
                        autoComplete="off"
                        {...register('other.contentHash', {})}
                      />
                      <RecordInput
                        deletable={false}
                        disabled={!hasPublicKeyInterface}
                        labelDisabled={t('advancedEditor.tabs.other.labelDisabled')}
                        label={t('advancedEditor.tabs.other.publicKey.label')}
                        placeholder={t('advancedEditor.tabs.other.publicKey.placeholder')}
                        showDot
                        validated={getFieldState('other.publicKey', formState).isDirty}
                        error={getFieldState('other.publicKey', formState).error?.message}
                        autoComplete="off"
                        {...register('other.publicKey', {})}
                      />
                      <RecordInput
                        deletable={false}
                        disabled={!hasABIInterface}
                        labelDisabled={t('advancedEditor.tabs.other.labelDisabled')}
                        label={t('advancedEditor.tabs.other.abi.label')}
                        placeholder={t('advancedEditor.tabs.other.abi.placeholder')}
                        showDot
                        validated={getFieldState('other.abi', formState).isDirty}
                        autoComplete="off"
                        {...register('other.abi', {})}
                      />
                    </>
                  ),
                }[tab]
              }
            </TabContentContainer>
          </ScrollBoxDecorator>
        </TabContentsContainer>
        {AddButtonProps && (
          <AddRecordContainer>
            <AddRecordButton {...AddButtonProps} />
          </AddRecordContainer>
        )}
        <FooterContainer>
          <Button tone="grey" variant="secondary" shadowless onClick={handleCancel}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
          <Button disabled={hasErrors || !hasChanges} type="submit" shadowless>
            {t('action.save', { ns: 'common' })}
          </Button>
        </FooterContainer>
      </ContentContainer>
    </Container>
  )
}

export default AdvancedEditor
