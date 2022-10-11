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
  const labels = name.split('.')
  const tld = labels.length > 1 ? `${labels[labels.length - 1]}` : ''
  const nameWithoutTld = labels.length > 1 ? labels.slice(0, -1).join('.') : name

  return (
    <Container>
      <Name $disabled={disabled}>
        {nameWithoutTld}
        {labels.length > 1 && <Dot>.</Dot>}
      </Name>
      <Tld>{tld}</Tld>
    </Container>
  )
}
