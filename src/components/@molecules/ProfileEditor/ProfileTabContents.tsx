import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { ScrollBox, Textarea } from '@ensdomains/thorin'

import { RecordInput } from '@app/components/@molecules/RecordInput/RecordInput'
import useProfileEditor from '@app/hooks/useProfileEditor'
import { ContentHashProtocol } from '@app/utils/contenthash'
import { convertFormSafeKey, formSafeKey } from '@app/utils/editor'
import { validateCryptoAddress } from '@app/utils/validate'
import { validateContentHash } from '@app/validators/validateContentHash'

const TabContentsContainer = styled.div(
  () => css`
    position: relative;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `,
)

const TabContentContainer = styled.div<{ $removePadding: boolean }>(
  ({ theme, $removePadding }) => css`
    display: flex;
    flex-direction: column;
    padding: 0 ${$removePadding ? '0' : theme.space['2']};
    gap: ${theme.space['3']};
    flex: 1;
  `,
)

const ScrollBoxDecorator = styled(ScrollBox)(
  ({ theme }) => css`
    height: 100%;
    width: 100%;
    & > div {
      padding-right: ${theme.space['1.5']};
    }
  `,
)

const LabelWrapper = styled.div(
  ({ theme }) => css`
    font-size: ${theme.space['3.5']};
    line-height: 1.2;
  `,
)

type Props = ReturnType<typeof useProfileEditor> & {
  removePadding?: boolean
}

const ProfileTabContents = ({
  register,
  unregister,
  formState,
  resetField,
  setValue,
  getFieldState,
  clearErrors,
  tab,
  existingAccountKeys,
  newAccountKeys,
  removeAccountKey,
  getSelectedAccountOption,
  existingAddressKeys,
  newAddressKeys,
  removeAddressKey,
  getSelectedAddressOption,
  hasExistingWebsite,
  websiteOption,
  setWebsiteOption,
  existingOtherKeys,
  newOtherKeys,
  removeOtherKey,
  removePadding = false,
}: Props) => {
  const { t } = useTranslation('transactionFlow')
  const hasKeys = useMemo(() => {
    if (tab === 'general') return true
    if (tab === 'accounts') return existingAccountKeys.length > 0 || newAccountKeys.length > 0
    if (tab === 'address') return existingAddressKeys.length > 0 || newAddressKeys.length > 0
    if (tab === 'website') return websiteOption
    return existingOtherKeys.length > 0 || newOtherKeys.length > 0
  }, [
    existingAccountKeys,
    newAccountKeys,
    existingAddressKeys,
    newAddressKeys,
    websiteOption,
    existingOtherKeys,
    newOtherKeys,
    tab,
  ])

  if (!hasKeys) return null

  return (
    <TabContentsContainer>
      <ScrollBoxDecorator>
        <TabContentContainer $removePadding={removePadding} data-testid="tab-container">
          {
            {
              general: (
                <>
                  <RecordInput
                    deletable={false}
                    label={t('input.profileEditor.tabs.general.name.label')}
                    placeholder={t('input.profileEditor.tabs.general.name.placeholder')}
                    showDot
                    validated={getFieldState('general.name', formState).isDirty}
                    autoComplete="off"
                    {...register('general.name')}
                  />
                  <RecordInput
                    deletable={false}
                    label={t('input.profileEditor.tabs.general.url.label')}
                    autoComplete="off"
                    placeholder={t('input.profileEditor.tabs.general.url.placeholder')}
                    showDot
                    validated={getFieldState('general.url', formState).isDirty}
                    {...register('general.url')}
                  />
                  <RecordInput
                    deletable={false}
                    label={t('input.profileEditor.tabs.general.location.label')}
                    autoComplete="off"
                    placeholder={t('input.profileEditor.tabs.general.location.placeholder')}
                    showDot
                    validated={getFieldState('general.location', formState).isDirty}
                    {...register('general.location')}
                  />
                  <Textarea
                    label={
                      <LabelWrapper>
                        {t('input.profileEditor.tabs.general.description.label')}
                      </LabelWrapper>
                    }
                    autoComplete="off"
                    placeholder={t('input.profileEditor.tabs.general.description.placeholder')}
                    showDot
                    validated={getFieldState('general.description', formState).isDirty}
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
                        `input.profileEditor.tabs.accounts.placeholder.${convertFormSafeKey(
                          account,
                        )}`,
                        `input.profileEditor.tabs.accounts.placeholder.default`,
                      ])}
                      showDot
                      error={getFieldState(`accounts.${account}`, formState).error?.message}
                      validated={getFieldState(`accounts.${account}`, formState).isDirty}
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
                        `input.profileEditor.tabs.accounts.placeholder.${convertFormSafeKey(key)}`,
                        `input.profileEditor.tabs.accounts.placeholder.default`,
                      ])}
                      error={getFieldState(`accounts.${key}`, formState).error?.message}
                      validated={getFieldState(`accounts.${formSafeKey(key)}`, formState).isDirty}
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
                        `input.profileEditor.tabs.address.placeholder.${convertFormSafeKey(key)}`,
                        `input.profileEditor.tabs.address.placeholder.default`,
                      ])}
                      showDot
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
                        `input.profileEditor.tabs.address.placeholder.${convertFormSafeKey(key)}`,
                        `input.profileEditor.tabs.address.placeholder.default`,
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
                    `input.profileEditor.tabs.contentHash.placeholder.${convertFormSafeKey(
                      websiteOption.value,
                    )}`,
                    `input.profileEditor.tabs.contentHash.placeholder.default`,
                  ])}
                  error={getFieldState(`website`, formState).error?.message}
                  validated={getFieldState(`website`, formState).isDirty}
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
                  {...register('website', {
                    validate: validateContentHash(websiteOption.value as ContentHashProtocol),
                  })}
                />
              ),
              other: (
                <>
                  {existingOtherKeys.map((key) => (
                    <RecordInput
                      key={key}
                      label={key}
                      placeholder={t([
                        `input.profileEditor.tabs.other.placeholder.${convertFormSafeKey(key)}`,

                        `input.profileEditor.tabs.other.placeholder.default`,
                      ])}
                      error={getFieldState(`other.${key}`, formState).error?.message}
                      validated={getFieldState(`other.${key}`, formState).isDirty}
                      onDelete={() => removeOtherKey(key, false)}
                      {...register(`other.${key}`, {})}
                    />
                  ))}
                  {newOtherKeys.map((key) => (
                    <RecordInput
                      key={key}
                      placeholder={t([
                        `input.profileEditor.tabs.other.placeholder.${convertFormSafeKey(key)}`,
                        `input.profileEditor.tabs.other.placeholder.default`,
                      ])}
                      error={getFieldState(`other.${key}`, formState).error?.message}
                      validated={getFieldState(`other.${key}`, formState).isDirty}
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
      </ScrollBoxDecorator>
    </TabContentsContainer>
  )
}

export default ProfileTabContents
