import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useDisconnect } from 'wagmi'

import { ExitSVG } from '@ensdomains/thorin'

import { ConditionalWrapper } from '@app/components/ConditionalWrapper'
import { useActiveRoute } from '@app/hooks/useActiveRoute'
import { RouteItemObj } from '@app/routes'

import BaseLink from '../BaseLink'

const LinkWrapper = styled.a<{
  $asText?: boolean
  $disabled?: boolean
  $isActive: boolean
}>(
  ({ theme, $asText, $disabled, $isActive }) => css`
    --indicator-color: ${theme.colors.accent};
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['1.5']};
    cursor: pointer;

    color: ${theme.colors.greyPrimary};
    transition: all 0.15s ease-in-out;

    ${!$asText
      ? css`
          width: ${theme.space['9']};
          height: ${theme.space['9']};
        `
      : css`
          svg {
            width: ${theme.space['4']};
            height: ${theme.space['4']};
          }
        `}
    ${$disabled
      ? css`
          color: ${theme.colors.greyBright};
          cursor: not-allowed;
        `
      : css`
          &:hover {
            color: ${$isActive ? theme.colors.accentBright : theme.colors.textPrimary};
          }
        `}
    ${$isActive &&
    css`
      color: ${theme.colors.accent};
    `}
    &::after {
      height: ${theme.space['2']};
      width: ${theme.space['2']};
      border: none;
      top: ${theme.space['0.5']};
      right: ${theme.space['0.5']};
    }
  `,
)

const StyledAnchor = styled.div(
  ({ theme }) => css`
    white-space: nowrap;
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.fontSizes.body};
  `,
)

const IconContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space['6']};
    height: ${theme.space['6']};
  `,
)

export const RouteItem = ({
  active,
  route,
  hasNotification,
  asText,
}: {
  active?: boolean
  route: RouteItemObj
  hasNotification?: boolean
  asText?: boolean
}) => {
  const { t } = useTranslation('common')
  const activeRoute = useActiveRoute()
  const isActive = active || activeRoute === route.name
  const icon = isActive ? route.icon?.active! : route.icon?.inactive!

  return (
    <ConditionalWrapper
      condition={!route.disabled}
      wrapper={(wrapperChildren) => (
        <BaseLink href={route.href} passHref>
          {wrapperChildren}
        </BaseLink>
      )}
    >
      <LinkWrapper
        $asText={asText}
        $isActive={isActive}
        $disabled={route.disabled}
        className="indicator-container"
        data-indicator={hasNotification}
      >
        {asText ? (
          <>
            <IconContainer as={icon} data-testid="route-item-icon" />
            <StyledAnchor data-testid="route-item-text">{t(route.label)}</StyledAnchor>
          </>
        ) : (
          <IconContainer as={icon} data-testid="route-item-icon" />
        )}
      </LinkWrapper>
    </ConditionalWrapper>
  )
}

export const DisconnectButton = () => {
  const { disconnect } = useDisconnect()

  return (
    <LinkWrapper $isActive={false} as="button" onClick={() => disconnect()} type="button">
      <IconContainer as={ExitSVG} />
    </LinkWrapper>
  )
}
