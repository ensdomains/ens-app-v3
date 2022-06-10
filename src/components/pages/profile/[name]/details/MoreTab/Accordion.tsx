import React, { useState } from 'react'
import styled from 'styled-components'
import { Typography } from '@ensdomains/thorin'

const AccordionTitle = styled.div`
  ${({ theme, isActive }) => `
        padding: ${theme.space['4']} ${theme.space['6']};
        background: ${theme.colors.white};  

        ${
          isActive
            ? `
        border-bottom: 
        ${theme.borderWidths.px} 
        ${theme.borderStyles.solid}
        ${theme.colors.borderTertiary}
        ;
        `
            : ``
        }
    `}
`

const AccordionBodyContainer = styled.div`
  ${({ theme, isActive }) => `
    transition: all ${theme.transitionDuration['300']} ${
    theme.transitionTimingFunction.out
  };

      ${
        isActive
          ? `
            padding: ${theme.space['4']} ${theme.space['6']};
            opacity: 100%;
            `
          : `
              height: 0;
              padding: 0 ${theme.space['6']};
              overflow: hidden;
              opacity: 0%;
              `
      }
`};
`

interface AccordionBodyProps {
  isActive: boolean
  setIsActive: () => null
  children: [React.ReactNode]
}

const AccordionBody = ({
  isActive,
  setIsActive,
  children,
}: AccordionBodyProps) => {
  return (
    <AccordionBodyContainer {...{ isActive, onClick: setIsActive }}>
      {children}
    </AccordionBodyContainer>
  )
}

const AccordionItem = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
`

const AccordionContainer = styled.div`
  ${({ theme, activeItem, totalItems }) => `
    box-shadow: ${theme.boxShadows['0.25']};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6), 0.3s color ease-in-out, 0.2s border-radius ease-in-out, 0s border-width 0.1s;
  
    border-radius: 16px;

    

    & > div:not(:last-child) {
      border-bottom: 
      ${theme.borderWidths.px} 
      ${theme.borderStyles.solid}
      ${theme.colors.borderTertiary}
      ;
  }

  & > div:first-child > div:first-child {
    border-radius: ${theme.radii['2xLarge']} ${theme.radii['2xLarge']} 0px 0px;
  }

  ${
    activeItem + 1 !== totalItems
      ? `
      
      & > div:last-child > div:first-child {
        border-radius: 0px 0px 16px 16px;
      }
  `
      : ``
  }

  `}
`

export interface AccordionData {
  title: 'string'
  body: React.ReactNode
}

interface AccordionProps {
  data: [AccordionData]
}

const Accordion = ({ data }: AccordionProps) => {
  const [activeItem, setActiveItem] = useState(0)

  return (
    <AccordionContainer {...{ activeItem, totalItems: data && data.length }}>
      {data &&
        data.map((item, idx) => {
          const isActive = activeItem === idx
          return (
            <AccordionItem {...{ onClick: () => setActiveItem(idx) }}>
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
