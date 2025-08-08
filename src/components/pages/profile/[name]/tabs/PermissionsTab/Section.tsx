import { PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

import { DisabledSVG, InfoCircleSVG, Typography } from '@ensdomains/thorin'

type Screen = 'desktop' | 'mobile'

type Color = 'yellow' | 'grey'

export const Section = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    border-radius: ${theme.space[4]};
    border: ${theme.space.px} solid ${theme.colors.border};
    background: ${theme.colors.backgroundPrimary};

    > * {
      border-top: 1px solid ${theme.colors.border};
    }

    > *:first-child {
      border-top: none;
    }
  `,
)

export const SectionHeader = styled.div<{ $screen?: 'desktop' | 'mobile' }>(
  ({ theme, $screen }) => css`
    padding: ${theme.space['4']};
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};

    ${$screen === 'desktop' &&
    css`
      padding: ${theme.space['6']};
    `}
  `,
)

const SectionItemContainer = styled.div<{ $screen?: 'desktop' | 'mobile' }>(
  ({ theme, $screen }) => css`
    display: flex;
    align-items: flex-start;
    gap: ${theme.space['4']};

    padding: ${theme.space['4']};

    /* border-top: ${theme.space.px} solid ${theme.colors.border}; */

    ${$screen === 'desktop' &&
    css`
      padding: ${theme.space['4']} ${theme.space['6']};
    `}
  `,
)

const SectionItemIcon = styled.svg<{ $color: Color }>(
  ({ theme, $color }) => css`
    display: block;
    flex: 0 0 ${theme.space['6']};
    width: ${theme.space['6']};
    height: ${theme.space['6']};
    color: ${theme.colors[`${$color}Primary`]};
  `,
)

const SectionItemContent = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['1']};
  `,
)

type SectionItemProps = {
  icon?: 'info' | 'disabled'
  screen?: Screen
}
export const SectionItem = ({
  icon,
  screen,
  children,
  ...props
}: PropsWithChildren<SectionItemProps>) => {
  return (
    <SectionItemContainer $screen={screen} {...props}>
      {icon === 'info' ? (
        <SectionItemIcon as={InfoCircleSVG} $color="yellow" />
      ) : (
        <SectionItemIcon as={DisabledSVG} $color="grey" />
      )}
      <SectionItemContent>{children}</SectionItemContent>
    </SectionItemContainer>
  )
}

type SectionListProps = {
  title: string
}

const SectionListContainer = styled.div(
  ({ theme }) => css`
    ul {
      list-style-position: inside;
      list-style-type: none;
      padding: 0;
    }

    li {
      font-size: ${theme.fontSizes.small};
      font-weight: ${theme.fontWeights.normal};
      color: ${theme.colors.text};
    }

    li::before {
      content: '•';
      color: ${theme.colors.textPrimary};
      padding: 0 ${theme.space['2']};
    }
  `,
)
export const SectionList = ({ title, children }: PropsWithChildren<SectionListProps>) => {
  return (
    <SectionListContainer>
      <Typography fontVariant="smallBold" color="text">
        {title}
      </Typography>
      <ul>{children}</ul>
    </SectionListContainer>
  )
}

export const SectionFooter = styled.div<{ $screen?: Screen }>(
  ({ theme, $screen }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    /* border-top: ${theme.space.px} solid ${theme.colors.border}; */

    ${$screen === 'desktop' &&
    css`
      padding: ${theme.space[4]} ${theme.space['6']};
    `}
  `,
)
