import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, Input, Typography } from '@ensdomains/thorin'

import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import { validateImageUri } from '@app/validators/validateImageUri'
import { imageUrlReturnsImage } from '@app/validators/validateImageUrl'

const NOT_AN_IMAGE_ERROR = 'This URL does not return an image'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};
    width: 100%;
  `,
)

const HeaderPreview = styled.div<{ $src?: string }>(
  ({ theme, $src }) => css`
    width: 100%;
    height: 9.375rem;
    border-radius: ${theme.radii.large};
    background-color: ${theme.colors.greyLight};
    background-image: ${$src ? `url(${$src})` : 'none'};
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
    margin-bottom: ${theme.space['4']};
  `,
)

export const HeaderManual = ({
  handleCancel,
  handleSubmit,
}: {
  handleCancel: () => void
  handleSubmit: (type: 'manual', uri: string, display?: string) => void
}) => {
  const [uri, setUri] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [isValidating, setIsValidating] = useState(false)
  // Holds the most recent input value so stale async results can be ignored.
  const latestUriRef = useRef('')
  const { t } = useTranslation('common')

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
      <Dialog.Heading title="Enter Header URL" />
      <Dialog.Content>
        <Container>
          <HeaderPreview $src={uri} />
          <Input
            label="Header URL"
            data-testid="header-manual-input"
            placeholder="https:// or ipfs://"
            value={uri}
            onChange={handleUriChange}
            error={error}
            autoFocus
          />
          {isValidating && (
            <Typography
              fontVariant="small"
              color="textSecondary"
              data-testid="header-manual-validating"
            >
              Checking image...
            </Typography>
          )}
          <Typography color="grey">
            Enter a URL to an image file. The image should have a 3:1 aspect ratio for best results.
          </Typography>
        </Container>
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={handleCancel}>
            {t('action.cancel')}
          </Button>
        }
        trailing={
          <Button onClick={onSubmit} disabled={!uri || !!error || isValidating}>
            {t('action.save')}
          </Button>
        }
      />
    </>
  )
}
