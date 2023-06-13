import Head from 'next/head'
import styled, { css } from 'styled-components'

import { Button, OutlinkSVG, Typography, mq } from '@ensdomains/thorin'

import Hamburger from '@app/components/@molecules/Hamburger/Hamburger'
import { LeadingHeading } from '@app/components/LeadingHeading'
import { SectionCard } from '@app/components/pages/roadmap/SectionCard'
import { SplitHeader } from '@app/components/pages/roadmap/SplitHeader'
import completed from '@app/components/pages/roadmap/content/completed.json'
import inProgress from '@app/components/pages/roadmap/content/inProgress.json'
import onPause from '@app/components/pages/roadmap/content/onPause.json'
import upNext from '@app/components/pages/roadmap/content/upNext.json'

import ENSFull from '../assets/ENSFull.svg'

const Container = styled.div(({ theme }) => [
  css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};
  `,
  mq.sm.min(css`
    gap: ${theme.space['10']};
  `),
])

const StyledENS = styled.div(
  ({ theme }) => css`
    height: ${theme.space['8.5']};
  `,
)

const LogoAndLanguage = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};
    flex-gap: ${theme.space['4']};
  `,
)

const StyledLeadingHeading = styled(LeadingHeading)(
  () => css`
    ${mq.sm.min(
      css`
        display: none;
      `,
    )}
  `,
)

export default function Page() {
  return (
    <>
      <Head>
        <title>ENS</title>
      </Head>
      <StyledLeadingHeading>
        <LogoAndLanguage>
          <StyledENS as={ENSFull} />
        </LogoAndLanguage>
        <Hamburger />
      </StyledLeadingHeading>
      <Container>
        <SplitHeader
          leading={<Typography fontVariant="headingOne">ENS Labs roadmap</Typography>}
          trailing={<Button suffix={<OutlinkSVG />}>Feature requests</Button>}
        />
        {completed.length > 0 && (
          <SectionCard
            title="Completed"
            description="What we've done that is now live."
            items={completed}
            color="green"
          />
        )}
        {inProgress.length > 0 && (
          <SectionCard
            title="In progress"
            description="You'll see these soon because we're working on them."
            items={inProgress}
            color="blue"
          />
        )}
        {upNext.length > 0 && (
          <SectionCard
            title="Up next"
            description="We're going to discuss these next. This list is in no particular order."
            items={upNext}
            color="blue"
          />
        )}
        {onPause.length > 0 && (
          <SectionCard
            title="On pause"
            description="We began discussing or working on these, but have paused them to focus on other priorities."
            items={onPause}
            color="yellow"
          />
        )}
      </Container>
    </>
  )
}
