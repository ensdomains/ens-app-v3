import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { Typography } from '@ensdomains/thorin'

const AccordionTitle = styled.div<{ $isActive?: boolean }>(
  ({ theme, $isActive }) => css`
    padding: ${theme.space['4']} ${theme.space['6']};
    background: ${theme.colors.white};

    ${$isActive
      ? `
        border-bottom: 
        ${theme.borderWidths.px} 
        ${theme.borderStyles.solid}
        ${theme.colors.borderTertiary}
        ;
        `
      : ``}
  `,
)

const AccordionBodyContainer = styled.div<{ $isActive: boolean }>(
  ({ theme, $isActive }) => css`
    transition: all ${theme.transitionDuration['300']}
      ${theme.transitionTimingFunction.out};

    ${$isActive
      ? `
          padding: ${theme.space['4']} ${theme.space['6']};
          opacity: 100%;
        `
      : `
          height: 0;
          padding: 0 ${theme.space['6']};
          overflow: hidden;
          opacity: 0%;
        `}
  `,
)

interface AccordionBodyProps {
  isActive: boolean
  children: [React.ReactNode] | React.ReactNode
}

const AccordionBody = ({ isActive, children }: AccordionBodyProps) => {
  return (
    <AccordionBodyContainer {...{ $isActive: isActive }}>
      {children}
    </AccordionBodyContainer>
  )
}

const AccordionItem = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
`

const AccordionContainer = styled.div<{
  $activeItem: number
  $totalItems: number
}>(
  ({ theme }) => css`
    box-shadow: ${theme.boxShadows['0.25']};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6), 0.3s color ease-in-out,
      0.2s border-radius ease-in-out, 0s border-width 0.1s;

    border-radius: ${theme.radii['2xLarge']};

    overflow: hidden;

    & > div {
      border-bottom: ${theme.borderWidths.px} ${theme.borderStyles.solid}
        ${theme.colors.borderTertiary};
      &:last-of-type {
        border-bottom: none;
      }
    }
  `,
)

export interface AccordionData {
  title: string
  body: React.ReactNode
}

interface AccordionProps {
  data: AccordionData[]
}

const Accordion = ({ data }: AccordionProps) => {
  const [activeItem, setActiveItem] = useState(0)

  return (
    <AccordionContainer
      {...{ $activeItem: activeItem, $totalItems: data && data.length }}
    >
      {data &&
        data.map((item, idx) => {
          const isActive = activeItem === idx
          return (
            <AccordionItem
              {...{ onClick: () => setActiveItem(idx), key: item.title }}
            >
              <AccordionTitle {...{ isActive }}>
                <Typography variant="extraLarge" weight="bold">
                  {item.title}
                </Typography>
              </AccordionTitle>
              <AccordionBody
                {...{
                  key: idx,
                  isActive,
                }}
              >
                {item.body}
              </AccordionBody>
            </AccordionItem>
          )
        })}
    </AccordionContainer>
  )
}

export default Accordion
