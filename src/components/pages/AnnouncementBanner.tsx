import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Typography } from '@ensdomains/thorin'

const Container = styled(Link)(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    width: ${theme.space.full};
    max-width: 466px;
    padding: ${theme.space['4']};
    align-items: center;
    gap: ${theme.space['4']};
    align-self: center;
    border-radius: ${theme.radii['2xLarge']};
    background-color: ${theme.colors.backgroundPrimary};
  `,
)

const Text = styled.span(
  ({ theme }) => css`
    width: ${theme.space.full};
  `,
)

export const AnnouncementBanner = () => {
  const { t } = useTranslation('ensv2')

  return (
    <Container href="/ens-v2">
      <img src="/migrate/confetti.png" alt="" height={33} width={33} />
      <Text>
        <Typography fontVariant="largeBold">{t('banner.title')}</Typography>
        <Typography fontVariant="small" color="grey">
          {t('banner.caption')}
        </Typography>
      </Text>
      <Button colorStyle="greenPrimary" width="max">
        {t('banner.cta')}
      </Button>
    </Container>
  )
}
