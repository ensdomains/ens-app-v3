import { TOptions } from 'i18next'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'

import { OutlinkSVG, QuestionCircleSVG, Tooltip, Typography } from '@ensdomains/thorin'

import { Role } from '@app/hooks/ownership/useRoles/useRoles'
import { parentName } from '@app/utils/name'
import { getSupportLink } from '@app/utils/supportLinks'

const TooltipContent = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.space[2]};
    text-align: center;
    color: ${theme.colors.indigo};
    pointer-events: all;
  `,
)

const Link = styled.a(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space[1]};
    color: ${theme.colors.indigo};
  `,
)

const RoleLabel = styled(Typography)(
  () => css`
    ::first-letter {
      text-transform: uppercase;
    }
  `,
)

const Container = styled.button(
  ({ theme }) => css`
    height: ${theme.space[7]};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.small};
    display: flex;
    align-items: center;
    padding: 0 ${theme.space[2]};
    text-decoration: underline dashed ${theme.colors.indigo};
  `,
)

const getRoleTranslationKey = (
  role:
    | Role
    | 'owner-emancipated'
    | 'profile-editor'
    | 'subname-manager'
    | 'grace-period'
    | 'contract-address'
    | 'namewrapper',
): string =>
  match(role)
    .with('owner', () => 'tabs.ownership.tooltips.owner')
    .with('owner-emancipated', () => 'tabs.ownership.tooltips.owner-emancipated')
    .with('parent-owner', () => 'tabs.ownership.tooltips.parent-owner')
    .with('dns-owner', () => 'tabs.ownership.tooltips.dns-owner')
    .with('manager', () => 'tabs.ownership.tooltips.manager')
    .with('eth-record', () => 'tabs.ownership.tooltips.eth-record')
    .with('profile-editor', () => 'tabs.ownership.tooltips.profile-editor')
    .with('subname-manager', () => 'tabs.ownership.tooltips.subname-manager')
    .with('grace-period', () => 'tabs.ownership.tooltips.grace-period')
    .with('contract-address', () => 'tabs.ownership.tooltips.contract-address')
    .with('namewrapper', () => 'tabs.ownership.tooltips.namewrapper')
    .otherwise(() => '')

export const RoleTag = ({
  name,
  role,
  isEmancipated,
}: {
  name: string
  role: Role
  isEmancipated: boolean
}) => {
  const { t } = useTranslation('profile')
  const _role = isEmancipated && role === 'owner' ? 'owner-emancipated' : role
  const tOptions: TOptions = role === 'parent-owner' ? { parent: parentName(name) } : {}
  const link = getSupportLink(_role)
  return (
    <Tooltip
      content={
        <TooltipContent>
          <QuestionCircleSVG />
          <Typography color="text" fontVariant="small">
            {t(getRoleTranslationKey(role), tOptions)}
          </Typography>
          {link && (
            <Link href={link} target="_blank" rel="noreferrer noopener">
              <Typography color="indigo" fontVariant="small">
                {t('action.learnMore', { ns: 'common' })}
              </Typography>
              <OutlinkSVG />
            </Link>
          )}
        </TooltipContent>
      }
      background="indigoSurface"
    >
      <Container data-testid={`role-tag-${role}`} type="button">
        <RoleLabel fontVariant="smallBold" color="indigo">
          {t(`roles.${role}.title`, { ns: 'common' })}
        </RoleLabel>
      </Container>
    </Tooltip>
  )
}
