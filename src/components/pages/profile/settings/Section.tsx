import { ComponentProps, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { Card } from '@app/components/Card'
import { useInitial } from '@app/hooks/useInitial'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;

    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii['2xLarge']};
    overflow: hidden;

    padding: 0;

    background-color: ${theme.colors.backgroundSecondary};
  `,
)

const SectionHeader = styled.div<{ $hideBorder?: boolean }>(
  ({ theme, $hideBorder }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    padding: ${theme.space['4']};
    width: ${theme.space.full};

    background-color: ${theme.colors.background};
    ${!$hideBorder &&
    css`
      border-bottom: 1px solid ${theme.colors.border};
    `}
  `,
)

const ContentContainer = styled.div<{ $hide?: boolean }>(
  ({ theme, $hide }) => css`
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
    justify-content: center;

    padding: ${theme.space['4']};
    gap: ${theme.space['2']};

    ${$hide &&
    css`
      display: none;
    `}
  `,
)

export const SectionContainer = ({
  title,
  action,
  children,
  fill,
  ...props
}: {
  title: string
  action?: ReactNode
  children: ReactNode
  fill?: boolean
} & Omit<ComponentProps<'div'>, 'ref'>) => {
  const isInitial = useInitial()

  let InnerContent: ReactNode

  if (isInitial || !fill) {
    InnerContent = <ContentContainer $hide={fill}>{children}</ContentContainer>
  } else {
    InnerContent = children
  }

  const hideBorder = !children

  return (
    <StyledCard {...props}>
      <SectionHeader $hideBorder={hideBorder}>
        <Typography fontVariant="largeBold">{title}</Typography>
        <div>{action}</div>
      </SectionHeader>
      {InnerContent}
    </StyledCard>
  )
}
