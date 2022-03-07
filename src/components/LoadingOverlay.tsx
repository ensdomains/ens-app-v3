import { Box, Spinner, Typography } from '@ensdomains/thorin'
import { useTranslation } from 'next-i18next'

export const LoadingOverlay = () => {
  const { t } = useTranslation('common')

  return (
    <Box
      flexGrow={1}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="row"
      gap="4"
    >
      <Typography size="headingOne" weight="bold">
        {t('loading')}
      </Typography>
      <Spinner size="large" color="accent" />
    </Box>
  )
}
