import { useState } from 'react'
import styled from 'styled-components'

import { Input, Typography } from '@ensdomains/thorin'

import { ScreenProps } from './MultiScreenModal'

const Container = styled.div(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
  `,
)

type ExampleScreenProps = ScreenProps & {
  title: string
  description: string
  fieldName: string
  initialValue?: string
}

const ExampleScreen = ({
  title,
  description,
  fieldName,
  initialValue = '',
  onNext,
}: ExampleScreenProps) => {
  const [value, setValue] = useState(initialValue)

  const handleNext = () => {
    // Pass data to the next screen via onNext
    onNext?.({ [fieldName]: value })
  }

  return (
    <Container>
      <Typography fontVariant="headingTwo">{title}</Typography>
      <Typography>{description}</Typography>
      <Input
        label={fieldName}
        placeholder={`Enter ${fieldName}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Container>
  )
}

export default ExampleScreen
