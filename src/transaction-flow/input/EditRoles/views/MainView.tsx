import { useFieldArray } from 'react-hook-form'
import styled, { css } from 'styled-components'

import { Button, Dialog, ScrollBox } from '@ensdomains/thorin'

import { EditRoleRow } from '../components/EditRoleRow'

const StyledScrollBox = styled(ScrollBox)(
  () => css`
    width: 100%;
  `,
)

const Content = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[2]};
  `,
)

type Props = {
  control: any
  onSelectIndex?: (index: number) => void
}

export const Main = ({ control, onSelectIndex }: Props) => {
  const { fields: roles } = useFieldArray({ control, name: 'roles' })
  return (
    <>
      <Dialog.Heading title="Edit roles" />
      <StyledScrollBox>
        <Content>
          {roles.map((role, index) => (
            <EditRoleRow
              key={role.role}
              role={role.role}
              address={role.address}
              onClick={() => onSelectIndex?.(index)}
            />
          ))}
        </Content>
      </StyledScrollBox>
      <Dialog.Footer
        leading={<Button colorStyle="accentSecondary">Cancel</Button>}
        trailing={<Button>Save</Button>}
      />
    </>
  )
}
