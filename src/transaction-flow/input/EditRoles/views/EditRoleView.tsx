import { useFieldArray } from 'react-hook-form'

import { Button, Dialog, Input } from '@ensdomains/thorin'

type Props = {
  index: number
  control: any
}

export const EditRoleView = ({ control, index }: Props) => {
  const { fields: roles } = useFieldArray({ control, name: 'roles' })
  const data = roles[index] as any
  const { role, address } = data

  return (
    <>
      <Dialog.Heading title={`Change ${role}`} />
      <Input name="role" label="Role" defaultValue={role} hideLabel />
      {address}
      <Dialog.Footer trailing={<Button colorStyle="accentSecondary">Cancel</Button>} />
    </>
  )
}
