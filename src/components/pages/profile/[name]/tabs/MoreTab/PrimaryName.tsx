import styled, { css } from 'styled-components'

import { Button, Card, Tag, Typography } from '@ensdomains/thorin'

import { QuestionTooltip } from '@app/components/@molecules/QuestionTooltip/QuestionTooltip'

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
  `,
)

const NetworkRow = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.space['3']} 0;
    border-bottom: 1px solid ${theme.colors.border};

    &:last-child {
      border-bottom: none;
    }
  `,
)

const NetworkInfo = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['1']};
    flex: 1;
  `,
)

const Address = styled(Typography)(
  ({ theme }) => css`
    font-family: ${theme.fonts.mono};
    word-break: break-all;
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
  const handleManage = () => {
    // TODO: Implement manage functionality
    console.log('Manage primary names')
  }

  return (
    <PrimaryNameCard>
      <SectionHeader>
        <TitleRow>
          <Typography fontVariant="headingFour">Primary name</Typography>
          <QuestionTooltip content="A primary name links this name to an address, allowing apps to display a name and profile when looking up the address. Each address can only have a single primary name per network." />
        </TitleRow>
        <TagContainer>
          <Tag colorStyle="greenPrimary" size="small">
            Your primary name
          </Tag>
        </TagContainer>
      </SectionHeader>

      <Typography color="textSecondary" fontVariant="small">
        A primary name links this name to an address, allowing apps to display a name and profile when looking up the address. Each address can only have a single primary name per network.
      </Typography>

      <div>
        {mockPrimaryNames.map((item) => (
          <NetworkRow key={item.network}>
            <NetworkInfo>
              <Typography fontVariant="bodyBold" color="textSecondary">
                {item.network}
              </Typography>
              <Address fontVariant="small" color="text">
                {item.address}
              </Address>
            </NetworkInfo>
          </NetworkRow>
        ))}
      </div>

      <ButtonContainer>
        <Button size="small" colorStyle="accentSecondary" onClick={handleManage}>
          Manage
        </Button>
      </ButtonContainer>
    </PrimaryNameCard>
  )
}