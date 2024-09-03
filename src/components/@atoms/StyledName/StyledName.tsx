import styled, { css } from 'styled-components'

import { useBeautifiedName } from '@app/hooks/useBeautifiedName'

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
    color: ${$disabled ? theme.colors.grey : theme.colors.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  `,
)

const Dot = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.grey};
  `,
)

const Tld = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.grey};
    white-space: nowrap;
  `,
)

export const StyledName = ({ name, disabled = false }: { name: string; disabled?: boolean }) => {
  const beautifiedName = useBeautifiedName(name)
  const [label, ...restName] = beautifiedName.split('.')

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
