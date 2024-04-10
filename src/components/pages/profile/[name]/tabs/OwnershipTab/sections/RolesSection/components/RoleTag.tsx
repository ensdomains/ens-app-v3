import { TOptions } from 'i18next'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { OutlinkSVG, QuestionCircleSVG, Tooltip, Typography } from '@ensdomains/thorin'

import { TransComponentName } from '@app/components/@atoms/Name2/Name'
import { Role } from '@app/hooks/ownership/useRoles/useRoles'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
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
    position: relative;
    overflow: hidden;
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
  const breakpoints = useBreakpoint()
  const _role = isEmancipated && role === 'owner' ? 'owner-emancipated' : role
  const tOptions: TOptions = role === 'parent-owner' ? { parent: parentName(name) } : {}
  const maxWidth = breakpoints.sm ? 200 : 120
  const link = getSupportLink(_role)
  return (
    <Tooltip
      content={
        <TooltipContent>
          <QuestionCircleSVG />
          <Typography color="text" fontVariant="small">
            <Trans
              ns="profile"
              i18nKey={`tabs.ownership.tooltips.${_role}`}
              values={{ parent: parentName(name) }}
              components={{
                nameComponent: <TransComponentName type="inline" maxWidth={maxWidth} nextTick />,
              }}
            />
            {/* {t(`tabs.ownership.tooltips.${_role}`, tOptions)} */}
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
