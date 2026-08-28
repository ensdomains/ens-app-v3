import { useRef } from 'react'
import { useFieldArray, useFormContext, useFormState } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import { DialogFooterWithBorder } from '@app/components/@molecules/DialogComponentVariants/DialogFooterWithBorder'
import { DialogHeadingWithBorder } from '@app/components/@molecules/DialogComponentVariants/DialogHeadinWithBorder'

import type { EditRolesForm } from '../../EditRoles-flow'
import { RoleCard } from './components/RoleCard'

type Props = {
  onSelectIndex: (index: number) => void
  onCancel: () => void
  onSubmit: () => void
}

export const MainView = ({ onSelectIndex, onCancel, onSubmit }: Props) => {
  const { t } = useTranslation()
  const { control } = useFormContext<EditRolesForm>()
  const { fields: roles } = useFieldArray<EditRolesForm>({ control, name: 'roles' })
  const formState = useFormState({ control, name: 'roles' })

  const ref = useRef<HTMLFormElement>(null)

  // Bug in react-hook-form where isDirty is not always update when using field array.
  // Manually handle the check instead.
  const isDirty = !!formState.dirtyFields?.roles?.some((role) => !!role.address)

  return (
    <>
      <DialogHeadingWithBorder title="Edit roles" fullWidth />
      <Dialog.Content as="form" ref={ref} onSubmit={onSubmit} hideDividers>
        <div />
        {roles.map((role, index) => (
          <RoleCard
            key={role.role}
            role={role.role}
            address={role.address}
            dirty={formState.dirtyFields.roles?.[index]?.address}
            onClick={() => onSelectIndex?.(index)}
          />
        ))}
        <div />
      </Dialog.Content>
      <DialogFooterWithBorder
        fullWidth
        leading={
          <Button colorStyle="accentSecondary" onClick={() => onCancel()}>
            {t('action.cancel')}
          </Button>
        }
        trailing={
          <Button
            data-testid="edit-roles-save-button"
            disabled={!isDirty}
            onClick={() => {
              ref.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
            }}
          >
            {t('action.save')}
          </Button>
        }
      />
    </>
  )
}
