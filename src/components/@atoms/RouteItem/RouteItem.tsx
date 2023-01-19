import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { ConditionalWrapper } from '@app/components/ConditionalWrapper'
import { useActiveRoute } from '@app/hooks/useActiveRoute'
import { RouteItemObj } from '@app/routes'

import BaseLink from '../BaseLink'

const LinkWrapper = styled.a<{ $hasNotification?: boolean; $asText?: boolean }>(
  ({ theme, $hasNotification, $asText }) => css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    ${!$asText &&
    css`
      width: ${theme.space['9']};
      height: ${theme.space['9']};
    `}
    ${$hasNotification &&
    css`
      &::after {
        content: '';
        position: absolute;
        height: ${theme.space['4']};
        width: ${theme.space['4']};
        border: ${theme.space['0.5']} solid ${theme.colors.background};
        background-color: ${theme.colors.red};
        border-radius: ${theme.radii.full};
        top: calc(-1 * ${theme.space['2']});
        right: ${theme.space['0.5']};
      }
    `}
  `,
)

const StyledAnchor = styled.div<{ $isActive: boolean; disabled?: boolean }>(
  ({ theme, $isActive, disabled }) => css`
    white-space: nowrap;
    color: ${theme.colors.textTertiary};
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.fontSizes.large};
    cursor: pointer;
    transition: color 0.125s ease-in-out;
    ${disabled
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
  `,
)

const IconContainer = styled.div<{ $active: boolean; disabled: boolean }>(
  ({ theme, $active, disabled }) => css`
    color: ${$active ? theme.colors.accent : theme.colors.greyPrimary};
    width: ${theme.space['6']};
    height: ${theme.space['6']};
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    transition: all 150ms ease-in-out;

    &:hover {
      color: ${$active ? theme.colors.accentBright : theme.colors.text};
    }

    ${disabled &&
    css`
      color: ${theme.colors.greyBright};
      &:hover {
        color: ${theme.colors.greyBright};
      }
    `}
  `,
)

export const RouteItem = ({
  route,
  hasNotification,
  asText,
}: {
  route: RouteItemObj
  hasNotification?: boolean
  asText?: boolean
}) => {
  const { t } = useTranslation('common')
  const activeRoute = useActiveRoute()
  const isActive = activeRoute === route.name

  return (
    <ConditionalWrapper
      condition={!route.disabled}
      wrapper={(wrapperChildren) => (
        <BaseLink href={route.href} passHref>
          {wrapperChildren}
        </BaseLink>
      )}
    >
      <LinkWrapper $asText={asText} $hasNotification={hasNotification}>
        {asText ? (
          <StyledAnchor
            data-testid="route-item-text"
            disabled={route.disabled}
            $isActive={isActive}
          >
            {t(route.label)}
          </StyledAnchor>
        ) : (
          <IconContainer
            disabled={route.disabled}
            $active={isActive}
            as={route.icon}
            data-testid="route-item-icon"
          />
        )}
      </LinkWrapper>
    </ConditionalWrapper>
  )
}
