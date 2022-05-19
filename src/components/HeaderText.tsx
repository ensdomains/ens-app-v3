import { Typography } from '@ensdomains/thorin'
import styled from 'styled-components'

const Title = styled(Typography)`
  ${({ theme }) => `
    font-size: ${theme.fontSizes.headingThree};
    line-height: ${theme.lineHeights.normal};
  `}
`

const Subtitle = styled(Typography)`
  ${({ theme }) => `
    line-height: ${theme.lineHeights.normal};
    color: ${theme.colors.textTertiary};
  `}
`

export const HeaderText = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => {
  return (
    <div>
      <Title weight="bold">{title}</Title>
      <Subtitle variant="small" weight="bold">
        {subtitle}
      </Subtitle>
    </div>
  )
}
