import React, { useState, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import { Theme } from 'typings-custom/styled-components'
import { useForm } from 'react-hook-form'
import { mq, Modal, Input, Button, PlusSVG } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { SelectableInput } from '@app/components/@molecules/SelectableInput/SelectableInput'
import { useProfile } from '@app/hooks/useProfile'
import { validateCryptoAddress } from '@app/utils/validate'
import { convertProfileToFormObject, formSafeKey } from '@app/utils/editor'
import useExpandableRecordsGroup from '@app/hooks/useExpandableRecordsGroup'
import ScrollIndicatorContainer from '@app/components/pages/profile/ScrollIndicatorContainer'
import addressOptions from '../../../ProfileEditor/addressOptions'
import { textOptions } from './textOptions'

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
    margin-top: ${theme.space['4.5']};
    flex-direction: column;
    gap: ${theme.space['2']};
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
    margin: ${theme.space['2.5']} 0;
  `,
)

const FooterContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space['3']};
    padding: 0 ${theme.space['3']} ${theme.space['3']} ${theme.space['3']};
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

type TabType = 'text' | 'address' | 'other'

type ExpandableRecordsGroup = 'text' | 'address'
type ExpandableRecordsState = {
  [key in ExpandableRecordsGroup]: string[]
}

type Props = {
  name?: string
  open: boolean
  onDismiss?: () => void
}

const AdvancedEditor = ({ name = '', open, onDismiss }: Props) => {
  const { t } = useTranslation('profile')
  const breakpoints = useBreakpoint()
  const isDesktop = breakpoints.sm

  const {
    register,
    formState,
    reset,
    setValue,
    getValues,
    getFieldState,
    handleSubmit,
  } = useForm<AdvancedEditorType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      text: {},
      address: {},
      other: {},
    },
  })

  const [tab, setTab] = useState<TabType>('address')
  const handleTabClick = (_tab: TabType) => () => setTab(_tab)
  const hasErrors = Object.keys(formState.errors || {}).length > 0

  const [existingRecords, setExistingRecords] =
    useState<ExpandableRecordsState>({
      address: [],
      text: [],
    })

  const {
    existingKeys: existingTextKeys,
    newKeys: newTextKeys,
    addKey: addTextKey,
    removeKey: removeTextKey,
    changeKey: changeAccountKey,
    hasOptions: hasTextOptions,
    getOptions: getTextOptions,
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
    changeKey: changeAddressKey,
    hasOptions: hasAddressOptions,
    getOptions: getAddressOptions,
  } = useExpandableRecordsGroup<AdvancedEditorType>({
    group: 'address',
    existingKeys: existingRecords.address,
    options: addressOptions,
    setValue,
    getValues,
  })

  const { profile, loading } = useProfile(name, name !== '')
  useEffect(() => {
    if (profile) {
      const formObject = convertProfileToFormObject(profile)
      const defaultValues = {
        text: {
          avatar: formObject.avatar,
          banner: formObject.banner,
          ...formObject.accounts,
          ...formObject.other,
        },
        address: formObject.address,
        other: {
          contentHash: '',
          publicKey: '',
          abi: '',
        },
      }
      reset(defaultValues)
      const newExistingRecords: ExpandableRecordsState = {
        address: Object.keys(defaultValues.address) || [],
        text: Object.keys(defaultValues.text) || [],
      }
      setExistingRecords(newExistingRecords)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  const ref = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLFormElement>(null)
  if (loading) return null
  return (
    <>
      <Modal open={open} onDismiss={onDismiss}>
        <Container
          onSubmit={handleSubmit((data: any) => console.log(data))}
          ref={targetRef}
        >
          <NameContainer>{name}&apos; records</NameContainer>
          <ContentContainer>
            <TabButtonsContainer>
              <TabButton
                $selected={tab === 'text'}
                $hasError={!!getFieldState('text', formState).error}
                $isDirty={getFieldState('text').isDirty}
                onClick={handleTabClick('text')}
              >
                {t('profileEditor.tabs.accounts.label')}
              </TabButton>
              <TabButton
                $selected={tab === 'address'}
                $hasError={!!getFieldState('address', formState).error}
                $isDirty={getFieldState('address').isDirty}
                onClick={handleTabClick('address')}
              >
                {t('profileEditor.tabs.address.label')}
              </TabButton>
              <TabButton
                $selected={tab === 'other'}
                $hasError={!!getFieldState('other', formState).error}
                $isDirty={getFieldState('other').isDirty}
                onClick={handleTabClick('other')}
              >
                {t('profileEditor.tabs.other.label')}
              </TabButton>
            </TabButtonsContainer>
            <TabContentsContainer>
              <ScrollIndicatorContainer ref={ref} page={tab}>
                <TabContentContainer>
                  {
                    {
                      text: (
                        <>
                          {existingTextKeys.map((key) => (
                            <SelectableInput
                              key={key}
                              selectProps={{
                                value: formSafeKey(key),
                                options: getTextOptions(key),
                              }}
                              label={key}
                              readOnly
                              {...register(
                                `accounts.${formSafeKey(key)}` as any,
                                {},
                              )}
                              onDelete={() => removeTextKey(key)}
                            />
                          ))}
                          {newTextKeys.map((key) => (
                            <SelectableInput
                              key={key}
                              selectProps={{
                                value: formSafeKey(key),
                                options: getTextOptions(key),
                                onChange: (e) =>
                                  changeAccountKey(key, e.target.value),
                                portal: {
                                  appendTo: targetRef.current,
                                  listenTo: ref.current,
                                },
                                autoDismiss: true,
                                direction: isDesktop ? 'down' : 'up',
                              }}
                              error={
                                getFieldState(
                                  `text.${formSafeKey(key)}`,
                                  formState,
                                ).error?.message
                              }
                              hasChanges={
                                getFieldState(
                                  `text.${formSafeKey(key)}`,
                                  formState,
                                ).isDirty
                              }
                              label={key}
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck={false}
                              onDelete={() => removeTextKey(formSafeKey(key))}
                              {...register(`text.${formSafeKey(key)}`, {})}
                            />
                          ))}
                          {hasTextOptions && (
                            <Button
                              outlined
                              prefix={<PlusSVG />}
                              variant="transparent"
                              shadowless
                              onClick={() => addTextKey()}
                            >
                              {t('profileEditor.tabs.accounts.addAccount')}
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
                                portal: {
                                  appendTo: targetRef.current,
                                  listenTo: ref.current,
                                },
                                autoDismiss: true,
                                direction: isDesktop ? 'down' : 'up',
                              }}
                              error={
                                getFieldState(`address.${key}`, formState).error
                                  ?.message
                              }
                              validated={
                                getFieldState(`address.${key}`, formState)
                                  .isDirty
                              }
                              showDot
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
                              {t('profileEditor.tabs.address.addAddress')}
                            </Button>
                          )}
                        </>
                      ),
                      other: (
                        <>
                          <Input
                            label="Content Hash"
                            placeholder="e.g. ips"
                            showDot
                            validated={
                              getFieldState('other.contentHash', formState)
                                .isDirty
                            }
                            autoComplete="off"
                            {...register('other.contentHash', {})}
                          />
                          <Input
                            label="Public Key"
                            placeholder="e.g. ips"
                            showDot
                            validated={
                              getFieldState('other.publicKey', formState)
                                .isDirty
                            }
                            autoComplete="off"
                            {...register('other.publicKey', {})}
                          />
                          <Input
                            label="ABI"
                            placeholder="e.g. ips"
                            showDot
                            validated={
                              getFieldState('other.abi', formState).isDirty
                            }
                            autoComplete="off"
                            {...register('other.abi', {})}
                          />
                        </>
                      ),
                    }[tab]
                  }
                </TabContentContainer>
              </ScrollIndicatorContainer>
            </TabContentsContainer>
            <FooterContainer>
              <Button tone="grey" shadowless>
                {t('action.cancel', { ns: 'common' })}
              </Button>
              <Button disabled={hasErrors} type="submit" shadowless>
                {t('action.save', { ns: 'common' })}
              </Button>
            </FooterContainer>
          </ContentContainer>
        </Container>
      </Modal>
    </>
  )
}

export default AdvancedEditor
