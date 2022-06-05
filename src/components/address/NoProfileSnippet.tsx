import { Avatar, Typography } from '@ensdomains/thorin'
import styled from 'styled-components'

const Container = styled.div`
  box-sizing: border-box;
  ${({ theme }) => `
    display: flex;
    align-items: center;
    gap: 20px;
    border-radius: ${theme.space['4']};
    border: 1px solid ${theme.colors.borderTertiary};
    box-shadow: ${theme.boxShadows['0.02']};
    background: ${theme.colors.white};
    padding: ${theme.space['5']};
  `}
`

const AvatarContainer = styled.div`
  ${({ theme }) => `
    flex: 0 0 ${theme.space['13']};
  `}
`

const ProfileContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const ProfileTitle = styled.div`
  ${({ theme }) => `
    font-size: ${theme.fontSizes.extraLarge};
    font-weight: ${theme.fontWeights.bold};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    line-height: ${theme.lineHeights['1.25']};
    margin-bottom: ${theme.space['1.5']};
  `}
`

const NoProfileSnippet = () => {
  return (
    <Container>
      <AvatarContainer>
        <Avatar label="profile-label" />
      </AvatarContainer>
      <ProfileContent>
        <ProfileTitle>No primary name set</ProfileTitle>
        <Typography variant="small" color="text">
          This wallet needs to set a primary name to create a profile
        </Typography>
      </ProfileContent>
    </Container>
  )
}

export default NoProfileSnippet
