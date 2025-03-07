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

export const HeaderNFT = ({
  handleCancel,
  handleSubmit,
  name,
}: {
  handleCancel: () => void
  handleSubmit: (type: 'nft', uri: string, display?: string) => void
  name: string
}) => {
  const { t } = useTranslation('common')

  // This is a simplified version. In a real implementation, you would add NFT selection functionality
  return (
    <>
      <Dialog.Heading title="Select NFT for Header" />
      <Dialog.Content>
        <Container>
          <Typography>
            NFT selection for header is not implemented in this simplified version.
          </Typography>
          <Typography>
            In a full implementation, this would allow selecting an NFT to use as a header image.
          </Typography>
        </Container>
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={handleCancel}>
            {t('action.cancel')}
          </Button>
        }
        trailing={<Button onClick={handleCancel}>{t('action.back')}</Button>}
      />
    </>
  )
}
