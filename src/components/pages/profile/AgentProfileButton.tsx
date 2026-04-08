import { useMemo } from 'react'
import { useCopyToClipboard } from 'react-use'

import { CopySVG, Dropdown, RecordItem, UpRightArrowSVG, VerticalDotsSVG } from '@ensdomains/thorin'
import { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'

import { AgentRegistrationRecord } from '@app/utils/agentRegistration/transformAgentRegistrationRecord'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

// Icon components defined outside of parent components
const UpRightArrowIcon = () => <UpRightArrowSVG height={16} width={16} />
const CopyIcon = () => <CopySVG height={16} width={16} />

export const AgentProfileButton = ({
  agentId,
  registryAddress,
  registryDisplayName,
  explorerUrl,
  displayValue,
}: AgentRegistrationRecord) => {
  const breakpoints = useBreakpoint()
  const [, copy] = useCopyToClipboard()

  const items: DropdownItem[] = [
    {
      icon: CopyIcon,
      label: 'Copy agent ID',
      onClick: () => copy(agentId),
    },
    {
      icon: CopyIcon,
      label: 'Copy registry address',
      onClick: () => copy(registryAddress),
    },
    ...(explorerUrl
      ? [
          {
            icon: UpRightArrowIcon,
            label: 'View on explorer',
            onClick: () => window.open(explorerUrl, '_blank', 'noopener,noreferrer'),
          },
        ]
      : []),
  ]

  // Truncate display value for small screens
  const truncatedDisplayValue = useMemo(() => {
    if (breakpoints.sm) return displayValue
    // For small screens, show a shorter version
    return `id: ${agentId} | ${registryDisplayName}`
  }, [breakpoints.sm, displayValue, agentId, registryDisplayName])

  return (
    <Dropdown width={200} items={items} direction="up">
      <RecordItem
        data-testid={`agent-profile-button-${agentId}`}
        postfixIcon={VerticalDotsSVG}
        value={displayValue}
        size={breakpoints.sm ? 'large' : 'small'}
        inline
      >
        {truncatedDisplayValue}
      </RecordItem>
    </Dropdown>
  )
}
