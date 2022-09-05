import { useCallback } from 'react'
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

export const Steps = ({ currentStep, stepStatus }) => {
  const calcStepType = useCallback(
    (step: number) => {
      if (step === currentStep) {
        return 'inProgress'
      }
      if (step < (currentStep || 0)) {
        return 'completed'
      }
      return 'notStarted'
    },
    [currentStep, stepStatus],
  )

  return (
    <StepContainer data-testid="step-container">
      {stepStatus.map((_, i) => (
        <StepItem
          $type={calcStepType(i)}
          data-testid={`step-item-${i}-${calcStepType(i)}`}
          key={i}
        />
      ))}
    </StepContainer>
  )
}
