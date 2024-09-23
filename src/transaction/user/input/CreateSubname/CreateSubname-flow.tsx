import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { validateName } from '@ensdomains/ensjs/utils'
import { Button, Dialog, Input } from '@ensdomains/thorin'

import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import { useValidateSubnameLabel } from '@app/hooks/useValidateSubnameLabel'
import type { TransactionDialogPassthrough } from '@app/transaction/components/TransactionDialogManager'

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

const CreateSubname = ({
  data: { parent, isWrapped },
  onDismiss,
  setStage,
  setTransactions,
}: Props) => {
  const { t } = useTranslation('profile')

  const [label, setLabel] = useState('')
  const [_label, _setLabel] = useState('')

  const debouncedSetLabel = useDebouncedCallback(setLabel, 500)

  const {
    valid,
    error,
    expiryLabel,
    isLoading: isUseValidateSubnameLabelLoading,
  } = useValidateSubnameLabel({ name: parent, label, isWrapped })

  const isLabelsInsync = label === _label
  const isLoading = isUseValidateSubnameLabelLoading || !isLabelsInsync

  const handleSubmit = () => {
    setTransactions([
      {
        name: 'createSubname',
        data: {
          contract: isWrapped ? 'nameWrapper' : 'registry',
          label,
          parent,
        },
      },
    ])
    setStage('transaction')
  }

  return (
    <>
      <Dialog.Heading title={t('details.tabs.subnames.addSubname.dialog.title')} />
      <Dialog.Content>
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
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
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
