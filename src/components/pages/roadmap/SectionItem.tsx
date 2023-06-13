import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

import { Tag, Typography, mq } from '@ensdomains/thorin'

import { DynamicThorinIcon } from './DynamicThorinIcon'
import type { SectionCard } from './SectionCard'

type Color = ComponentProps<typeof SectionCard>['color']

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['4']};
  `,
)

const IconWrapper = styled.div<{ $color: Color }>(
  ({ theme, $color }) => css`
    color: ${theme.colors[`${$color}Primary`]};
    background: ${theme.colors[`${$color}Surface`]};
    flex: 0 0 ${theme.space['12']};
    width: ${theme.space['12']};
    height: ${theme.space['12']};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.radii.full};
  `,
)

const Content = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['1']};
  `,
)

const Header = styled.div(({ theme }) => [
  css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['1']};
  `,
  mq.sm.min(css`
    flex-direction: row;
    gap: ${theme.space['4']};
  `),
])

const StyledTag = styled(Tag)(
  ({ theme }) => css`
    white-space: nowrap;
    height: ${theme.space['5.5']};
  `,
)

type Icon = ComponentProps<typeof DynamicThorinIcon>['icon']

type Props = {
  title: string
  description: string
  icon: string
  tag?: string
  color: Color
}

export const SectionItem = ({ title, description, icon, tag, color }: Props) => {
  return (
    <Container>
      <IconWrapper $color={color}>
        <DynamicThorinIcon icon={icon as Icon} />
      </IconWrapper>
      <Content>
        <Header>
          <Typography fontVariant="largeBold">{title}</Typography>
          {tag && (
            <StyledTag size="small" colorStyle={`${color}Secondary`}>
              {tag}
            </StyledTag>
          )}
        </Header>
        {description}
      </Content>
    </Container>
  )
}
