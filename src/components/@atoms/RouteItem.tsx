import { useActiveRoute } from '@app/hooks/useActiveRoute'
import { RouteItemObj } from '@app/routes'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { ConditionalWrapper } from '../ConditionalWrapper'

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
          color: ${theme.colors.textPlaceholder};
          cursor: not-allowed;
        `
      : css`
          &:hover {
            color: ${theme.colors.textSecondary};
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
    color: ${$active ? theme.colors.accent : 'rgba(196, 196, 196, 1)'};
    width: ${theme.space['6']};
    height: ${theme.space['6']};
    ${disabled &&
    css`
      color: ${theme.colors.foregroundSecondary};
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
        <Link href={route.href} passHref>
          {wrapperChildren}
        </Link>
      )}
    >
      <LinkWrapper $asText={asText} $hasNotification={hasNotification}>
        {asText ? (
          <StyledAnchor disabled={route.disabled} $isActive={isActive}>
            {t(route.label)}
          </StyledAnchor>
        ) : (
          <IconContainer
            disabled={route.disabled}
            $active={isActive}
            as={route.icon}
          />
        )}
      </LinkWrapper>
    </ConditionalWrapper>
  )
}
