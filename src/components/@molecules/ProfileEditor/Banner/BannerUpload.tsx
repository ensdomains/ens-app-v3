import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, Typography } from '@ensdomains/thorin'

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

const BannerPreview = styled.div<{ $src?: string }>(
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

export const BannerUpload = ({
  handleCancel,
  handleSubmit,
  banner,
}: {
  handleCancel: () => void
  handleSubmit: (type: 'upload', uri: string, display?: string) => void
  banner: File
}) => {
  const { t } = useTranslation('common')
  const previewUrl = URL.createObjectURL(banner)

  // This is a simplified version. In a real implementation, you would add image upload functionality
  return (
    <>
      <Dialog.Heading title="Upload Banner Image" />
      <Dialog.Content>
        <Container>
          <BannerPreview $src={previewUrl} />
          <Typography>
            Banner upload is not fully implemented in this simplified version.
          </Typography>
          <Typography>
            In a full implementation, this would allow uploading and cropping a banner image with a
            3:1 aspect ratio.
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
          <Button onClick={() => handleSubmit('upload', previewUrl, previewUrl)}>
            {t('action.save')}
          </Button>
        }
      />
    </>
  )
}
