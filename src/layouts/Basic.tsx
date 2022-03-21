import { Footer } from '@app/components/Footer'
import { LoadingOverlay } from '@app/components/LoadingOverlay'
import { Box } from '@ensdomains/thorin'
import Head from 'next/head'
import { Header } from '../components/Header'

export const Basic = ({
  loading = false,
  children,
  title,
}: {
  loading?: boolean
  children: React.ReactNode
  title?: string
}) => {
  return (
    <Box
      paddingX={{ xs: '8', sm: '16' }}
      paddingY={{ xs: '10', sm: '12' }}
      display="flex"
      gap="8"
      flexDirection="column"
      alignItems="stretch"
      minWidth="full"
      minHeight="viewHeight"
    >
      <Head>
        <title>{title ? `${title} - ` : ''}ENS App</title>
      </Head>
      <Header />
      <Box flexGrow={1} display="flex" flexDirection="column">
        {loading ? <LoadingOverlay /> : children}
      </Box>

      <Footer />
    </Box>
  )
}
