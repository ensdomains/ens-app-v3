import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { OutlinkSVG, QuestionCircleSVG, Tooltip, Typography } from '@ensdomains/thorin'

import { getSupportLink } from '@app/utils/supportLinks'

import { Role } from '../../../../../../../../../hooks/ownership/useRoles/useRoles'

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

export const RoleTag = ({ role }: { role: Role }) => {
  const { t } = useTranslation('common')
  const link = getSupportLink(role)
  const [open, setOpen] = useState<true | undefined>()
  return (
    <Tooltip
      isOpen={open}
      content={
        <TooltipContent onMouseLeave={() => setOpen(undefined)}>
          <QuestionCircleSVG />
          <Typography color="text" fontVariant="small">
            {t(`roles.${role}.description`)}
          </Typography>
          {link && (
            <Link href={link}>
              <Typography color="indigo" fontVariant="small">
                {t('action.learnMore')}
              </Typography>
              <OutlinkSVG />
            </Link>
          )}
        </TooltipContent>
      }
      background="indigoSurface"
    >
      <Container
        data-testid={`role-tag-${role}`}
        type="button"
        onClick={() => setOpen((_open) => (_open ? undefined : true))}
      >
        <RoleLabel fontVariant="smallBold" color="indigo">
          {t(`roles.${role}.title`)}
        </RoleLabel>
      </Container>
    </Tooltip>
  )
}
