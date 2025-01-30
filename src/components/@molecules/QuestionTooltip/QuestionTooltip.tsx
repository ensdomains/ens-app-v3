import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { OutlinkSVG, QuestionCircleSVG, Tooltip, Typography } from '@ensdomains/thorin'

const IconWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space[4]};
    height: ${theme.space[4]};
    color: ${theme.colors.indigo};

    cursor: pointer;

    svg {
      display: block;
    }
  `,
)

const Content = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[2]};
    align-items: center;
    color: ${theme.colors.indigo};
  `,
)

const CenteredTypography = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

const Link = styled.a(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space[1]};
    color: ${theme.colors.indigo};
    align-items: center;
    svg {
      width: ${theme.space[3]};
      height: ${theme.space[3]};
    }
  `,
)

type Props = { link?: string } & Omit<ComponentProps<typeof Tooltip>, 'children'>

export const QuestionTooltip = ({ content, link, ...props }: Props) => {
  const { t } = useTranslation('common')
  const _content = (
    <Content>
      <QuestionCircleSVG height={16} width={16} />
      <CenteredTypography fontVariant="small"> {content}</CenteredTypography>
      {link && (
        <Link href={link} target="_blank" rel="noreferrer noopener">
          <Typography fontVariant="smallBold" color="indigo">
            {t('action.learnMore')}
          </Typography>
          <OutlinkSVG />
        </Link>
      )}
    </Content>
  )
  return (
    <Tooltip {...props} content={_content} background="indigoSurface">
      <IconWrapper data-testid="question-icon">
        <QuestionCircleSVG width={16} height={16} />
      </IconWrapper>
    </Tooltip>
  )
}
