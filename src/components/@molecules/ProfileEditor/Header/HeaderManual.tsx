import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, Input, Typography } from '@ensdomains/thorin'

import { validateImageUri } from '@app/validators/validateImageUri'

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
    height: 150px;
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
      <Dialog.Heading title="Enter Header URL" />
      <Dialog.Content>
        <Container>
          <HeaderPreview $src={uri} />
          <Input
            label="Header URL"
            placeholder="https:// or ipfs://"
            value={uri}
            onChange={handleUriChange}
            error={error}
            autoFocus
          />
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
          <Button onClick={onSubmit} disabled={!uri || !!error}>
            {t('action.save')}
          </Button>
        }
      />
    </>
  )
}
