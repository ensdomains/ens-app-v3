import * as packet from 'dns-packet'
import { utils } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useQuery } from 'wagmi'

import { DNSProver } from '@ensdomains/dnsprovejs'
import { Button, Card, Typography, mq } from '@ensdomains/thorin'

import ArrowLeftSVG from '@app/assets/ArrowLeft.svg'
import { Spacer } from '@app/components/@atoms/Spacer'
import { HamburgerRoutes } from '@app/components/@molecules/HamburgerRoutes'
import { LeadingHeading } from '@app/components/LeadingHeading'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useEns } from '@app/utils/EnsProvider'

import { EnableDNSSEC } from './EnableDNSSEC'

const BackArrow = styled.div(
  ({ theme }) => css`
    width: ${theme.space['6']};
    height: ${theme.space['6']};
    display: block;
  `,
)

const HeadingItems = styled.div<{ $spacing: string }>(
  ({ theme, $spacing }) => css`
    grid-column: span 1;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: ${theme.space['5']};
    align-self: center;
    align-items: center;
    min-height: ${theme.space['15']};
    ${mq.md.min(css`
      min-height: ${theme.space['10']};
      grid-column: span 2;
      grid-template-columns: ${$spacing};
    `)}
  `,
)

const CustomLeadingHeading = styled(LeadingHeading)(
  ({ theme }) => `
    
  `,
)

const ContentContainer = styled.div<{ $multiColumn?: boolean }>(
  ({ $multiColumn }) => css`
    margin: 0;
    padding: 0;
    min-height: 0;
    height: min-content;
    ${$multiColumn &&
    mq.sm.min(css`
      grid-column: span 2;
    `)}
  `,
)

const TitleContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
)

const TitleWrapper = styled.div<{ $invert: boolean }>(
  ({ $invert }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;

    ${TitleContainer} {
      align-items: flex-start;
    }

    ${$invert &&
    css`
      flex-direction: row-reverse;

      ${TitleContainer} {
        align-items: flex-end;
      }
    `}
  `,
)

const spacing = '270px 2fr'

const title = 'title'
const subtitle = 'subtitle'

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
    line-height: ${theme.lineHeights.normal};
  `,
)

const Subtitle = styled(Typography)(
  ({ theme }) => css`
    line-height: ${theme.lineHeights.normal};
    color: ${theme.colors.textTertiary};
  `,
)

const alwaysShowSubtitle = false

const Container = styled.div(
  ({ theme }) => css`
    width: 650px;
    box-sizing: border-box;
    margin: 0 auto;
    grid-column: 1/-1;
    grid-auto-rows: 1fr;
  `,
)

const MainContentContainer = styled(Card)(
  ({ theme }) => css`
    width: 100%;
    padding: 25px 75px;
  `,
)

const HeadingContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
)

const AddTextRecord = ({ currentStep }) => {
  return <div>Add Text records</div>
}

const ClaimDomain = ({ currentStep }) => {
  return <div>Claim Domain</div>
}

export default () => {
  const router = useRouter()
  const breakpoints = useBreakpoint()

  const [currentStep, setCurrentStep] = useState(0)

  console.log('router:', router.query.name)

  const {
    isLoading: detailsLoading,
    error,
    profile,
    ownerData,
    expiryDate,
    normalisedName,
    dnsOwner,
    valid,
    basicIsCachedData,
    profileIsCachedData,
  } = useNameDetails(router.query.name as string)

  const { getOwner } = useEns()
  const { name } = router.query

  const { data: ownership, isLoading } = useQuery([name, 'DNSClaim', 'getOwner'], () =>
    getOwner(name as string),
  )

  const owner = ownership?.owner

  useEffect(() => {
    // const prover = DNSProver.create('https://cloudflare-dns.com/dns-query')
    const textDomain = `_ens.${name}`
    // const result = prover.queryWithProof('TXT', textDomain)
    let dnsRegistrarState = 0

    if (dnsOwner || parseInt(dnsOwner) === 0) {
      // Empty
      dnsRegistrarState = 8
    } else if (!utils.isAddress(dnsOwner)) {
      // Invalid record
      dnsRegistrarState = 4
    } else if (!owner || dnsOwner.toLowerCase() === owner.toLowerCase()) {
      // Ready to register
      dnsRegistrarState = 5
    } else {
      // Out of sync
      dnsRegistrarState = 6
    }

    console.log('dnsRegistrarState:', dnsRegistrarState)
  }, [dnsOwner])

  return (
    <Container>
      <HeadingContainer>
        {router.query.from && (
          <div data-testid="back-button">
            <Button
              onClick={() => router.back()}
              variant="transparent"
              shadowless
              size="extraSmall"
            >
              <BackArrow as={ArrowLeftSVG} />
            </Button>
          </div>
        )}
        <ContentContainer>
          <TitleWrapper $invert={!!router.query.from}>
            <TitleContainer>
              <Title weight="bold">Claim {router.query.name}</Title>
              {subtitle && (!breakpoints.md || alwaysShowSubtitle) && (
                <Subtitle weight="bold">{subtitle}</Subtitle>
              )}
            </TitleContainer>
          </TitleWrapper>
        </ContentContainer>
        {!router.query.from && !breakpoints.md && <HamburgerRoutes />}
      </HeadingContainer>
      <Spacer $height={4} />
      <MainContentContainer>
        {currentStep === 0 && <EnableDNSSEC {...{ currentStep }} />}
        {currentStep === 1 && <AddTextRecord {...{ currentStep }} />}
        {currentStep === 2 && <ClaimDomain {...{ currentStep }} />}
      </MainContentContainer>
    </Container>
  )
}
