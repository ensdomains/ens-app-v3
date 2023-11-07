import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { RecordOptions } from '@ensdomains/ensjs/utils'
import { Button, mq } from '@ensdomains/thorin2'

import AddRecord from '@app/components/@molecules/AdvancedEditor/AddRecord'
import AdvancedEditorContent from '@app/components/@molecules/AdvancedEditor/AdvancedEditorTabContent'
import AdvancedEditorTabs from '@app/components/@molecules/AdvancedEditor/AdvancedEditorTabs'
import useAdvancedEditor from '@app/hooks/useAdvancedEditor'
import { useProfile } from '@app/hooks/useProfile'
import { makeTransactionItem, TransactionItem } from '@app/transaction-flow/transaction'
import type { TransactionDialogPassthrough } from '@app/transaction-flow/types'

const Container = styled.form(({ theme }) => [
  css`
    width: 100%;
    max-height: min(80vh, 600px);
    background: ${theme.colors.backgroundPrimary};
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `,
  mq.sm.min(css`
    width: calc(80vw - 2 * ${theme.space['6']});
    max-width: ${theme.space['128']};
  `),
])

const NameContainer = styled.div(({ theme }) => [
  css`
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

const FooterContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space['3']};
    width: 100%;
    max-width: ${theme.space['96']};
    margin: 0 auto;
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

  const { data: profile, isLoading: isProfileLoading } = useProfile({ name })

  const handleCreateTransaction = useCallback(
    (records: RecordOptions) => {
      dispatch({
        name: 'setTransactions',
        payload: [
          makeTransactionItem('updateProfile', {
            name,
            resolverAddress: profile!.resolverAddress!,
            records,
          }),
        ],
      })
      dispatch({ name: 'setFlowStage', payload: 'transaction' })
    },
    [profile, dispatch, name],
  )

  const advancedEditorForm = useAdvancedEditor({
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
    <Container onSubmit={handleSubmit} data-testid="advanced-editor">
      <NameContainer>{t('advancedEditor.title', { name })}</NameContainer>
      <ContentContainer>
        <AdvancedEditorTabs {...advancedEditorForm} />
        <AdvancedEditorContent {...advancedEditorForm} />
        <AddRecord control={control} AddButtonProps={AddButtonProps} />
        <FooterContainer>
          <Button colorStyle="accentSecondary" onClick={handleCancel}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
          <Button disabled={hasErrors || !hasChanges} type="submit">
            {t('action.save', { ns: 'common' })}
          </Button>
        </FooterContainer>
      </ContentContainer>
    </Container>
  )
}

export default AdvancedEditor
