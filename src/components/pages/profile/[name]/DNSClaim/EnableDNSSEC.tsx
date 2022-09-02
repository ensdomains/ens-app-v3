const ENableDNSSECContainer = styled.div(
  ({ theme }) => css`
    text-align: center;
  `,
)

export const EnableDNSSEC = ({ currentStep }) => {
  const [stepStatus, setStepStatus] = useState(['inProgress', 'notStarted', 'notStarted'])

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
    <>
      <div>Enable DNS SEC</div>
      <StepContainer data-testid="step-container">
        {stepStatus.map((_, i) => (
          <StepItem
            $type={calcStepType(i)}
            data-testid={`step-item-${i}-${calcStepType(i)}`}
            key={i}
          />
        ))}
      </StepContainer>
      <ButtonContainer>
        <Button
          onClick={() => setCurrentStep(currentStep - 1)}
          variant="secondary"
          size="large"
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button
          onClick={() => setCurrentStep(currentStep + 1)}
          variant="primary"
          size="large"
          disabled={currentStep === 2}
        >
          Next
        </Button>
      </ButtonContainer>
    </>
  )
}
