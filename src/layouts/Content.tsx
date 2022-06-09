import ArrowLeftSVG from '@app/assets/ArrowLeft.svg'
import { ErrorContainer } from '@app/components/@molecules/ErrorContainer'
import { FilledHamburgerMenu } from '@app/components/@molecules/FilledHamburgerMenu'
import { LeadingHeading } from '@app/components/LeadingHeading'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { Button, mq, Skeleton, Typography } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'

const WrapperGrid = styled.div(
  ({ theme }) => css`
    flex-grow: 1;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, min-content);
    gap: ${theme.space['5']};
    align-self: center;
    ${mq.md.min(css`
      grid-template-columns: 270px 2fr;
    `)}
  `,
)

const HeadingItems = styled.div(
  ({ theme }) => css`
    grid-column: span 1;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: ${theme.space['5']};
    align-self: center;
    align-items: center;
    height: ${theme.space['15']};
    ${mq.md.min(css`
      height: ${theme.space['10']};
      grid-column: span 2;
      grid-template-columns: 270px 2fr;
    `)}
  `,
)

const ContentContainer = styled.div(
  () => css`
    margin: 0;
    padding: 0;
    min-height: 0;
    height: min-content;
  `,
)

const ContentPlaceholder = styled.div(
  () => css`
    display: none;
    height: 0;
    width: 0;
    ${mq.md.min(css`
      display: block;
    `)}
  `,
)

const BackArrow = styled.div(
  ({ theme }) => css`
    width: ${theme.space['6']};
    height: ${theme.space['6']};
    display: block;
  `,
)

const WarningWrapper = styled.div(
  () => css`
    width: 100%;
    grid-column: span 1;
    height: min-content;
    ${mq.md.min(css`
      grid-column: span 2;
    `)}
  `,
)

const FullWidthSkeleton = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
  `,
)

const TitleContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
)

const TitleWrapper = styled.div<{ $invert: boolean }>(
  ({ $invert }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;

    ${TitleContainer} {
      align-items: flex-start;
    }

    ${$invert &&
    css`
      flex-direction: row-reverse;

      ${TitleContainer} {
        align-items: flex-end;
      }
    `}
  `,
)

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
    line-height: ${theme.lineHeights.normal};
  `,
)

const Subtitle = styled(Typography)(
  ({ theme }) => css`
    line-height: ${theme.lineHeights.normal};
    color: ${theme.colors.textTertiary};
  `,
)

export const Content = ({
  children,
  loading,
  title,
  subtitle,
  titleButton,
}: {
  title: string
  subtitle?: string
  titleButton?: React.ReactNode
  loading?: boolean
  children: {
    warning?: {
      type: 'warning' | 'error' | 'info'
      message: string
    }
    header?: React.ReactNode
    leading: React.ReactNode
    trailing: React.ReactNode
  }
}) => {
  const router = useRouter()
  const breakpoints = useBreakpoint()

  return (
    <WrapperGrid>
      {!loading && children.warning && (
        <WarningWrapper>
          <ErrorContainer
            message={children.warning.message}
            type={children.warning.type}
          />
        </WarningWrapper>
      )}
      <HeadingItems>
        <Skeleton loading={loading} as={FullWidthSkeleton as any}>
          <LeadingHeading>
            {router.query.from && (
              <div data-testid="back-button">
                <Button
                  onClick={() => router.back()}
                  variant="transparent"
                  shadowless
                  size="extraSmall"
                >
                  <BackArrow as={ArrowLeftSVG} />
                </Button>
              </div>
            )}
            <ContentContainer>
              <TitleWrapper $invert={!!router.query.from}>
                {titleButton}
                <TitleContainer>
                  <Title weight="bold">{title}</Title>
                  {subtitle && !breakpoints.sm && (
                    <Subtitle weight="bold">{subtitle}</Subtitle>
                  )}
                </TitleContainer>
              </TitleWrapper>
            </ContentContainer>
            {!router.query.from && !breakpoints.sm && <FilledHamburgerMenu />}
          </LeadingHeading>
        </Skeleton>
        {children.header && breakpoints.sm && (
          <ContentContainer>
            <Skeleton loading={loading}>{children.header}</Skeleton>
          </ContentContainer>
        )}
      </HeadingItems>

      {children.leading ? (
        <ContentContainer>
          <Skeleton loading={loading}>{children.leading}</Skeleton>
        </ContentContainer>
      ) : (
        <ContentPlaceholder />
      )}
      {children.header && !breakpoints.sm && (
        <ContentContainer>
          <Skeleton loading={loading}>{children.header}</Skeleton>
        </ContentContainer>
      )}
      <ContentContainer>
        <Skeleton loading={loading} as={FullWidthSkeleton as any}>
          {children.trailing}
        </Skeleton>
      </ContentContainer>
    </WrapperGrid>
  )
}
