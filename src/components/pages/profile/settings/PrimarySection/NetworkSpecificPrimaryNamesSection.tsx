import styled, { css } from 'styled-components'

import { Button, Typography } from '@ensdomains/thorin'

import { QuestionTooltip } from '@app/components/@molecules/QuestionTooltip/QuestionTooltip'
import { networks } from '@app/constants/networks'
import { usePrimaryNames } from '@app/hooks/primary/usePrimaryNames'
import { getL2PrimarySiteUrl } from '@app/utils/urls'

import { NetworkRowComponent } from './NetworkRow'

const NetworkSpecificSection = styled.div(
  ({ theme }) => css`
    position: relative;
    padding-top: ${theme.space['4']};
    margin-top: ${theme.space['4']};
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
  `,
)

const ResposiveDivider = styled.div(
  ({ theme }) => css`
    border-top: 1px solid ${theme.colors.border};
    position: absolute;
    top: 0;
    left: -${theme.space['4']};
    width: calc(100% + 2 * ${theme.space['4']});

    @media (min-width: ${theme.breakpoints.sm}px) {
      left: -${theme.space['6']};
      width: calc(100% + 2 * ${theme.space['6']});
    }
  `,
)

const NetworkSectionHeader = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['2']};
  `,
)

const NetworkTitleRow = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['2']};
  `,
)

interface NetworkSpecificPrimaryNamesSectionProps {
  address?: string
}

export const NetworkSpecificPrimaryNamesSection = ({
  address,
}: NetworkSpecificPrimaryNamesSectionProps) => {
  // const { t } = useTranslation('settings')

  const primaryNames = usePrimaryNames({
    chainAddresses: networks.map(({ coinType, name }) => ({
      name,
      id: coinType,
      value: address!,
    })),
  })

  const groupedPrimaryNames = Object.values(
    primaryNames.data.reduce(
      (acc, curr) => {
        const key = curr.name
        return {
          ...acc,
          [key]: {
            name: curr.name,
            networks: [
              ...(acc[key]?.networks || []),
              {
                coinType: curr.coinType,
                coinName: curr.coinName,
                address: curr.address,
              },
            ],
          },
        }
      },
      {} as Record<
        string,
        {
          name: string
          networks: Array<{
            coinType: number
            coinName: string
            address: string
          }>
        }
      >,
    ),
  )

  return (
    <NetworkSpecificSection>
      <ResposiveDivider />
      <NetworkSectionHeader>
        <NetworkTitleRow>
          <Typography fontVariant="headingFour">Network-specific primary names</Typography>
          <QuestionTooltip content="Network-specific primary names will override your default primary name on their specific network." />
        </NetworkTitleRow>
        <Button
          as="a"
          href={getL2PrimarySiteUrl(address || '')}
          size="small"
          colorStyle="accentSecondary"
          width="fit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Manage
        </Button>
      </NetworkSectionHeader>

      <Typography color="textSecondary" fontVariant="small">
        Network-specific primary names will override your default primary name on their specific
        network.
      </Typography>

      <div>
        {groupedPrimaryNames.map((group) => (
          <NetworkRowComponent key={group.name} name={group.name} networks={group.networks} />
        ))}
      </div>
    </NetworkSpecificSection>
  )
}
