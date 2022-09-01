import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, DownIndicatorSVG, Typography } from '@ensdomains/thorin'

import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

const AccordionTitle = styled.div<{
  $isActive?: boolean
  $isDisabled?: boolean
}>(
  ({ theme, $isActive, $isDisabled }) => css`
    padding: ${theme.space['4']} ${theme.space['6']};
    background: ${theme.colors.white};
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${!$isDisabled ? 'cursor: pointer;' : ''}

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
    transition: all ${theme.transitionDuration['300']} ${theme.transitionTimingFunction.out};

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
  return <AccordionBodyContainer {...{ $isActive: isActive }}>{children}</AccordionBodyContainer>
}

const AccordionItem = styled.div`
  width: 100%;
  height: 100%;
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

const Chevron = styled(DownIndicatorSVG)<{
  $open?: boolean
}>(
  ({ theme, $open }) => css`
    margin-left: ${theme.space['1']};
    width: ${theme.space['3']};
    margin-right: ${theme.space['0.5']};
    transition-duration: ${theme.transitionDuration['200']};
    transition-property: all;
    transition-timing-function: ${theme.transitionTimingFunction.inOut};
    opacity: 0.3;
    transform: rotate(0deg);
    display: flex;

    & > svg {
      fill: currentColor;
    }
    fill: currentColor;

    ${$open &&
    css`
      opacity: 1;
      transform: rotate(180deg);
    `}
  `,
)

const UnwrappedIndicator = styled(Typography)(
  ({ theme }) => `
    background: ${theme.colors.grey};
    padding: ${theme.space[1]} ${theme.space[3]};
    border-radius: ${theme.radii.almostExtraLarge};
`,
)

const TitleAndButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`

const EditButton = styled(Button)(
  ({ theme }) => css`
    color: ${theme.colors.blue};
    width: ${theme.space['24']};
  `,
)

export interface AccordionData {
  title: string
  body: React.FC
  disabled?: boolean
  name: string
  canEdit?: boolean
}
interface AccordionProps {
  data: AccordionData[]
  name: string
}

const Accordion = ({ data, name }: AccordionProps) => {
  const { t } = useTranslation('profile')
  const { showDataInput } = useTransactionFlow()

  const [activeItem, setActiveItem] = useState(0)

  const handleEditClick = (idx: number) => {
    if (data[idx].name === 'resolverDetails') {
      showDataInput(`resolver-upgrade-${name}`, 'EditResolver', {
        name,
      })
    }
  }

  const disabled = data?.filter((x) => x.disabled) ?? []
  const enabled = data?.filter((x) => !x.disabled) ?? []

  return (
    <>
      <AccordionContainer {...{ $activeItem: activeItem, $totalItems: data && data.length }}>
        {!!disabled.length &&
          disabled.map((item) => {
            return (
              <AccordionItem data-testid={`accordion-${item.title}-disabled`} key={item.title}>
                <AccordionTitle $isDisabled>
                  <Typography variant="extraLarge" weight="bold" color="textTertiary">
                    {item.title}
                  </Typography>
                  <UnwrappedIndicator color="textSecondary">
                    {t('details.notWrapped')}
                  </UnwrappedIndicator>
                </AccordionTitle>
              </AccordionItem>
            )
          })}
        {!!enabled.length &&
          enabled.map((item, idx) => {
            const isActive = activeItem === idx
            return (
              <AccordionItem
                data-testid={`accordion-${item.title}-enabled`}
                {...{ onClick: () => setActiveItem(idx), key: item.title }}
              >
                <AccordionTitle {...{ isActive }}>
                  <TitleAndButtonContainer>
                    <Typography variant="extraLarge" weight="bold">
                      {item.title}
                    </Typography>
                    {item.canEdit && (
                      <EditButton
                        shadowless
                        variant="transparent"
                        size="small"
                        onClick={() => handleEditClick(idx)}
                      >
                        {t('action.edit', { ns: 'common' })}
                      </EditButton>
                    )}
                  </TitleAndButtonContainer>
                  <Chevron $open={isActive} />
                </AccordionTitle>
                <AccordionBody
                  data-testid={`accordion-${item.title}-body`}
                  {...{
                    key: idx,
                    isActive,
                  }}
                >
                  <item.body />
                </AccordionBody>
              </AccordionItem>
            )
          })}
      </AccordionContainer>
    </>
  )
}

export default Accordion
