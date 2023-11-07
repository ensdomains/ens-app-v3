import { ComponentProps, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Card } from '@ensdomains/thorin'
import { Typography } from '@ensdomains/thorin2'

import { useInitial } from '@app/hooks/useInitial'

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
    <Card
      padding="0"
      overflow="hidden"
      alignItems="stretch"
      backgroundColor="$backgroundSecondary"
      {...props}
    >
      <SectionHeader $hideBorder={hideBorder}>
        <Typography fontVariant="largeBold">{title}</Typography>
        <div>{action}</div>
      </SectionHeader>
      {InnerContent}
    </Card>
  )
}
