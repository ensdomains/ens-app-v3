import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

import { Button, Tooltip, mq } from '@ensdomains/thorin'
import { ReactNodeNoStrings } from '@ensdomains/thorin/dist/types/types/index'

import { useTooltipSeenManager } from '@app/hooks/useTooltipSeenManager'

type Placement = NonNullable<ComponentProps<typeof Tooltip>['placement']>
type Size = ComponentProps<typeof Button>['size']
const ButtonContainer = styled.div<{ $buttonWidth?: string; $mobileButtonWidth?: string }>(
  ({ $buttonWidth, $mobileButtonWidth }) => css`
    width: ${$mobileButtonWidth ? `${$mobileButtonWidth}` : '100%'};
    ${mq.md.min(css`
      width: ${$buttonWidth ? `${$buttonWidth}` : '100%'};
    `)}
  `,
)

export const DisabledButtonWithTooltip = ({
  size = 'small',
  content,
  buttonId,
  buttonText = 'Edit',
  placement = 'left',
  mobilePlacement = 'left',
  width = 250,
  mobileWidth = 150,
  buttonWidth,
  mobileButtonWidth,
  prefix,
}: {
  size?: Size
  content: string
  buttonId: string
  buttonText?: string
  placement?: Placement
  mobilePlacement?: Placement
  width?: number
  mobileWidth?: number
  buttonWidth?: string
  mobileButtonWidth?: string
  prefix?: ReactNodeNoStrings
}) => {
  const { shouldShowTooltipIndicator, onSeen } = useTooltipSeenManager(buttonId)
  console.log('shouldShowTooltipIndicator: ', shouldShowTooltipIndicator)
  return (
    <>
      <Tooltip
        {...{
          content: <div>{content}</div>,
          targetId: buttonId,
          placement,
          mobilePlacement,
          onShowCallback: onSeen,
          width,
          mobileWidth,
        }}
      >
        <ButtonContainer {...{ $buttonWidth: buttonWidth, $mobileButtonWidth: mobileButtonWidth }}>
          <Button
            id={buttonId}
            size={size}
            shouldShowTooltipIndicator={shouldShowTooltipIndicator}
            colorStyle="disabled"
            prefix={prefix}
            data-testid={buttonId}
          >
            {buttonText}
          </Button>
        </ButtonContainer>
      </Tooltip>
    </>
  )
}
