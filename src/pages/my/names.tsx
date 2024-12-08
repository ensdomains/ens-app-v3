import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Banner, QuestionCircleSVG } from '@ensdomains/thorin'

import { NameListView } from '@app/components/@molecules/NameListView/NameListView'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'

const ContentContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[6]};

    & > *:nth-child(2) svg {
      color: var(--thorin-color-indigoPrimary);
    }
  `,
)

export default function Page() {
  const { t } = useTranslation('names')
  const router = useRouter()
  const { address, isConnecting, isReconnecting } = useAccount()

  const isLoading = !router.isReady || isConnecting || isReconnecting

  useProtectedRoute('/', isLoading ? true : address && (address as any) !== '')

  return (
    <Content title={t('title')} singleColumnContent loading={isLoading}>
      {{
        trailing: (
          <ContentContainer>
            <NameListView address={address} selfAddress={address} />
            <Banner
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://support.ens.domains/en/articles/9375254-why-is-my-ens-name-not-in-my-names"
              icon={QuestionCircleSVG}
              title={t('offchainWarning.title')}
            >
              {t('offchainWarning.text')}
            </Banner>
          </ContentContainer>
        ),
      }}
    </Content>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
