import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Button, Dialog, Input, Typography } from '@ensdomains/thorin'

import { Outlink } from '@app/components/Outlink'
import { validateImageUri } from '@app/validators/validateImageUri'

const Container = styled.div(
  () => css`
    width: 100%;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
)

const Description = styled(Typography)(
  ({ theme }) => css`
    text-align: center;
    color: ${theme.colors.textSecondary};
  `,
)

const InputContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    margin-top: ${theme.space['2']};
  `,
)

export const AvatarManual = ({
  handleCancel,
  handleSubmit,
}: {
  handleCancel: () => void
  handleSubmit: (type: 'nft' | 'upload' | 'manual', uri: string, display?: string) => void
}) => {
  const [uri, setUri] = useState('')
  const [error, setError] = useState<string | undefined>()

  const validateUri = (value: string) => {
    const validationResult = validateImageUri(value)

    if (validationResult === true) {
      setError(undefined)
      return true
    }

    setError(validationResult as string)
    return false
  }

  const handleUriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setUri(newValue)
    // Always validate in real-time as the user types
    validateUri(newValue)
  }

  const onSubmit = () => {
    if (validateUri(uri)) {
      handleSubmit('manual', uri, uri)
    }
  }

  return (
    <>
      <Dialog.Heading title="Enter manually" />
      <Dialog.Content>
        <Container>
          <Description fontVariant="body">
            Manual entry supports NFT, https, IPFS, and data URIs.
            <Outlink href="https://docs.ens.domains/ensip/12" iconPosition="after">
              Learn more about avatar URIs
            </Outlink>
          </Description>
          <InputContainer>
            <Input
              label=""
              placeholder="http(s)://, ipfs://, data:, or eip155:"
              value={uri}
              onChange={handleUriChange}
              error={error}
              autoComplete="off"
              data-testid="avatar-uri-input"
            />
          </InputContainer>
        </Container>
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button
            colorStyle="accentSecondary"
            onClick={handleCancel}
            data-testid="avatar-manual-cancel"
          >
            Cancel
          </Button>
        }
        trailing={
          <Button onClick={onSubmit} disabled={!uri || !!error} data-testid="avatar-manual-submit">
            Confirm
          </Button>
        }
      />
    </>
  )
}
