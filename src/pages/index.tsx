import Head from 'next/head'
import { useTranslation } from 'react-i18next'

import { Box, BoxProps, cssVars, Typography } from '@ensdomains/thorin'

import { GradientText } from '@app/components/@atoms/GradientText/GradientText'
import FaucetBanner from '@app/components/@molecules/FaucetBanner'
import Hamburger from '@app/components/@molecules/Hamburger/Hamburger'
import { SearchInput } from '@app/components/@molecules/SearchInput/SearchInput'

import ENSFull from '../assets/ENSFull.svg'

const Container = (props: BoxProps) => (
  <Box
    {...props}
    flexGrow={1}
    display="flex"
    alignItems="center"
    justifyContent="center"
    width="$full"
  />
)

const Stack = (props: BoxProps) => (
  <Box
    {...props}
    display="flex"
    flexDirection="column"
    gap="$3"
    alignItems="center"
    justifyContent="center"
  />
)

export default function Page() {
  const { t } = useTranslation('common')

  return (
    <>
      <Head>
        <title>ENS</title>
      </Head>
      <Box
        display={{ base: 'flex', sm: 'none' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box as={ENSFull} height="$8.5" />
        <Hamburger />
      </Box>
      <FaucetBanner />
      <Container>
        <Stack>
          <GradientText
            as="h1"
            fontSize={{ base: '$headingTwo', sm: '$headingOne' }}
            textAlign="center"
            fontWeight="800"
          >
            {t('title')}
          </GradientText>
          <Typography
            fontVariant="large"
            color="grey"
            maxWidth={`calc(${cssVars.space['72']} * 2 - ${cssVars.space['4']} )`}
            lineHeight="150%"
            textAlign="center"
            marginBottom="$3"
          >
            {t('description')}
          </Typography>
          <SearchInput />
        </Stack>
      </Container>
    </>
  )
}
