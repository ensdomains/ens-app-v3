import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { PageButtons, Select } from '@ensdomains/thorin'

import { useBreakpoint } from '@app/utils/BreakpointProvider'

const Container = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    padding: ${theme.space['3']} ${theme.space['3']};
    border-top: 1px solid ${theme.colors.borderTertiary};
  `,
)

type PageButtonProps = ComponentProps<typeof PageButtons>

type Props = {
  pageSize: number
  onPageSizeChange?: (results: number) => void
} & Omit<PageButtonProps, 'size' | 'max' | 'alwaysShowFirst' | 'alwaysShowLast'>

export const NameTableFooter = ({ pageSize, onPageSizeChange, ...props }: Props) => {
  const { t } = useTranslation('common')
  const breakpoints = useBreakpoint()

  const pageSizeOptions = [1, 5, 10, 25, 50, 100].map((value) => ({
    label: breakpoints.sm ? t('unit.perPage', { count: value }) : `${value}`,
    value: value.toString(),
  }))

  const max = breakpoints.sm ? 5 : 3

  return (
    <Container>
      <PageButtons
        {...props}
        size="small"
        max={max}
        alwaysShowFirst={breakpoints.sm}
        alwaysShowLast={breakpoints.sm}
      />
      <div>
        <Select
          hideLabel
          label="Results per page"
          direction="up"
          align="right"
          value={pageSize?.toString()}
          size="small"
          options={pageSizeOptions}
          onChange={(e) => onPageSizeChange?.(parseInt(e.target.value))}
        />
      </div>
    </Container>
  )
}
