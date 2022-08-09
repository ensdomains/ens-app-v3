import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import { useValidate } from '@app/hooks/useValidate'
import { emptyAddress } from '@app/utils/constants'
import { useEns } from '@app/utils/EnsProvider'
import { Button, Dialog, Input } from '@ensdomains/thorin'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import styled, { css } from 'styled-components'
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

export const CreateSubname = ({
  data: { parent, isWrapped },
  dispatch,
  onDismiss,
}: { data: Data } & TransactionDialogPassthrough) => {
  const { t } = useTranslation('profile')

  const [label, setLabel] = useState('')
  const [_label, _setLabel] = useState('')

  const { getOwner } = useEns()

  const validation = useValidate(_label, !_label)

  const { data: ownership, isLoading } = useQuery([label, 'createSubname', 'getOwner'], () =>
    getOwner(`${validation.name}.${parent}`),
  )

  const debouncedSetLabel = useDebouncedCallback(setLabel, 500)

  const { valid, error } = useMemo(() => {
    if (_label === '') return { valid: false, error: undefined }
    if (!validation.valid) return { valid: false, error: 'invalidCharacters' }
    if (label !== _label || isLoading) return { valid: false, error: undefined }
    if (!ownership?.owner || (ownership.owner && ownership.owner === emptyAddress))
      return { valid: true, error: undefined }
    return { valid: false, error: 'alreadyExists' }
  }, [ownership?.owner, label, _label, isLoading, validation.valid])

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
          label="Label"
          suffix={`.${parent}`}
          value={_label}
          onChange={(e) => {
            _setLabel(e.target.value)
            debouncedSetLabel(e.target.value)
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
