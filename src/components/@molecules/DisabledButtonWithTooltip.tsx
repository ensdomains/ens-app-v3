import { ComponentProps } from 'react'

import { AsProp, Button, ButtonProps, Tooltip } from '@ensdomains/thorin'

import { useTooltipSeenManager } from '@app/hooks/useTooltipSeenManager'

type Placement = NonNullable<ComponentProps<typeof Tooltip>['placement']>
type Size = ComponentProps<typeof Button>['size']

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
  colorStyle = 'disabled',
  prefix,
  loading = false,
}: {
  size?: Size
  content: string
  buttonId: string
  buttonText?: string
  placement?: Placement
  mobilePlacement?: Placement
  width?: number
  mobileWidth?: number
  buttonWidth?: ButtonProps['width']
  colorStyle?: ButtonProps['colorStyle']
  prefix?: AsProp
  loading?: boolean
}) => {
  const { shouldShowTooltipIndicator, onSeen } = useTooltipSeenManager(buttonId)
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
        <Button
          id={buttonId}
          size={size}
          shouldShowTooltipIndicator={shouldShowTooltipIndicator}
          colorStyle={colorStyle}
          prefix={prefix}
          data-testid={buttonId}
          width={buttonWidth}
          loading={loading}
          disabled
        >
          {buttonText}
        </Button>
      </Tooltip>
    </>
  )
}
