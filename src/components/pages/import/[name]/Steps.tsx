import styled, { css } from 'styled-components'

type StepType = 'notStarted' | 'inProgress' | 'completed'

const StepContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

const StepItem = styled.div<{ $type: StepType }>(
  ({ theme, $type }) => css`
    border-radius: ${theme.radii.full};
    width: ${theme.space['3.5']};
    height: ${theme.space['3.5']};
    ${$type === 'notStarted' &&
    css`
      border: ${theme.borderWidths['0.5']} ${theme.borderStyles.solid}
        ${theme.colors.borderSecondary};
    `}
    ${$type === 'inProgress' &&
    css`
      border: ${theme.borderWidths['0.5']} ${theme.borderStyles.solid} ${theme.colors.accent};
    `}
    ${$type === 'completed' &&
    css`
      background-color: ${theme.colors.accent};
    `}
  `,
)

export const Steps = ({ stepStatus }: { stepStatus: StepType[] }) => {
  return (
    <StepContainer data-testid="step-container">
      {stepStatus.map((stepType, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <StepItem $type={stepType} data-testid={`step-item-${i}-${stepType}`} key={i} />
      ))}
    </StepContainer>
  )
}
