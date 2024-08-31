import { forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { QuestionSVG } from '@ensdomains/thorin'

const StyledQuestion = styled.svg(
  ({ theme }) => css`
    width: ${theme.space['6']};
    height: ${theme.space['6']};
    padding: ${theme.space['1.25']};
    background-color: ${theme.colors.indigo};
    border-radius: ${theme.radii.full};
    color: ${theme.colors.background};
  `,
)

export const SupportQuestionIcon = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <StyledQuestion as={QuestionSVG} ref={ref} {...props} />,
)
