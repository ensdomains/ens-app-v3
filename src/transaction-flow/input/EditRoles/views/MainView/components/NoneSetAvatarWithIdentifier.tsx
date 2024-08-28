import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { QuerySpace } from '@app/types'

const Wrapper = styled.div<{ $size?: QuerySpace; $dirty?: boolean }>(
  ({ theme, $size, $dirty }) => css`
    background: ${$dirty ? theme.colors.greenLight : theme.colors.border};
    border-radius: ${theme.radii.full};

    ${typeof $size === 'object' &&
    css`
      width: ${theme.space[$size.min]};
      height: ${theme.space[$size.min]};
    `}
    ${typeof $size !== 'object'
      ? css`
          width: ${$size ? theme.space[$size] : theme.space.full};
          height: ${$size ? theme.space[$size] : theme.space.full};
          flex: 0 0 ${$size ? theme.space[$size] : theme.space.full};
        `
      : css`
          @media (min-width: ${theme.breakpoints.xs}px) {
            width: ${theme.space[$size.min]};
            height: ${theme.space[$size.min]};
            flex: 0 0 ${theme.space[$size.min]};
          }
          ${Object.keys($size)
            .filter((key) => key !== 'min' && key in theme.breakpoints)
            .map((key) => {
              const sizeValue = $size[key as keyof typeof $size]
              return sizeValue
                ? css`
                    @media (min-width: ${theme.breakpoints[
                        key as keyof typeof theme.breakpoints
                      ]}px) {
                      width: ${theme.space[sizeValue]};
                      height: ${theme.space[sizeValue]};
                      flex: 0 0 ${theme.space[sizeValue]};
                    }
                  `
                : null
            })}
        `}
  `,
)

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space[2]};
  `,
)

type Props = {
  dirty?: boolean
  size?: QuerySpace
}

export const NoneSetAvatarWithIdentifier = ({ dirty = false, size = '10' }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <Container>
      <Wrapper $size={size} $dirty={dirty} />
      <Typography fontVariant="bodyBold">{t('input.editRoles.views.main.noneSet')}</Typography>
    </Container>
  )
}
