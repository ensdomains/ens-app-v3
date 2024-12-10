import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { RecordOptions } from '@ensdomains/ensjs/utils'
import { Button, Dialog } from '@ensdomains/thorin'

import AddRecord from '@app/components/@molecules/AdvancedEditor/AddRecord'
import AdvancedEditorTabContent from '@app/components/@molecules/AdvancedEditor/AdvancedEditorTabContent'
import AdvancedEditorTabs from '@app/components/@molecules/AdvancedEditor/AdvancedEditorTabs'
import useAdvancedEditor from '@app/hooks/useAdvancedEditor'
import { useProfile } from '@app/hooks/useProfile'
import { createTransactionItem, TransactionItem } from '@app/transaction-flow/transaction'
import type { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { Profile } from '@app/types'

const NameContainer = styled.div(
  ({ theme }) => css`
    display: block;
    width: 100%;
    padding-left: ${theme.space['2']};
    padding-right: ${theme.space['4']};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    line-height: 45px;
    vertical-align: middle;
    text-align: center;
    font-feature-settings:
      'ss01' on,
      'ss03' on,
      'ss04' on;
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.space['6']};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    @media (min-width: ${theme.breakpoints.sm}px) {
      text-align: left;
    }
  `,
)

const FooterContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space['3']};
    width: 100%;
    margin: 0 auto;

    @media (min-width: ${theme.breakpoints.sm}px) {
      margin-top: -${theme.space['2']};
    }
  `,
)

type Data = {
  name: string
}

export type Props = {
  data?: Data
  onDismiss?: () => void
} & TransactionDialogPassthrough

const AdvancedEditor = ({ data, transactions = [], dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('profile')
  const name = data?.name || ''
  const transaction = transactions.find(
    (item: TransactionItem) => item.name === 'updateProfile',
  ) as TransactionItem<'updateProfile'>

  const { data: fetchedProfile, isLoading: isProfileLoading } = useProfile({ name })
  const [profile, setProfile] = useState<Profile | undefined>(undefined)

  // inline to prevent unnecessary re-renders
  if (fetchedProfile && !profile) {
    setProfile(fetchedProfile)
  }

  const ref = useRef<HTMLFormElement>(null)

  const handleCreateTransaction = useCallback(
    (records: RecordOptions) => {
      dispatch({
        name: 'setTransactions',
        payload: [
          createTransactionItem('updateProfile', {
            name,
            resolverAddress: fetchedProfile!.resolverAddress!,
            records,
          }),
        ],
      })
      dispatch({ name: 'setFlowStage', payload: 'transaction' })
    },
    [fetchedProfile, dispatch, name],
  )

  const advancedEditorForm = useAdvancedEditor({
    name,
    profile,
    isLoading: isProfileLoading,
    callback: handleCreateTransaction,
    overwrites: transaction?.data.records,
  })
  const { AddButtonProps, hasErrors, hasChanges, control, handleSubmit } = advancedEditorForm

  const handleCancel = () => {
    onDismiss?.()
  }

  if (isProfileLoading) return null

  return (
    <>
      <NameContainer>{t('advancedEditor.title', { name })}</NameContainer>
      <AdvancedEditorTabs {...advancedEditorForm} />
      <Dialog.Content
        as="form"
        ref={ref}
        onSubmit={handleSubmit}
        data-testid="advanced-editor"
        gap="3"
      >
        <AdvancedEditorTabContent {...advancedEditorForm} />
      </Dialog.Content>
      <AddRecord control={control} AddButtonProps={AddButtonProps} />
      <FooterContainer>
        <Button colorStyle="accentSecondary" onClick={handleCancel}>
          {t('action.cancel', { ns: 'common' })}
        </Button>
        <Button
          disabled={hasErrors || !hasChanges}
          onClick={() => {
            ref.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
          }}
        >
          {t('action.save', { ns: 'common' })}
        </Button>
      </FooterContainer>
    </>
  )
}

export default AdvancedEditor
