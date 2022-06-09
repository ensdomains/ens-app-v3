import styled, { css } from 'styled-components'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Avatar } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'

const AliasContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  ${({ theme }) => `
    background: ${theme.colors.foregroundSecondary};
    padding: ${theme.space['3']} ${theme.space['4']};
  `}
`

const AliasAvatarContianer = styled.div`
  ${({ theme }) => `
    flex: 0 0 ${theme.space['6']};
  `}
`

const AliasLabel = styled.div`
  ${({ theme }) => `
    font-size: ${theme.fontSizes.root};
    font-weight: ${theme.fontWeights.bold};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: ${theme.lineHeights['1.25']};
    flex: 1;
  `}
`
const AliasProfileLink = styled.div(
  ({ theme }) => css`
    margin-right: -5px;
    font-family: ${theme.fonts.sans};

    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.fontSizes.small};
    line-height: ${theme.lineHeights['1.25']};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    color: ${theme.colors.textTertiary};
    text-transform: uppercase;
  `,
)

type Props = {
  profile: {
    name: string
  }
}

const AliasItem = ({ profile }: Props) => {
  const router = useRouter()
  const { t } = useTranslation('address')
  return (
    <AliasContainer>
      <AliasAvatarContianer>
        <Avatar label="alias" />
      </AliasAvatarContianer>
      <AliasLabel>{profile.name}</AliasLabel>
      <Link
        href={{
          pathname: `/profile/${profile.name}`,
          query: {
            from: router.asPath,
          },
        }}
        passHref
      >
        <AliasProfileLink as="a">{t('view')}</AliasProfileLink>
      </Link>
    </AliasContainer>
  )
}

export default AliasItem
