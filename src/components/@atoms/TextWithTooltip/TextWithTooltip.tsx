import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { OutlinkSVG, QuestionCircleSVG, Tooltip, Typography } from '@ensdomains/thorin'

const TooltipContent = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.space[2]};
    text-align: center;
    color: ${theme.colors.indigo};
    pointer-events: all;
  `,
)

const Link = styled.a(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space[1]};
    color: ${theme.colors.indigo};
  `,
)

const Container = styled.button(
  ({ theme }) => css`
    height: ${theme.space[7]};
    display: inline-flex;
    align-items: center;
    text-decoration: underline dashed ${theme.colors.indigo};
  `,
)

export const TextWithTooltip = ({
  link,
  tooltipContent,
  children,
}: {
  tooltipContent: string
  link?: string
  children?: React.ReactNode
}) => {
  const { t } = useTranslation('common')
  return (
    <Tooltip
      content={
        <TooltipContent>
          <QuestionCircleSVG width={20} height={20} />
          <Typography color="text" fontVariant="small">
            {tooltipContent}
          </Typography>
          {link && (
            <Link href={link} target="_blank" rel="noreferrer noopener">
              <Typography color="indigo" fontVariant="small">
                {t('action.learnMore')}
              </Typography>
              <OutlinkSVG />
            </Link>
          )}
        </TooltipContent>
      }
      background="indigoSurface"
    >
      <Container>
        <Typography fontVariant="smallBold" color="indigo">
          {children}
        </Typography>
      </Container>
    </Tooltip>
  )
}
