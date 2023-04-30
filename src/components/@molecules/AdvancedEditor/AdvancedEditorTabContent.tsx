import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { ScrollBox } from '@ensdomains/thorin'

import { RecordInput } from '@app/components/@molecules/RecordInput/RecordInput'
import useAdvancedEditor from '@app/hooks/useAdvancedEditor'
import { convertFormSafeKey, formSafeKey } from '@app/utils/editor'
import { validateCryptoAddress } from '@app/utils/validate'
import { validateAbi } from '@app/validators/validateAbi'
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

const TabContentContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['3']};
    overflow: hidden;
    flex: 1;
  `,
)

const ScrollBoxDecorator = styled(ScrollBox)(
  () => css`
    height: 100%;
  `,
)

type Props = ReturnType<typeof useAdvancedEditor>

const AdvancedEditorContent = ({
  existingTextKeys,
  newTextKeys,
  existingAddressKeys,
  newAddressKeys,
  formState,
  removeTextKey,
  removeAddressKey,
  clearErrors,
  getFieldState,
  resetField,
  register,
  getSelectedAddressOption,
  tab,
  hasABIInterface,
  setValue,
}: Props) => {
  const { t } = useTranslation('profile')

  return (
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
                      label={convertFormSafeKey(key)}
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
                      label={convertFormSafeKey(key)}
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
                        validate: (value: string) => {
                          const result = validateCryptoAddress(key)(value)
                          if (typeof result === 'string')
                            return t('errors.invalidAddress', { ns: 'common' })
                          return result
                        },
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
                        validate: (value: string) => {
                          const result = validateCryptoAddress(key)(value)
                          if (typeof result === 'string')
                            return t('errors.invalidAddress', { ns: 'common' })
                          return result
                        },
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
                    error={getFieldState('other.contentHash', formState).error?.message}
                    autoComplete="off"
                    onClear={() => {
                      setValue('other.contentHash', '')
                      clearErrors(['other.contentHash'])
                    }}
                    {...register('other.contentHash', {
                      validate: validateContentHash('all'),
                    })}
                  />
                  <RecordInput
                    deletable={false}
                    disabled={!hasABIInterface}
                    labelDisabled={t('advancedEditor.tabs.other.labelDisabled')}
                    label={t('advancedEditor.tabs.other.abi.label')}
                    placeholder={t('advancedEditor.tabs.other.abi.placeholder')}
                    showDot
                    validated={getFieldState('other.abi.data', formState).isDirty}
                    error={getFieldState('other.abi.data', formState).error?.message}
                    autoComplete="off"
                    onClear={() => {
                      setValue('other.abi.data', '')
                      clearErrors(['other.abi.data'])
                    }}
                    {...register('other.abi.data', {
                      validate: validateAbi(t),
                    })}
                  />
                </>
              ),
            }[tab]
          }
        </TabContentContainer>
      </ScrollBoxDecorator>
    </TabContentsContainer>
  )
}

export default AdvancedEditorContent
