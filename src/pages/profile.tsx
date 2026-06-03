import type { Hex } from 'viem'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { AlertSVG, Typography } from '@ensdomains/thorin'

import ProfileContent from '@app/components/pages/profile/[name]/Profile'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useControllerLimits } from '@app/hooks/useControllerLimits'
import { useInitial } from '@app/hooks/useInitial'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useReservedStatus } from '@app/hooks/useReservedStatus'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { checkDNS2LDFromName } from '@app/utils/utils'

const UnregisteredWrap = styled.div(
  ({ theme }) => css`
    width: 100%;
    max-width: 466px;
    margin: ${theme.space['8']} auto 0;
    padding: 0 ${theme.space['4']};
  `,
)

const UnregisteredCard = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['3']};
    padding: ${theme.space['4']};
    border-radius: ${theme.radii['2xLarge']};
    background-color: ${theme.colors.yellowSurface};
    border: 1px solid ${theme.colors.yellowPrimary};
  `,
)

const UnregisteredIcon = styled.div(
  ({ theme }) => css`
    flex-shrink: 0;
    width: ${theme.space['10']};
    height: ${theme.space['10']};
    border-radius: ${theme.radii.full};
    background-color: ${theme.colors.yellowPrimary};
    color: ${theme.colors.backgroundPrimary};
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 18px;
      height: 18px;
    }
  `,
)

const UnregisteredText = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['0.5']};
  `,
)

const UnregisteredSub = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.greyPrimary};
  `,
)

export default function Page() {
  const router = useRouterWithHistory()
  const _name = router.query.name as string
  const isSelf = router.query.connected === 'true'
  const isViewingExpired = router.query.expired === 'true'

  const initial = useInitial()

  const { address } = useAccount()

  const primary = usePrimaryName({ address: address as Hex })

  const name = isSelf && primary.data?.name ? primary.data.name : _name

  // Skip graph for for initial load and router redirect
  const nameDetails = useNameDetails({ name })
  const {
    isBasicLoading,
    isProfileLoading,
    isDnsOwnerLoading,
    registrationStatus,
    gracePeriodEndDate,
  } = nameDetails

  const isLoading =
    isBasicLoading || isProfileLoading || primary.isLoading || initial || !router.isReady

  // Hoist SNRC-specific hooks above any conditional early return so React
  // sees a stable hook count across renders (Rules of Hooks).
  const { isReserved } = useReservedStatus({ name })
  const { minCharLength } = useControllerLimits()
  const label = name ? String(name).split('.')[0] : ''
  const labelLen = label.length
  // Subnames (3LD+) aren't registered through SimplexController.register, so
  // the minCharLength gate doesn't apply.
  const isSubname = !!name && String(name).split('.').length > 2
  const isTooShort = !!minCharLength && !isSubname && labelLen > 0 && labelLen < minCharLength

  if (isViewingExpired && gracePeriodEndDate && gracePeriodEndDate > new Date()) {
    router.push(`/profile/${name}`)
    return null
  }

  if (
    (registrationStatus === 'available' || registrationStatus === 'premium') &&
    !isViewingExpired &&
    !isBasicLoading
  ) {
    router.push(`/register/${name}`)
    return null
  }

  const isDns = checkDNS2LDFromName(name)
  if (isDns && registrationStatus === 'notImported' && !isBasicLoading && !isDnsOwnerLoading) {
    router.push(`/import/${name}`)
    return null
  }

  // Names that aren't registered (and where registration is blocked or
  // impossible) shouldn't render the empty-looking ProfileContent — that
  // makes them look registered. Show a yellow warning instead, matching
  // the home banner / min-chars helper style.
  if (!isBasicLoading && (isReserved || isTooShort || registrationStatus === 'invalid')) {
    const title = isReserved
      ? `${name} is reserved`
      : isTooShort
        ? `${name} is too short`
        : `${name} is not a valid name`
    const description = isReserved
      ? 'This label has been reserved by the SimpleX team and cannot be registered through the public flow.'
      : isTooShort
        ? `Names shorter than ${minCharLength} characters are not yet registrable. The admin lowers this limit over time.`
        : 'This is not a valid SimpleX name.'
    return (
      <UnregisteredWrap>
        <UnregisteredCard role="alert">
          <UnregisteredIcon>
            <AlertSVG />
          </UnregisteredIcon>
          <UnregisteredText>
            <Typography weight="bold">{title}</Typography>
            <UnregisteredSub fontVariant="small">{description}</UnregisteredSub>
          </UnregisteredText>
        </UnregisteredCard>
      </UnregisteredWrap>
    )
  }

  return (
    <ProfileContent
      {...{
        isSelf,
        isLoading,
        name,
      }}
    />
  )
}
