import { Typography } from '@ensdomains/thorin'
import styled from 'styled-components'

const Wrapper = styled.div<{ $align: 'left' | 'right' }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $align }) =>
    $align === 'left' ? 'flex-start' : 'flex-end'};
  justify-content: center;
`

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
  align = 'left',
}: {
  title: string
  subtitle?: string
  align?: 'left' | 'right'
}) => {
  return (
    <Wrapper $align={align}>
      <Title weight="bold">{title}</Title>
      {subtitle && (
        <Subtitle variant="small" weight="bold">
          {subtitle}
        </Subtitle>
      )}
    </Wrapper>
  )
}
