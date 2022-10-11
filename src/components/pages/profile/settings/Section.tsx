import { ComponentProps, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Heading } from '@ensdomains/thorin'

import { Card } from '@app/components/Card'
import { useInitial } from '@app/hooks/useInitial'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;

    border: 1px solid ${theme.colors.borderTertiary};
    border-radius: ${theme.radii['2xLarge']};
    overflow: hidden;

    padding: 0;

    background-color: ${theme.colors.backgroundSecondary};
  `,
)

const SectionHeader = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    padding: ${theme.space['4']};
    width: ${theme.space.full};

    background-color: ${theme.colors.background};
    border-bottom: 1px solid ${theme.colors.borderTertiary};
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

  return (
    <StyledCard {...props}>
      <SectionHeader>
        <Heading>{title}</Heading>
        <div>{action}</div>
      </SectionHeader>
      {InnerContent}
    </StyledCard>
  )
}
