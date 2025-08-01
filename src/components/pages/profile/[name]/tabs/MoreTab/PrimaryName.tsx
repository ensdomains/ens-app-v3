import styled, { css } from 'styled-components'

import { Button, Card, NametagSVG, RecordItem, Tag, Typography } from '@ensdomains/thorin'

import { QuestionTooltip } from '@app/components/@molecules/QuestionTooltip/QuestionTooltip'
import { getL2PrimarySiteUrl } from '@app/utils/urls'

const PrimaryNameCard = styled(Card)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
  `,
)

const SectionHeader = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['2']};
  `,
)

const TitleRow = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['2']};
  `,
)

const TagContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['2']};

    svg {
      width: ${theme.space['4']};
      height: ${theme.space['4']};
      margin-right: ${theme.space['1']};
    }
  `,
)

const RecordItemsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: flex-end;
    margin-top: ${theme.space['2']};
  `,
)

// Mock data for network-specific primary names
const mockPrimaryNames = [
  {
    network: 'default',
    address: '0x0b08dA70688b73A579Bd5E8a290ff8afd37bc32A',
  },
  {
    network: 'base',
    address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
  },
]

interface PrimaryNameProps {
  name: string
}

export const PrimaryName = ({ name }: PrimaryNameProps) => {
  return (
    <PrimaryNameCard>
      <SectionHeader>
        <TitleRow>
          <Typography fontVariant="headingFour">Primary name</Typography>
          <QuestionTooltip content="A primary name links this name to an address, allowing apps to display a name and profile when looking up the address. Each address can only have a single primary name per network." />
        </TitleRow>
        <TagContainer>
          <Tag colorStyle="greenSecondary" size="small">
            <NametagSVG />
            Your primary name
          </Tag>
        </TagContainer>
      </SectionHeader>

      <Typography color="textSecondary" fontVariant="small">
        A primary name links this name to an address, allowing apps to display a name and profile
        when looking up the address. Each address can only have a single primary name per network.
      </Typography>

      <RecordItemsContainer>
        {mockPrimaryNames.map((item) => (
          <RecordItem key={item.network} keyLabel={item.network} value={item.address}>
            {item.address}
          </RecordItem>
        ))}
      </RecordItemsContainer>

      <ButtonContainer>
        <Button
          as="a"
          href={getL2PrimarySiteUrl(name)}
          size="small"
          colorStyle="accentSecondary"
          width="fit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Manage
        </Button>
      </ButtonContainer>
    </PrimaryNameCard>
  )
}
