import { Dispatch, forwardRef, ReactNode, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount, useChainId } from 'wagmi'

import { GetDnsOwnerReturnType } from '@ensdomains/ensjs/dns'
import { RadioButton, RadioButtonGroup, Tag, Typography } from '@ensdomains/thorin'

import { SupportOutlink } from '@app/components/@atoms/SupportOutlink'
import { OFFCHAIN_DNS_RESOLVER_MAP } from '@app/constants/resolverAddressData'
import { useDnsOffchainStatus } from '@app/hooks/dns/useDnsOffchainStatus'
import { useDnsSecEnabled } from '@app/hooks/dns/useDnsSecEnabled'
import { useDnsOwner } from '@app/hooks/ensjs/dns/useDnsOwner'
import { useResolver } from '@app/hooks/ensjs/public/useResolver'
import { useUnmanagedTLD } from '@app/hooks/useUnmanagedTLD'
import { CenteredTypography } from '@app/transaction-flow/input/ProfileEditor/components/CenteredTypography'
import { sendEvent } from '@app/utils/analytics/events'
import { getSupportLink } from '@app/utils/supportLinks'

import { DnsImportActionButton, DnsImportCard, DnsImportHeading } from '../shared'
import {
  DnsImportReducerAction,
  DnsImportReducerDataItem,
  DnsImportType,
  DnsStep,
  SelectedItemProperties,
} from '../useDnsImportReducer'
import { checkDnsAddressMatch, DnsAddressStatus } from '../utils'

const StyledRadioButtonGroup = styled(RadioButtonGroup)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 0;
    border-radius: ${theme.radii.large};
    border: 1px solid ${theme.colors.border};

    & > :first-child {
      border-bottom: 1px solid ${theme.colors.border};
    }
  `,
)

const TypesSelectionContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    max-width: 100%;

    & > :first-child {
      padding: 0 ${theme.space['4']};
    }
  `,
)

const TypeLabelContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: ${theme.space['1']};

    div {
      white-space: normal;
    }

    &[aria-disabled='true'] {
      opacity: 0.5;
    }
  `,
)

const TypeLabelHeading = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
  `,
)

const RadioButtonContainer = styled.div(
  ({ theme }) => css`
    & > div {
      padding: ${theme.space['4']};
    }
  `,
)

const TypeRadioButton = forwardRef<
  HTMLInputElement,
  { type: NonNullable<DnsImportType>; tag: string; description: ReactNode }
>(({ type, tag, description }, ref) => {
  return (
    <RadioButtonContainer ref={ref}>
      <RadioButton
        name="RadioButtonGroup"
        value={type}
        label={
          <TypeLabelContainer>
            <TypeLabelHeading>
              <Typography fontVariant="bodyBold">{type}</Typography>
              <Tag colorStyle="accentSecondary">{tag}</Tag>
            </TypeLabelHeading>
            {description}
          </TypeLabelContainer>
        }
      />
    </RadioButtonContainer>
  )
})
TypeRadioButton.displayName = 'TypeRadioButton'

export const calculateDnsSteps = ({
  importType,
  isDnsSecEnabled,
  offchainDnsStatus,
  dnsOwner,
  dnsOwnerStatus,
}: {
  importType: DnsImportType
  isDnsSecEnabled: boolean | undefined
  offchainDnsStatus: ReturnType<typeof useDnsOffchainStatus>['data']
  dnsOwner: GetDnsOwnerReturnType | undefined
  dnsOwnerStatus: DnsAddressStatus
}) => {
  const steps = ['selectType'] as DnsStep[]
  if (!isDnsSecEnabled) steps.push('enableDnssec')
  if (importType === 'offchain') {
    if (!offchainDnsStatus || offchainDnsStatus.address?.status !== 'matching')
      steps.push('verifyOffchainOwnership')
    steps.push('completeOffchain')
  } else {
    if (!dnsOwner || dnsOwnerStatus !== 'matching') steps.push('verifyOnchainOwnership')
    steps.push('transaction')
    steps.push('completeOnchain')
  }

  return steps
}

export const SelectImportType = ({
  dispatch,
  item,
  selected,
}: {
  dispatch: Dispatch<DnsImportReducerAction>
  item: DnsImportReducerDataItem
  selected: SelectedItemProperties
}) => {
  const { t } = useTranslation('dnssec', { keyPrefix: 'steps.selectType' })
  const { t: tc } = useTranslation('common')

  const { address } = useAccount()
  const chainId = useChainId()
  const isUnmanaged = useUnmanagedTLD(selected.name)
  const { data: tldResolver } = useResolver({ name: selected.name.split('.')[1] })

  const tldResolverIsOffchainResolver = useMemo(
    // make addresses checksum-verified
    () => tldResolver != null && tldResolver === OFFCHAIN_DNS_RESOLVER_MAP[chainId]!,
    [tldResolver, chainId],
  )

  const { data: isDnsSecEnabled, isLoading: isDnsSecEnabledLoading } = useDnsSecEnabled({
    name: selected.name,
  })

  const { data: dnsOwner, isLoading: isDnsOwnerLoading } = useDnsOwner({ name: selected.name })
  const { data: offchainDnsStatus, isLoading: isOffchainDnsStatusLoading } = useDnsOffchainStatus({
    name: selected.name,
    enabled: item.type === 'offchain',
  })

  const dnsOwnerStatus = useMemo(
    () => checkDnsAddressMatch({ address, dnsAddress: dnsOwner }),
    [address, dnsOwner],
  )

  const setStepsAndNavigate = () => {
    const steps = calculateDnsSteps({
      dnsOwner,
      dnsOwnerStatus,
      importType: item.type,
      isDnsSecEnabled,
      offchainDnsStatus,
    })
    // eslint-disable-next-line @typescript-eslint/naming-convention
    sendEvent('import:select_type', { name: selected.name, type: item.type, next_step: steps[0] })
    dispatch({ name: 'setSteps', selected, payload: steps })
    dispatch({ name: 'increaseStep', selected })
  }

  if (isUnmanaged) {
    const tld = selected.name.split('.').pop()
    return (
      <DnsImportCard>
        <DnsImportHeading>{t('title', { name: selected.name })}</DnsImportHeading>
        <CenteredTypography>{t('customizedTld', { tld })}</CenteredTypography>
      </DnsImportCard>
    )
  }

  return (
    <DnsImportCard>
      <DnsImportHeading>{t('title', { name: selected.name })}</DnsImportHeading>
      <CenteredTypography>{t('subtitle')}</CenteredTypography>
      <SupportOutlink href={getSupportLink('dnsNames')}>{t('learnMore')}</SupportOutlink>
      <TypesSelectionContainer>
        <Typography weight="bold">{t('select.heading')}</Typography>
        <StyledRadioButtonGroup
          value={item.type || undefined}
          onChange={(e) => {
            dispatch({ name: 'setType', selected, payload: e.target.value as DnsImportType })
          }}
        >
          <RadioButtonContainer>
            <RadioButton
              disabled={!tldResolverIsOffchainResolver}
              name="RadioButtonGroup"
              value="offchain"
              label={
                <TypeLabelContainer aria-disabled={!tldResolverIsOffchainResolver}>
                  <TypeLabelHeading>
                    <Typography fontVariant="bodyBold">{t('select.offchain.name')}</Typography>
                    <Tag colorStyle="accentSecondary">{t('select.offchain.tag')}</Tag>
                  </TypeLabelHeading>
                  <Typography fontVariant="small">
                    <Trans
                      t={t}
                      i18nKey="select.offchain.description"
                      components={{
                        br: <br />,
                        b: <b />,
                      }}
                    />
                  </Typography>
                </TypeLabelContainer>
              }
              data-testid="offchain-radio"
            />
          </RadioButtonContainer>
          <RadioButtonContainer>
            <RadioButton
              name="RadioButtonGroup"
              value="onchain"
              label={
                <TypeLabelContainer>
                  <TypeLabelHeading>
                    <Typography fontVariant="bodyBold">{t('select.onchain.name')}</Typography>
                  </TypeLabelHeading>
                  <Typography fontVariant="small">{t('select.onchain.description')}</Typography>
                </TypeLabelContainer>
              }
              data-testid="onchain-radio"
            />
          </RadioButtonContainer>
        </StyledRadioButtonGroup>
      </TypesSelectionContainer>
      <DnsImportActionButton
        disabled={
          !item.type || isDnsSecEnabledLoading || isDnsOwnerLoading || isOffchainDnsStatusLoading
        }
        loading={isDnsSecEnabledLoading || isDnsOwnerLoading || isOffchainDnsStatusLoading}
        onClick={() => setStepsAndNavigate()}
        data-testid="import-next-button"
      >
        {tc('action.next')}
      </DnsImportActionButton>
    </DnsImportCard>
  )
}
