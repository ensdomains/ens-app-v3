import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { mq, Space, Typography } from '@ensdomains/thorin'

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
        `
      : Object.entries($size)
          .filter(([key]) => key !== 'min')
          .map(([key, value]) =>
            mq[key as keyof typeof mq].min(css`
              width: ${theme.space[value as Space]};
              height: ${theme.space[value as Space]};
            `),
          )}
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
