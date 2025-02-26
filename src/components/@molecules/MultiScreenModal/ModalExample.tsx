import { useState } from 'react'
import styled from 'styled-components'

import { Button, Typography } from '@ensdomains/thorin'

import ExampleScreen from './ExampleScreen'
import { MultiScreenModal, ScreenConfig } from './MultiScreenModal'

const Container = styled.div(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
    max-width: 600px;
    margin: 0 auto;
  `,
)

const ResultContainer = styled.div(
  ({ theme }) => `
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.large};
    padding: ${theme.space['4']};
    margin-top: ${theme.space['4']};
  `,
)

// Define our screens for the multi-screen modal
const screens: ScreenConfig[] = [
  {
    id: 'personal-info',
    component: (props) => (
      <ExampleScreen
        {...props}
        title="Personal Information"
        description="Please enter your name to continue."
        fieldName="name"
        initialValue=""
      />
    ),
  },
  {
    id: 'contact-info',
    component: (props) => (
      <ExampleScreen
        {...props}
        title="Contact Information"
        description="Please enter your email address."
        fieldName="email"
        initialValue=""
      />
    ),
  },
  {
    id: 'preferences',
    component: (props) => (
      <ExampleScreen
        {...props}
        title="Preferences"
        description="Enter your preferred username."
        fieldName="username"
        initialValue=""
      />
    ),
  },
]

const ModalExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<Record<string, any> | null>(null)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleComplete = (data: any[]) => {
    // Combine all the data from different screens
    const combinedData = data.reduce((acc, screenData) => {
      return { ...acc, ...screenData }
    }, {})

    setFormData(combinedData)
    console.log('Form completed with data:', combinedData)
  }

  return (
    <Container>
      <Typography fontVariant="headingOne">Multi-Screen Modal Example</Typography>
      <Typography>
        Click the button below to open a multi-screen modal that guides you through a simple form.
      </Typography>

      <Button onClick={handleOpenModal}>Open Multi-Screen Form</Button>

      {formData && (
        <ResultContainer>
          <Typography fontVariant="headingThree">Form Results:</Typography>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </ResultContainer>
      )}

      <MultiScreenModal
        screens={screens}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onComplete={handleComplete}
      />
    </Container>
  )
}

export default ModalExample
