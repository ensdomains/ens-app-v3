import { QueryObserverResult } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Address, useAccount } from 'wagmi'

import {
  BaseError,
  DnsDnssecVerificationFailedError,
  DnsInvalidAddressChecksumError,
  DnsInvalidTxtRecordError,
  DnsNoTxtRecordError,
  DnsResponseStatusError,
} from '@ensdomains/ensjs'
import { Button, Helper, Typography } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { IconCopyAnimated } from '@app/components/IconCopyAnimated'
import { Outlink } from '@app/components/Outlink'
import { UseDnsOwnerError } from '@app/hooks/ensjs/dns/useDnsOwner'
import { useCopied } from '@app/hooks/useCopied'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { shortenAddress } from '@app/utils/utils'

import { AlignedDropdown, ButtonContainer, CheckButton } from './shared'
import { Steps } from './Steps'

const HelperLinks = [
  {
    label: 'registrars.namecheap',
    href: 'https://www.namecheap.com/support/knowledgebase/article.aspx/317/2237/how-do-i-add-txtspfdkimdmarc-records-for-my-domain/',
  },
  {
    label: 'registrars.domaindotcom',
    href: 'https://www.domain.com/help/article/dns-management-how-to-update-txt-spf-records',
  },
  {
    label: 'registrars.googledomains',
    href: 'https://support.google.com/domains/answer/3290350?hl=en',
  },
  {
    label: 'registrars.dreamhost',
    href: 'https://help.dreamhost.com/hc/en-us/articles/360035516812-Adding-custom-DNS-records',
  },
  {
    label: 'registrars.hover',
    href: 'https://help.hover.com/hc/en-us/articles/217282457-Managing-DNS-records-',
  },
  {
    label: 'registrars.godaddy',
    href: 'https://godaddy.com/help/manage-dns-records-680',
  },
  {
    label: 'registrars.bluehost',
    href: 'https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries',
  },
  {
    label: 'registrars.cloudflare',
    href: 'https://developers.cloudflare.com/dns/additional-options/dnssec/#enable-dnssec',
  },
  {
    label: 'registrars.hostgator',
    href: 'https://www.hostgator.com/help/article/changing-dns-records',
  },
]

const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ButtonInner = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    height: 48px;
    padding: 0 ${theme.space['2.5']};
  `,
)

const ButtonRow = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    gap: ${theme.space['2.5']};
    width: 100%;
  `,
)

const CopyableRightContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['1.5']};
  `,
)

const Copyable = ({
  label,
  value,
  displayValue,
}: {
  label: string
  value: string
  displayValue: string
}) => {
  const { copy, copied } = useCopied()
  return (
    <Button colorStyle="background" onClick={() => copy(value)} size="flexible" fullWidthContent>
      <ButtonInner>
        <Typography>{label}</Typography>
        <CopyableRightContainer>
          <Typography fontVariant="small">{displayValue}</Typography>
          <IconCopyAnimated color="grey" copied={copied} size="3.5" />
        </CopyableRightContainer>
      </ButtonInner>
    </Button>
  )
}

enum Errors {
  SUBDOMAIN_NOT_SET = 'SUBDOMAIN_NOT_SET',
  DNS_RECORD_DOES_NOT_EXIST = 'DNS_RECORD_DOES_NOT_EXIST',
  DNS_RECORD_INVALID = 'DNS_RECORD_INVALID',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export const AddTextRecord = ({
  dnsOwner,
  refetch,
  isLoading,
  error,
  incrementStep,
  decrementStep,
  currentStep,
  syncWarning,
  name,
}: {
  dnsOwner?: Address
  refetch: () => Promise<QueryObserverResult<Address, UseDnsOwnerError>>
  isLoading: boolean
  error: UseDnsOwnerError | null
  incrementStep: () => void
  decrementStep: () => void
  currentStep: number
  syncWarning: boolean
  name: string
}) => {
  const { address } = useAccount()
  const breakpoints = useBreakpoint()
  const { t } = useTranslation('dnssec')

  const handleCheck = async () => {
    const result = await refetch()
    if (result.data === address) incrementStep()
  }

  const errorState = useMemo(() => {
    if (!error || isLoading) return null
    if (!(error instanceof BaseError)) return Errors.UNKNOWN_ERROR
    if (error instanceof DnsResponseStatusError) {
      if (error.responseStatus !== 'NXDOMAIN') return Errors.UNKNOWN_ERROR
      return Errors.SUBDOMAIN_NOT_SET
    }
    // this shouldn't happen here in theory
    if (error instanceof DnsDnssecVerificationFailedError) return Errors.UNKNOWN_ERROR

    if (error instanceof DnsNoTxtRecordError) return Errors.DNS_RECORD_DOES_NOT_EXIST
    if (error instanceof DnsInvalidTxtRecordError) return Errors.DNS_RECORD_INVALID
    if (error instanceof DnsInvalidAddressChecksumError) return Errors.DNS_RECORD_INVALID
    if (error) return Errors.UNKNOWN_ERROR

    if (dnsOwner !== address) return Errors.DNS_RECORD_INVALID
    return null
  }, [address, dnsOwner, error, isLoading])

  return (
    <Container>
      <Typography fontVariant="headingFour">{t('addTextRecord.title')}</Typography>
      <Spacer $height="3" />
      <Typography>{t('addTextRecord.explanation')}</Typography>
      <Spacer $height="3" />
      <AlignedDropdown
        // needed for no line breaks in buttons
        width={200}
        height={200}
        align="left"
        items={HelperLinks.map((link) => ({
          label: t(link.label),
          onClick: () => null,
          wrapper: (children, key) => (
            <a
              href={link.href}
              target="_blank"
              key={key}
              rel="noreferrer"
              // needed for buttons to maintain the width of the dropdown
              style={{ width: '100%', textAlign: 'left' }}
            >
              {children}
            </a>
          ),
        }))}
        label="Domain Registrar"
      />
      <Spacer $height="3" />
      <Outlink target="_blank" href={`https://who.is/whois/${name}`}>
        {t('registrars.findYourRegistrar')}
      </Outlink>
      <Spacer $height="5" />
      <ButtonRow>
        <Button colorStyle="background" size="flexible" fullWidthContent>
          <ButtonInner>
            <Typography>{t('addTextRecord.type')}</Typography>
            <Typography fontVariant="small">{t('addTextRecord.txt')}</Typography>
          </ButtonInner>
        </Button>
        <Copyable {...{ label: 'Name', value: '_ens', displayValue: '_ens' }} />
      </ButtonRow>
      <Spacer $height="2" />
      {address && (
        <Copyable
          {...{
            label: 'Value',
            value: `a=${address}`,
            displayValue: `a=${
              breakpoints.sm ? address : shortenAddress(address, undefined, 6, 6)
            }`,
          }}
        />
      )}
      <Spacer $height="6" />
      {syncWarning && (
        <>
          <Helper type="warning" style={{ textAlign: 'center' }}>
            <Typography>{t('addTextRecord.syncWarningOne')}</Typography>
            <Typography fontVariant="small" color="grey">
              {t('addTextRecord.syncWarningTwo')}
            </Typography>
          </Helper>
          <Spacer $height="6" />
        </>
      )}
      {errorState !== null && (
        <>
          <Helper type="error" style={{ textAlign: 'center' }}>
            <Typography>{t(`addTextRecord.errors.${errorState}.title`)}</Typography>
            <Typography fontVariant="small" color="grey">
              {t(`addTextRecord.errors.${errorState}.content`)}
            </Typography>
          </Helper>
          <Spacer $height="6" />
        </>
      )}
      <Steps {...{ stepStatus: ['completed', 'inProgress', 'notStarted', 'notStarted'] }} />
      <Spacer $height="6" />
      <ButtonContainer>
        {syncWarning && (
          <CheckButton onClick={incrementStep} size="small">
            {t('action.continue', { ns: 'common' })}
          </CheckButton>
        )}
        <CheckButton
          onClick={handleCheck}
          size="small"
          disabled={currentStep === 2}
          loading={isLoading}
          data-testid="dnssec-check-button"
        >
          {t('action.check', { ns: 'common' })}
        </CheckButton>
        <CheckButton onClick={decrementStep} colorStyle="accentSecondary" size="small">
          {t('navigation.back', { ns: 'common' })}
        </CheckButton>
      </ButtonContainer>
    </Container>
  )
}
