import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { validateName } from '@ensdomains/ensjs/utils/validation'
import { Button, Dialog, Input } from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback'

import { useValidateSubnameLabel } from '../../hooks/useValidateSubnameLabel'
import { makeTransactionItem } from '../transaction'
import { TransactionDialogPassthrough } from '../types'

const StyledInnerDialog = styled(InnerDialog)(
  () => css`
    overflow-y: hidden;
  `,
)

type Data = {
  parent: string
  isWrapped: boolean
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const ParentLabel = styled.div(
  ({ theme }) => css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: ${theme.space['48']};
  `,
)

const CreateSubname = ({ data: { parent, isWrapped }, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('profile')

  const [label, setLabel] = useState('')
  const [_label, _setLabel] = useState('')

  const debouncedSetLabel = useDebouncedCallback(setLabel, 500)

  const {
    valid,
    error,
    expiryLabel,
    isLoading: isUseValidateSubnameLabelLoading,
  } = useValidateSubnameLabel(parent, label, isWrapped)

  const isLabelsInsync = label === _label
  const isLoading = isUseValidateSubnameLabelLoading || !isLabelsInsync

  const handleSubmit = () => {
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('createSubname', {
          contract: isWrapped ? 'nameWrapper' : 'registry',
          label,
          parent,
        }),
      ],
    })
    dispatch({
      name: 'setFlowStage',
      payload: 'transaction',
    })
  }

  return (
    <>
      <Dialog.Heading title={t('details.tabs.subnames.addSubname.dialog.title')} />
      <StyledInnerDialog>
        <Input
          data-testid="add-subname-input"
          label="Label"
          suffix={<ParentLabel>.{parent}</ParentLabel>}
          value={_label}
          onChange={(e) => {
            try {
              const normalised = validateName(e.target.value)
              _setLabel(normalised)
              debouncedSetLabel(normalised)
            } catch {
              _setLabel(e.target.value)
              debouncedSetLabel(e.target.value)
            }
          }}
          error={
            error
              ? t(`details.tabs.subnames.addSubname.dialog.error.${error}`, { date: expiryLabel })
              : undefined
          }
        />
      </StyledInnerDialog>
      <Dialog.Footer
        leading={
          <Button colorStyle="greySecondary" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button
            data-testid="create-subname-next"
            onClick={handleSubmit}
            disabled={!valid || isLoading}
          >
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default CreateSubname
