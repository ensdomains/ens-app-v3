import { NameSnippetMobile } from '@app/components/profile/NameSnippetMobile'
import { OwnerButton } from '@app/components/profile/OwnerButton'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { Basic } from '@app/layouts/Basic'
import mq from '@app/mediaQuery'
import type { GetStaticPaths, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { useAccount, useNetwork } from 'wagmi'

const GridItem = styled.div<{ $area: string }>`
  grid-area: ${({ $area }) => $area};
`

const WrapperGrid = styled.div<{ $hasError?: boolean }>`
  flex-grow: 1;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space['5']};
  align-self: center;
  ${({ $hasError }) => css`
    grid-template-areas: ${$hasError ? "'error error'" : ''} 'details details' 'content content';
    ${mq.medium.min`
      grid-template-areas: ${
        $hasError ? "'error error'" : ''
      } "details content";
      grid-template-columns: 270px 2fr;
    `}
  `}
`

const DetailsContainer = styled(GridItem)`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: ${theme.space['1']};
  `}
`

const OwnerButtons = styled.div`
  ${({ theme }) => `
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: stretch;
    gap: ${theme.space['1']};
    flex-gap: ${theme.space['1']};
  `}
`

const NameDetails: NextPage = () => {
  const router = useRouter()
  const name = router.query.name as string

  const { activeChain: chain } = useNetwork()
  const { data: accountData, isLoading: accountLoading } = useAccount()
  const address = accountData?.address

  const {
    normalisedName,
    expiryDate,
    ownerData,
    isLoading: detailsLoading,
  } = useNameDetails(name)

  const canSend = useMemo(() => {
    if (!address || !ownerData) return false
    if (
      ownerData.registrant === address ||
      (!ownerData.registrant && ownerData.owner === address)
    ) {
      return true
    }
  }, [address, ownerData])

  const isLoading = detailsLoading || accountLoading

  return (
    <Basic
      heading={normalisedName}
      subheading="Name Details"
      loading={isLoading}
      title={`${normalisedName} - `}
    >
      <WrapperGrid>
        <DetailsContainer $area="details">
          <NameSnippetMobile
            expiryDate={expiryDate}
            name={normalisedName}
            network={chain?.name!}
            canSend={canSend}
          />
          <OwnerButtons>
            {ownerData?.owner && (
              <OwnerButton
                address={ownerData.owner}
                network={chain?.name!}
                label={
                  ownerData.ownershipLevel === 'nameWrapper'
                    ? 'Owner'
                    : 'Controller'
                }
              />
            )}
            {ownerData?.registrant && (
              <OwnerButton
                address={ownerData.registrant}
                network={chain?.name!}
                label="Registrant"
              />
            )}
          </OwnerButtons>
        </DetailsContainer>
      </WrapperGrid>
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

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default NameDetails
