import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Address } from 'viem'

import { NameListView } from '@app/components/@molecules/NameListView/NameListView'
import NoProfileSnippet from '@app/components/address/NoProfileSnippet'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { usePrimaryProfile } from '@app/hooks/usePrimaryProfile'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { shortenAddress } from '@app/utils/utils'

import { useAccountSafely } from '../hooks/account/useAccountSafely'

const DetailsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
  `,
)

const Page = () => {
  const { t } = useTranslation('address')
  const router = useRouter()
  const { isReady, query } = router
  const { address: _address } = useAccountSafely()

  const address = query.address as Address
  const isSelf = _address === address

  const { data: primaryProfile, isLoading: isPrimaryProfileLoading } = usePrimaryProfile({
    address,
  })

  const [isError, setIsError] = useState(false)

  const getTextRecord = (key: string) => primaryProfile?.texts?.find((x) => x.key === key)

  const loading = !isReady || isPrimaryProfileLoading

  const error = isError ? t('errors.names') : ''

  return (
    <Content title={shortenAddress(address)} copyValue={address} loading={loading}>
      {{
        warning: error
          ? {
              type: 'warning',
              message: error,
            }
          : undefined,
        leading: (
          <DetailsContainer>
            {primaryProfile?.name ? (
              <ProfileSnippet
                name={primaryProfile.name}
                button="viewProfile"
                getTextRecord={getTextRecord}
              />
            ) : (
              <NoProfileSnippet />
            )}
          </DetailsContainer>
        ),
        trailing: <NameListView address={address} isSelf={isSelf} setError={setIsError} />,
      }}
    </Content>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}

export default Page
