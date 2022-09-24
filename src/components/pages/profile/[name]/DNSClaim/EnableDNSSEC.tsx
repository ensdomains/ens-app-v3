import { useRouter } from 'next/router'
import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Dropdown, Helper, Typography } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { Outlink } from '@app/components/Outlink'

import { Steps } from './Steps'
import { ButtonContainer, CheckButton } from './shared'
import { isDnsSecEnabled } from './utils'

const Container = styled.div(
  ({ theme }) => css`
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
)

const HelperLinks = [
  {
    label: 'Namecheap',
    href: 'https://www.namecheap.com/support/knowledgebase/article.aspx/9722/2232/managing-dnssec-for-domains-pointed-to-custom-dns/',
  },
  {
    label: 'Domain.com',
    href: 'https://manage.vip.domain.com/kb/answer/1909',
  },
  {
    label: 'Google domains',
    href: 'https://support.google.com/domains/answer/6387342',
  },
  {
    label: 'Dreamhost',
    href: 'https://help.dreamhost.com/hc/en-us/articles/219539467-DNSSEC-overview',
  },
  {
    label: 'Hover',
    href: 'https://help.hover.com/hc/en-us/articles/217281647-DNSSEC-services',
  },
  {
    label: 'GoDaddy',
    href: 'https://godaddy.com/help/enable-dnssec-on-my-domain-6420',
  },
  {
    label: 'Bluehost',
    href: 'https://cp.cn.bluehost.com/kb/answer/1909',
  },
  {
    label: 'HostGator',
    href: 'https://www.hostgator.com/help/article/resellerclub-dnssec-domain-name-system-security-extensions',
  },
]

enum Errors {
  NOT_CHECKED,
  DNSSEC_NOT_ENABLED,
}

export const EnableDNSSEC = ({ currentStep, stepStatus, setCurrentStep }) => {
  const [errorState, setErrorState] = useState(Errors.NOT_CHECKED)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { name } = router.query

  const handleCheck = async () => {
    setIsLoading(true)
    const hasDnsSecEnabled = await isDnsSecEnabled(name)
    if (hasDnsSecEnabled) {
      setCurrentStep(1)
      return
    }
    setErrorState(Errors.DNSSEC_NOT_ENABLED)
    setIsLoading(false)
  }

  return (
    <Container>
      <Typography variant="extraLarge" weight="bold">
        Enable DNS SEC
      </Typography>
      <Spacer $height="4" />
      <Typography>
        You’ll need to visit your domain registrar to enable DNSSEC. Once enabled, click 'Check' to
        move to the next step.{' '}
      </Typography>
      <Spacer $height="3" />
      <Typography>
        Choose your registrar from the dropdown below for instructions on how to do this.{' '}
      </Typography>
      <Spacer $height="5" />
      <Dropdown
        align="left"
        items={HelperLinks.map((link) => ({
          label: link.label,
          onClick: () => null,
          wrapper: (children, key) => (
            <a href={link.href} target="_blank" key={key} rel="noreferrer">
              {children}
            </a>
          ),
        }))}
        label="Domain Registrar"
      />
      <Spacer $height="3" />
      <Outlink target="_blank" href={`https://who.is/whois/${name}`}>
        Find your registrar
      </Outlink>
      <Spacer $height="5" />
      {errorState === Errors.DNSSEC_NOT_ENABLED && (
        <>
          <Helper type="info">DNSSEC has not been enabled on this domain.</Helper>
          <Spacer $height="6" />
        </>
      )}
      <Steps
        {...{
          currentStep: 0,
          stepStatus: ['inProgress', 'notStarted', 'notStarted', 'notStarted'],
        }}
      />
      <Spacer $height="5" />
      <ButtonContainer>
        <CheckButton
          onClick={handleCheck}
          variant="primary"
          size="small"
          disabled={currentStep === 2}
          loading={isLoading}
        >
          Check
        </CheckButton>
      </ButtonContainer>
    </Container>
  )
}
