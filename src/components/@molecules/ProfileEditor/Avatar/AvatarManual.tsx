import { useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Button, Dialog, Input, Typography } from '@ensdomains/thorin'

import { Outlink } from '@app/components/Outlink'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import { validateImageUri } from '@app/validators/validateImageUri'
import { imageUrlReturnsImage } from '@app/validators/validateImageUrl'

const NOT_AN_IMAGE_ERROR = 'This URL does not return an image'

const Container = styled.div(
  () => css`
    width: 100%;
    min-width: 18.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
)

const AvatarPreview = styled.div<{ $src?: string }>(
  ({ theme, $src }) => css`
    width: 7.5rem;
    height: 7.5rem;
    border-radius: ${theme.radii.full};
    background-color: ${theme.colors.greyLight};
    background-image: ${$src ? `url(${$src})` : 'none'};
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
    margin-bottom: ${theme.space['4']};
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
  const [isValidating, setIsValidating] = useState(false)
  // Holds the most recent input value so stale async results can be ignored.
  const latestUriRef = useRef('')

  const validateUri = (value: string) => {
    const validationResult = validateImageUri(value)

    if (validationResult === true) {
      setError(undefined)
      return true
    }

    setError(validationResult as string)
    return false
  }

  // Debounced async check that the URL actually returns an image. Runs only
  // after the user stops typing, and ignores results for a value that has since
  // changed (rapid retyping must not surface a stale error).
  const runImageCheck = useDebouncedCallback(async (value: string) => {
    const returnsImage = await imageUrlReturnsImage(value)
    if (latestUriRef.current !== value) return
    setIsValidating(false)
    if (!returnsImage) setError(NOT_AN_IMAGE_ERROR)
  }, 450)

  const handleUriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setUri(newValue)
    latestUriRef.current = newValue

    // Synchronous format validation is the first gate, applied immediately.
    const validationResult = validateImageUri(newValue)
    if (validationResult !== true) {
      setIsValidating(false)
      setError(validationResult as string)
      return
    }

    // Format is valid — clear any prior error and verify it returns an image.
    setError(undefined)
    setIsValidating(true)
    runImageCheck(newValue)
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
          <AvatarPreview $src={uri} />
          <Typography fontVariant="body" textAlign="center" color="textSecondary">
            Manual entry supports NFT, https, IPFS, and data URLs.
            <Outlink href="https://docs.ens.domains/ensip/12" iconPosition="after">
              Learn more about avatar URLs
            </Outlink>
          </Typography>
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
            {isValidating && (
              <Typography
                fontVariant="small"
                color="textSecondary"
                data-testid="avatar-uri-validating"
              >
                Checking image...
              </Typography>
            )}
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
          <Button
            onClick={onSubmit}
            disabled={!uri || !!error || isValidating}
            data-testid="avatar-manual-submit"
          >
            Confirm
          </Button>
        }
      />
    </>
  )
}
