import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useQuery } from 'wagmi'

import { Button, Card, Typography, mq } from '@ensdomains/thorin'

import ArrowLeftSVG from '@app/assets/ArrowLeft.svg'
import { Spacer } from '@app/components/@atoms/Spacer'
import { HamburgerRoutes } from '@app/components/@molecules/HamburgerRoutes'
import { LeadingHeading } from '@app/components/LeadingHeading'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useEns } from '@app/utils/EnsProvider'

import { AddTextRecord } from './AddTextRecord'
import { ClaimComplete } from './ClaimComplete'
import { ClaimDomain } from './ClaimDomain'
import { EnableDNSSEC } from './EnableDNSSEC'
import { isDnsSecEnabled } from './utils'

const DNS_OVER_HTTP_ENDPOINT = 'https://1.1.1.1/dns-query?'

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

/*
class DNSRegistrar {
  constructor(oracleAddress, isOld = false) {
    this.oracleAddress = oracleAddress
    this.isOld = isOld
    if (isOld) {
      this.OracleClass = OldOracle
    } else {
      this.OracleClass = NewOracle
    }
  }
   async claim(name) {
    const encodedName = '0x' + packet.name.encode(name).toString('hex')
    const textDomain = '_ens.' + name
    const prover = DNSProver.create('https://cloudflare-dns.com/dns-query')
    const provider = await getProvider()
    return new Claim({
      oracle: new this.OracleClass(this.oracleAddress, provider),
      result: await prover.queryWithProof('TXT', textDomain),
      isFound: true,
      textDomain: textDomain,
      encodedName: encodedName
    })
  }
}
*/

const dnsSecModes = [
  // 0
  {
    state: 'ENABLE_DNSSEC',
    title: 'Problem fetching data from DNS',
    displayError: true,
  },
  // 1
  {
    state: 'ENABLE_DNSSEC',
    title: 'DNS entry does not exist.',
    displayError: true,
  },
  // 2
  {
    state: 'ENABLE_DNSSEC',
    title: 'Please enable DNSSEC',
  },
  // 3
  {
    state: 'ADD_TEXT',
    title: 'Please add text record into _ens.name.tld',
  },
  // 4,
  {
    state: 'ADD_TEXT',
    title: 'DNS Record is invalid',
    displayError: true,
  },
  // 5,
  {
    state: 'SUBMIT_PROOF',
    title: 'Ready to register',
    explainer: "*Click 'refresh' if you make changes to the domain in the DNS Registrar.",
  },
  // 6,
  {
    state: 'SUBMIT_PROOF',
    title: 'DNS is out of sync',
    explainer:
      "The Controller and DNS Owner are out of sync. Click 'sync' to make the DNS Owner the Controller. Click 'refresh' if you make changes to the domain in the DNS Registrar.",
    outOfSync: true,
  },
  // 7,
  {
    state: 'SUBMIT_PROOF',
    title: 'Registry is out of date',
    explainer:
      "Click 'sync' to make the DNS Owner the Controller. Click 'refresh' if you make changes to the domain in the DNS Registrar.",
    outOfSync: true,
  },
  // 8,
  {
    state: 'ADD_TEXT',
    title: 'DNS Record does not exist',
    displayError: true,
  },
]

export default () => {
  const router = useRouter()
  const breakpoints = useBreakpoint()
  const [currentStep, setCurrentStep] = useState(0)
  const [syncWarning, setSyncWarning] = useState(false)
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
  const [stepStatus, setStepStatus] = useState(['inProgress', 'notStarted', 'notStarted'])
  const { getOwner } = useEns()
  const { data: ownership, isLoading } = useQuery([name, 'DNSClaim', 'getOwner'], () =>
    getOwner(name as string),
  )

  const { name } = router.query

  const owner = ownership?.owner

  useEffect(() => {
    const textDomain = `_ens.${name}`
    let dnsRegistrarState = 0

    const init = async () => {
      try {
        const hasDnsSecEnabled = await isDnsSecEnabled(name)
        if (!hasDnsSecEnabled) {
          setCurrentStep(0)
          return
        }
        // setCurrentStep(3)
      } catch (e) {
        console.error('caught error: ', e)
        dnsRegistrarState = 0
      }
    }
    init()

    console.log('dnsRegistrarState:', dnsRegistrarState)
  }, [dnsOwner])

  console.log('currentStep: ', currentStep)

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
        {currentStep === 0 && <EnableDNSSEC {...{ currentStep, stepStatus, setCurrentStep }} />}
        {currentStep === 1 && (
          <AddTextRecord
            {...{ currentStep, stepStatus, setCurrentStep, syncWarning, setSyncWarning }}
          />
        )}
        {currentStep === 2 && (
          <ClaimDomain {...{ currentStep, stepStatus, setCurrentStep, syncWarning }} />
        )}
        {currentStep === 3 && <ClaimComplete {...{ currentStep, stepStatus, setCurrentStep }} />}
      </MainContentContainer>
    </Container>
  )
}
