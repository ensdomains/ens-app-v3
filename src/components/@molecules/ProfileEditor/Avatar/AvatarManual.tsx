import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Button, Dialog, Input, Typography } from '@ensdomains/thorin'

import { Outlink } from '@app/components/Outlink'

const Container = styled.div(
  ({ theme }) => css`
    width: 100%;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
)

const Title = styled(Typography)(
  ({ theme }) => css`
    font-weight: ${theme.fontWeights.bold};
    text-align: center;
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
  name,
  handleCancel,
  handleSubmit,
}: {
  name: string
  handleCancel: () => void
  handleSubmit: (type: 'nft' | 'upload' | 'manual', uri: string, display?: string) => void
}) => {
  const [uri, setUri] = useState('')
  const [error, setError] = useState<string | undefined>()

  const validateUri = (value: string) => {
    if (!value) {
      setError('URI is required')
      return false
    }

    // Basic validation for common URI formats
    const isValidUri =
      value.startsWith('https://') ||
      value.startsWith('ipfs://') ||
      value.startsWith('data:') ||
      value.startsWith('eip155:')

    if (!isValidUri) {
      setError('Invalid URI format')
      return false
    }

    setError(undefined)
    return true
  }

  const handleUriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUri(e.target.value)
    if (error) validateUri(e.target.value)
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
              placeholder="https://, ipfs://, data:, or eip155:"
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
          <Button onClick={onSubmit} disabled={!uri} data-testid="avatar-manual-submit">
            Confirm
          </Button>
        }
      />
    </>
  )
}
