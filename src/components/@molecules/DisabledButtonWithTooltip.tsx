import { Button, Tooltip } from '@ensdomains/thorin'

import { useTooltipSeenManager } from '@app/hooks/useTooltipSeenManager'

type Placement = 'top' | 'bottom' | 'left' | 'right'

export const DisabledButtonWithTooltip = ({
  buttonId,
  buttonText = 'Edit',
  placement = 'left',
  mobilePlacement = 'left',
  width = 250,
  mobileWidth = 150,
}: {
  buttonId: string
  buttonText: string
  placement?: Placement
  mobilePlacement?: Placement
  width?: number
  mobileWidth?: number
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
      <Button
        id={buttonId}
        psuedoDisabled
        shadowless
        shouldShowTooltipIndicator={shouldShowTooltipIndicator}
      >
        {buttonText}
      </Button>
    </>
  )
}
