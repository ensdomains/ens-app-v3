import { useCopied } from '@app/hooks/useCopied'
import { Button } from '@ensdomains/thorin'
import styled from 'styled-components'
import { IconCopyAnimated } from './IconCopyAnimated'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const CopyButton = ({ value }: { value: string }) => {
  const { copy, copied } = useCopied()

  return (
    <Container>
      <Button
        onClick={() => copy(value)}
        size="small"
        variant="transparent"
        shadowless
      >
        <IconCopyAnimated copied={copied} size="3.5" />
      </Button>
    </Container>
  )
}
