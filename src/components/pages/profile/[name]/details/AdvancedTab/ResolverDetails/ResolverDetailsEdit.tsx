import { Dialog } from '@ensdomains/thorin'

interface Props {
  isOpen: boolean
  onDismiss: () => null
}

const ResolverDetailsEdit = ({ isOpen, onDismiss }: Props) => {
  return (
    <Dialog
      open={isOpen}
      title="Edit Resolver"
      subtitle="Edit the resolver details"
      onDismiss={onDismiss}
      variant="closable"
    >
      <div>some text</div>
    </Dialog>
  )
}

export { ResolverDetailsEdit }
