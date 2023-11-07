import { useFieldArray, useFormContext, useFormState } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, mq, ScrollBox } from '@ensdomains/thorin2'

import { EditRolesFooter } from '../../components/EditRolesFooter'
import type { EditRolesForm } from '../../EditRoles-flow'
import { RoleCard } from './components/RoleCard'

const HeadingWrapper = styled.div(({ theme }) => [
  css`
    width: calc(100% + 2 * ${theme.space['4']});
    margin: 0 -${theme.space['4']};
    padding-bottom: ${theme.space['4']};
    border-bottom: 1px solid ${theme.colors.border};
  `,
  mq.sm.min(css`
    width: calc(100% + 2 * ${theme.space['6']});
    margin: 0 -${theme.space['6']};
  `),
])

const StyledScrollBox = styled(ScrollBox)(
  ({ theme }) => css`
    flex: 1;
    width: 100%;
    margin-right: -${theme.space[2]};
  `,
)

const ScrollBoxContent = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[4]};
    padding: ${theme.space[4]} 0;
  `,
)

const Content = styled.div(
  () => css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  `,
)

type Props = {
  onSelectIndex: (index: number) => void
  onSave: () => void
  onCancel: () => void
}

export const MainView = ({ onSelectIndex, onCancel, onSave }: Props) => {
  const { t } = useTranslation()
  const { control } = useFormContext<EditRolesForm>()
  const { fields: roles } = useFieldArray<EditRolesForm>({ control, name: 'roles' })
  const formState = useFormState({ control, name: 'roles' })

  // Bug in react-hook-form where isDirty is not always update when using field array.
  // Manually handle the check instead.
  const isDirty = !!formState.dirtyFields?.roles?.some((role) => !!role.address)

  return (
    <Content>
      <HeadingWrapper>
        <Dialog.Heading title="Edit roles" />
      </HeadingWrapper>
      <StyledScrollBox hideDividers>
        <ScrollBoxContent>
          {roles.map((role, index) => (
            <RoleCard
              key={role.role}
              role={role.role}
              address={role.address}
              dirty={formState.dirtyFields.roles?.[index]?.address}
              onClick={() => onSelectIndex?.(index)}
            />
          ))}
        </ScrollBoxContent>
      </StyledScrollBox>
      <EditRolesFooter
        leading={
          <Button colorStyle="accentSecondary" onClick={() => onCancel()}>
            {t('action.cancel')}
          </Button>
        }
        trailing={
          <Button data-testid="edit-roles-save-button" disabled={!isDirty} onClick={() => onSave()}>
            {t('action.save')}
          </Button>
        }
      />
    </Content>
  )
}
