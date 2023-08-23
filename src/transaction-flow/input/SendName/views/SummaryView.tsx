import { Button, Dialog } from '@ensdomains/thorin'

type Props = {
  control: any
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SummaryView = ({ control }: Props) => {
  return (
    <>
      <Dialog.Footer
        leading={<Button colorStyle="accentSecondary">Back</Button>}
        trailing={<Button>Send</Button>}
      />
    </>
  )
}
