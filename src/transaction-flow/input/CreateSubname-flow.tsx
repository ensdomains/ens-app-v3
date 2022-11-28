import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useQuery } from 'wagmi'

import { validateName } from '@ensdomains/ensjs/utils/validation'
import { Button, Dialog, Input } from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import { useValidate } from '@app/hooks/useValidate'
import { useEns } from '@app/utils/EnsProvider'
import { emptyAddress } from '@app/utils/constants'
import { isLabelTooLong } from '@app/utils/utils'

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

  const { getOwner } = useEns()

  const validation = useValidate(_label, !_label)

  const { data: ownership, isLoading } = useQuery(
    [label, 'createSubname', 'getOwner'],
    () => getOwner(`${validation.name}.${parent}`),
    {
      refetchOnMount: true,
    },
  )

  const debouncedSetLabel = useDebouncedCallback(setLabel, 500)

  console.log('ownership: ', ownership)
  console.log('validation: ', validation)
  console.log('parent: ', parent)

  const { valid, error } = useMemo(() => {
    if (_label === '') return { valid: false, error: undefined }
    if (_label !== _label.toLowerCase()) return { valid: false, error: 'mustUseLowercase' }
    if (isWrapped && isLabelTooLong(_label)) return { valid: false, error: 'nameTooLong' }
    if (!validation.valid) return { valid: false, error: 'invalidCharacters' }
    if (label !== _label || isLoading) return { valid: false, error: undefined }
    if (!ownership?.owner || (ownership.owner && ownership.owner === emptyAddress))
      return { valid: true, error: undefined }
    return { valid: false, error: 'alreadyExists' }
  }, [ownership?.owner, label, _label, isLoading, validation.valid, isWrapped])

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
          error={error ? t(`details.tabs.subnames.addSubname.dialog.error.${error}`) : undefined}
        />
      </StyledInnerDialog>
      <Dialog.Footer
        leading={
          <Button variant="secondary" tone="grey" shadowless onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button
            data-testid="create-subname-next"
            shadowless
            onClick={handleSubmit}
            disabled={!valid}
          >
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default CreateSubname
