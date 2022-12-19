import styled, { css } from 'styled-components'

import { Button, Tooltip, mq } from '@ensdomains/thorin'

import { useTooltipSeenManager } from '@app/hooks/useTooltipSeenManager'

type Placement = 'top' | 'bottom' | 'left' | 'right'

const ButtonContainer = styled.div<{ $buttonWidth?: string; $mobileButtonWidth?: string }>(
  ({ $buttonWidth, $mobileButtonWidth }) => css`
    width: ${$mobileButtonWidth ? `${$mobileButtonWidth}` : '100%'};
    ${mq.md.min(css`
      width: ${$buttonWidth ? `${$buttonWidth}` : '100%'};
    `)}
  `,
)

export const DisabledButtonWithTooltip = ({
  buttonId,
  buttonText = 'Edit',
  placement = 'left',
  mobilePlacement = 'left',
  width = 250,
  mobileWidth = 150,
  buttonWidth,
  mobileButtonWidth,
}: {
  buttonId: string
  buttonText?: string
  placement?: Placement
  mobilePlacement?: Placement
  width?: number
  mobileWidth?: number
  buttonWidth?: string
  mobileButtonWidth?: string
}) => {
  const { shouldShowTooltipIndicator, onSeen } = useTooltipSeenManager(buttonId)
  return (
    <>
      <Tooltip
        {...{
          content: <div>This name has revoked the permissions needed to perform this action</div>,
          targetId: buttonId,
          placement,
          mobilePlacement,
          onShowCallback: onSeen,
          width,
          mobileWidth,
          open: true,
        }}
      />
      <ButtonContainer {...{ $buttonWidth: buttonWidth, $mobileButtonWidth: mobileButtonWidth }}>
        <Button
          id={buttonId}
          size="small"
          psuedoDisabled
          shadowless
          shouldShowTooltipIndicator={shouldShowTooltipIndicator}
        >
          {buttonText}
        </Button>
      </ButtonContainer>
    </>
  )
}
