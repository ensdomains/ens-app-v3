import { PropsWithChildren, ReactNode } from 'react'
import styled, { css } from 'styled-components'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: ${theme.space['2']};
  `,
)

const LabelsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.space['2']};
    padding: 0 ${theme.space['2']};
  `,
)

const Label = styled.div(
  ({ theme }) => css`
    color: ${theme.colors.grey};
    font-weight: ${theme.fontWeights.bold};
    line-height: ${theme.space['5']};
  `,
)

const SecondaryLabel = styled.div(
  ({ theme }) => css`
    color: ${theme.colors.grey};
    font-size: ${theme.space['3']};
  `,
)

const ErrorLabel = styled.div(
  ({ theme }) => `
    color: ${theme.colors.red};
    line-height: ${theme.space['5']};
    padding-left: ${theme.space['2']};
`,
)

export const Field = ({
  label,
  secondaryLabel,
  errorLabel,
  children,
}: PropsWithChildren<{
  label: ReactNode
  secondaryLabel?: ReactNode
  errorLabel?: ReactNode
}>) => {
  return (
    <Container>
      <LabelsContainer>
        <Label>{label}</Label>
        {secondaryLabel && <SecondaryLabel>{secondaryLabel}</SecondaryLabel>}
      </LabelsContainer>
      <div>{children}</div>
      {errorLabel && <ErrorLabel>{errorLabel}</ErrorLabel>}
    </Container>
  )
}
