import { Dispatch, forwardRef, ReactNode, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Address, getAddress } from 'viem'
import { useAccount } from 'wagmi'

import {
  Button,
  Heading,
  mq,
  RadioButton,
  RadioButtonGroup,
  Tag,
  Typography,
} from '@ensdomains/thorin'

import { Card } from '@app/components/Card'
import { Outlink } from '@app/components/Outlink'
import { useChainId } from '@app/hooks/chain/useChainId'
import { useDnsOffchainStatus } from '@app/hooks/dns/useDnsOffchainStatus'
import { useDnsSecEnabled } from '@app/hooks/dns/useDnsSecEnabled'
import { useDnsOwner } from '@app/hooks/ensjs/dns/useDnsOwner'
import { useResolver } from '@app/hooks/ensjs/public/useResolver'

import {
  DnsImportReducerAction,
  DnsImportReducerDataItem,
  DnsImportType,
  DnsStep,
  SelectedItemProperties,
} from './useDnsImportReducer'
import { checkDnsAddressMatch } from './utils'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    ${mq.sm.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    `)}
  `,
)

const StyledHeading = styled(Heading)(
  () => css`
    width: 100%;
    text-align: center;
    word-break: break-all;

    @supports (overflow-wrap: anywhere) {
      overflow-wrap: anywhere;
      word-break: normal;
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
  `,
)

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

const TypeLabelContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: ${theme.space['1']};
    overflow: hidden;
    word-wrap: normal;

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

const ResponsiveButton = styled(Button)(
  ({ theme }) => css`
    width: 100%;

    ${mq.sm.min(css`
      width: ${theme.space['40']};
    `)}
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

/* eslint-disable @typescript-eslint/naming-convention */
const offchainResolverMap = {
  '1': '0xF142B308cF687d4358410a4cB885513b30A42025',
  '11155111': '0x179be112b24ad4cfc392ef8924dfa08c20ad8583',
} as Record<string, Address | undefined>
/* eslint-enable @typescript-eslint/naming-convention */

export const SelectImportType = ({
  dispatch,
  item,
  selected,
}: {
  dispatch: Dispatch<DnsImportReducerAction>
  item: DnsImportReducerDataItem
  selected: SelectedItemProperties
}) => {
  const { address } = useAccount()
  const chainId = useChainId()
  const { data: tldResolver } = useResolver({ name: selected.name.split('.')[1] })

  const tldResolverIsOffchainResolver = useMemo(
    // make addresses checksum-verified
    () =>
      tldResolver != null && getAddress(tldResolver) === getAddress(offchainResolverMap[chainId]!),
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
    const steps = ['selectType'] as DnsStep[]
    if (!isDnsSecEnabled) steps.push('enableDnssec')
    if (item.type === 'offchain') {
      if (
        !offchainDnsStatus ||
        offchainDnsStatus.resolver !== 'matching' ||
        offchainDnsStatus.address !== 'matching'
      )
        steps.push('verifyOffchainOwnership')
      steps.push('completeOffchain')
    } else {
      if (!dnsOwner || dnsOwnerStatus !== 'matching') steps.push('verifyOnchainOwnership')
      steps.push('transaction')
      steps.push('completeOnchain')
    }
    dispatch({ name: 'setSteps', selected, payload: steps })
    dispatch({ name: 'increaseStep', selected })
  }

  return (
    <StyledCard>
      <StyledHeading>Claim {selected.name}</StyledHeading>
      <Typography>Importing domain names allows them to be used as ENS names.</Typography>
      <Outlink href="https://example.com">Learn more about importing names</Outlink>
      <TypesSelectionContainer>
        <Typography weight="bold">How would you like to import your domain?</Typography>
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
                    <Typography fontVariant="bodyBold">Offchain</Typography>
                    <Tag colorStyle="accentSecondary">Free</Tag>
                  </TypeLabelHeading>
                  <Typography fontVariant="small">
                    Your name will not have an onchain token.
                    <br />
                    This does not affect it&apos;s ability to receive transactions or to be used as
                    a primary name.
                    <br />
                    <b>You will not be able to edit your profile from within the ENS app.</b>
                  </Typography>
                </TypeLabelContainer>
              }
              defaultChecked={item.type === 'offchain'}
            />
          </RadioButtonContainer>
          <RadioButtonContainer>
            <RadioButton
              name="RadioButtonGroup"
              value="onchain"
              label={
                <TypeLabelContainer>
                  <TypeLabelHeading>
                    <Typography fontVariant="bodyBold">Onchain</Typography>
                    <Tag colorStyle="accentSecondary">Est 1.234 ETH</Tag>
                  </TypeLabelHeading>
                  <Typography fontVariant="small">Your name will have an onchain token.</Typography>
                </TypeLabelContainer>
              }
              defaultChecked={item.type === 'onchain'}
            />
          </RadioButtonContainer>
        </StyledRadioButtonGroup>
      </TypesSelectionContainer>
      <ResponsiveButton
        disabled={
          !item.type || isDnsSecEnabledLoading || isDnsOwnerLoading || isOffchainDnsStatusLoading
        }
        onClick={() => setStepsAndNavigate()}
      >
        Next
      </ResponsiveButton>
    </StyledCard>
  )
}
