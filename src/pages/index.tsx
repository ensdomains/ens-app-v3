import { SearchInput } from '@app/components/SearchInput'
import { Basic } from '@app/layouts/Basic'
import mq from '@app/mediaQuery'
import { tokens, Typography } from '@ensdomains/thorin'
import type { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import styled from 'styled-components'

const GradientTitle = styled.h1`
  font-size: ${tokens.fontSizes.headingTwo};
  text-align: center;
  font-weight: 800;
  background-image: ${({ theme }) => tokens.colors[theme.mode].accentGradient};
  background-repeat: no-repeat;
  background-size: 110%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;

  ${mq.small.min`
    font-size: ${tokens.fontSizes.headingOne};
  `}
`

const SubtitleWrapper = styled.div`
  max-width: calc(${tokens.space['72']} * 2 - ${tokens.space['4']});
  line-height: 150%;
  text-align: center;
  margin-bottom: ${tokens.space['3']};
`

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%:
`

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-gap: ${tokens.space['3']};
  gap: ${tokens.space['3']};
`

const Description = styled(Typography)`
  line-height: ${tokens.lineHeights['1.5']};
`

const Home: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <Basic>
      <Container>
        <Stack>
          <GradientTitle>{t('title')}</GradientTitle>
          <SubtitleWrapper>
            <Description variant="large" color="textSecondary">
              {t('description')}
            </Description>
          </SubtitleWrapper>
          <SearchInput />
        </Stack>
      </Container>
    </Basic>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  }
}

export default Home
