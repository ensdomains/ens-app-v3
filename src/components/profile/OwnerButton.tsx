import { usePrimary } from '@app/hooks/usePrimary'
import { Button, Typography } from '@ensdomains/thorin'
import styled from 'styled-components'
import { AvatarWithZorb } from '../AvatarWithZorb'

const ButtonWrapper = styled.div`
  width: 100%;
  & > button {
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
    ${({ theme }) => `
      background-color: ${theme.colors.background};
      border-radius: ${theme.radii.extraLarge};
    `}
    & > div {
      width: 100%;
    }
  }
`

const Content = styled.div`
  ${({ theme }) => `
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['3']};
    flex-gap: ${theme.space['3']};
  `}
`

const Label = styled(Typography)`
  ${({ theme }) => `
    color: ${theme.colors.textTertiary};
    font-size: ${theme.fontSizes.small};
  `}
`

const Name = styled(Typography)`
  ${({ theme }) => `
    color: ${theme.colors.text};
    font-size: ${theme.fontSizes.small};
  `}
`

const AvatarWrapper = styled.div`
  ${({ theme }) => `
    width: ${theme.space['6']};
    height: ${theme.space['6']};
  `}
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  flex-gap: 0;
`

export const OwnerButton = ({
  address,
  network,
  label,
}: {
  address: string
  network: string
  label: string
}) => {
  const { name } = usePrimary(address)

  return (
    <ButtonWrapper>
      <Button size="extraSmall">
        <Content>
          <AvatarWrapper>
            <AvatarWithZorb
              label={name || address}
              address={address}
              name={name || undefined}
              network={network}
            />
          </AvatarWrapper>
          <TextContainer>
            <Label ellipsis>{label}</Label>
            <Name ellipsis>{name}</Name>
          </TextContainer>
        </Content>
      </Button>
    </ButtonWrapper>
  )
}
