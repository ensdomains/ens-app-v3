import styled, { css } from 'styled-components'

import { OutlinkSVG, QuestionCircleSVG, Tooltip, Typography } from '@ensdomains/thorin'

const ROLES_DICT = {
  owner: {
    label: 'Owner',
    description: 'Description',
  },
  manager: {
    label: 'Manager',
    description: 'Description',
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'eth-record': {
    label: 'ETH record',
    description: 'Description',
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'dns-owner': {
    label: 'DNS owner',
    description: 'Description',
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'parent-owner': {
    label: 'Parent owner',
    description: 'Description',
  },
}

const TooltipContent = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.space[2]};
    text-align: center;
    color: ${theme.colors.indigo};
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

export const RoleTag = ({ name }: { name: string }) => {
  const content = ROLES_DICT[name.toLowerCase() as keyof typeof ROLES_DICT]
  return (
    <Tooltip
      content={
        <TooltipContent>
          <QuestionCircleSVG />
          <Typography color="text" fontVariant="small">
            {content.description}
          </Typography>
          <Typography color="indigo" fontVariant="small">
            Learn more <OutlinkSVG />
          </Typography>
        </TooltipContent>
      }
    >
      <Container type="button">
        <Typography fontVariant="smallBold" color="indigo">
          {content.label}
        </Typography>
      </Container>
    </Tooltip>
  )
}
