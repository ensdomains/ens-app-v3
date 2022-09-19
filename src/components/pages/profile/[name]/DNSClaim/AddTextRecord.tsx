import { utils } from 'ethers'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { DNSProver } from '@ensdomains/dnsprovejs'
import { Button, Helper, Typography } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { IconCopyAnimated } from '@app/components/IconCopyAnimated'
import { Outlink } from '@app/components/Outlink'
import { useCopied } from '@app/hooks/useCopied'

import { DNS_OVER_HTTP_ENDPOINT, getDnsOwner, isSubdomainSet } from './utils'

const Container = styled.div(
  ({ theme }) => css`
    text-align: center;
  `,
)

const StyledButton = styled(Button)(
  ({ theme }) => css`
    padding: ${theme.space['0']} -${theme.space['1.5']};
  `,
)

const ButtonInner = styled.div(
  () => css`
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
  `,
)

const ButtonRow = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    gap: 10px;
  `,
)

const CopyableRightContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  `,
)

const Copyable = ({ label, value }) => {
  const { copy, copied } = useCopied()
  return (
    <StyledButton
      outlined
      fullWidthContent
      shadowless
      variant="transparent"
      onClick={() => copy(value)}
    >
      <ButtonInner>
        <Typography>{label}</Typography>
        <CopyableRightContainer>
          <Typography {...{ variant: 'small', color: 'foreground' }}>{value}</Typography>
          <IconCopyAnimated color="textTertiary" copied={copied} size="3.5" />
        </CopyableRightContainer>
      </ButtonInner>
    </StyledButton>
  )
}

// Remember to check if domain has been secured by DNSSEC
const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;

    & > button {
      margin: 0;
    }
  `,
)

const CheckButton = styled(Button)(
  ({ theme }) => css`
    width: 150px;
    margin: 0 auto;
  `,
)

enum Errors {
  NOT_CHECKED,
  SUBDOMAIN_NOT_SET,
  DNS_RECORD_DOES_NOT_EXIST,
  DNS_RECORD_INVALID,
}

export const AddTextRecord = ({ currentStep, setCurrentStep }) => {
  const router = useRouter()
  const { name } = router.query
  const { address } = useAccount()
  const { errorState, setErrorState } = useState<Errors>(Errors.NOT_CHECKED)
  const [syncWarning, setSyncWarning] = useState(false)

  const handleCheck = async () => {
    try {
      const state = 0
      isSubdomainSet(name as string)
      const prover = DNSProver.create(DNS_OVER_HTTP_ENDPOINT)
      const result = await prover.queryWithProof('TXT', `_ens.${name}`)
      const dnsOwner = getDnsOwner(result)
      console.log('result: ', result)
      console.log('dnsOwner: ', dnsOwner)

      if (parseInt(dnsOwner) === 0) {
        setSyncWarning(false)
        // State 8
        setErrorState(Errors.DNS_RECORD_DOES_NOT_EXIST)
      } else if (!utils.isAddress(dnsOwner)) {
        setSyncWarning(false)
        // State 4
        setErrorState(Errors.DNS_RECORD_INVALID)
      } else if (dnsOwner.toLowerCase() === address?.toLowerCase()) {
        setSyncWarning(false)
        // State 5
        setCurrentStep(currentStep + 1)
      } else {
        // Out of sync (state 6)
        console.log('Controllder and DNS Owner are out of sync')
        if (syncWarning) {
          setCurrentStep(currentStep + 1)
          return
        }
        setSyncWarning(true)
      }
    } catch (e) {
      console.error('_ens check error: ', e)
    }
  }

  return (
    <Container>
      <Typography>Add Text Records</Typography>
      <Spacer $height={5} />
      <Typography>
        You need to create a new DNS record for your domain using these details. This will claim
        your Ethereum address as the owner of this domain.
      </Typography>
      <Outlink href="https://google.com">
        It looks like your registrar is Namecheap, who have a guide available here.
      </Outlink>
      <Spacer $height={5} />
      <ButtonRow>
        <StyledButton outlined fullWidthContent shadowless variant="transparent">
          <ButtonInner>
            <Typography>Type</Typography>
            <Typography {...{ variant: 'small', color: 'foreground' }}>TXT</Typography>
          </ButtonInner>
        </StyledButton>
        <Copyable {...{ label: 'Name', value: '_ens' }} />
      </ButtonRow>
      <Spacer $height={2} />
      <Copyable {...{ label: 'Value', value: address }} />
      <Spacer $height={5} />
      {syncWarning && (
        <>
          <Helper type="warning" style={{ textAlign: 'center' }}>
            <Typography>
              You don't appear to be the DNS Owner of this domain, but anyone can add this domain to
              the ENS Registry.
            </Typography>
            <Typography {...{ variant: 'small', color: 'textSecondary' }}>
              If you know you own this domain change its _ens TXT record to contain your Ethereum
              Address and click 'Check' again, otherwise click 'Claim' to proceed.
            </Typography>
          </Helper>
          <Spacer $height={6} />
        </>
      )}
      <ButtonContainer>
        <CheckButton
          onClick={() => {
            setCurrentStep(currentStep - 1)
          }}
          variant="primary"
          size="small"
        >
          Back
        </CheckButton>
        <CheckButton
          onClick={handleCheck}
          variant="primary"
          size="small"
          disabled={currentStep === 2}
        >
          Check
        </CheckButton>
        {syncWarning && (
          <CheckButton
            onClick={handleCheck}
            variant="primary"
            size="small"
            disabled={currentStep === 2}
          >
            Claim
          </CheckButton>
        )}
      </ButtonContainer>
    </Container>
  )
}
