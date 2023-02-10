import styled, { css } from 'styled-components'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: flex-start;
    font-weight: ${theme.fontWeights.bold};
    line-height: 1.36;
    overflow: hidden;
  `,
)

const Name = styled.span<{ $disabled?: boolean }>(
  ({ theme, $disabled }) => css`
    color: ${$disabled ? theme.colors.textTertiary : theme.colors.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  `,
)

const Dot = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
  `,
)

const Tld = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
    white-space: nowrap;
  `,
)

export const StyledName = ({ name, disabled = false }: { name: string; disabled?: boolean }) => {
  const [label, ...restName] = name.split('.')

  return (
    <Container>
      <Name $disabled={disabled}>
        {label}
        {restName.length > 0 && <Dot>.</Dot>}
      </Name>
      <Tld>{restName.join('.')}</Tld>
    </Container>
  )
}
