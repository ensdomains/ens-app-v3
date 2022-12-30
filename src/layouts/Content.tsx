import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Banner, Button, Skeleton, Typography, mq } from '@ensdomains/thorin'

import ArrowLeftSVG from '@app/assets/ArrowLeft.svg'
import { HamburgerRoutes } from '@app/components/@molecules/HamburgerRoutes'
import { LeadingHeading } from '@app/components/LeadingHeading'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

const HeadingItems = styled.div(
  ({ theme }) => css`
    grid-column: span 1;
    width: 100%;
    max-width: ${theme.space['192']};
    padding: 0 ${theme.radii.extraLarge};

    display: grid;
    grid-template-columns: 1fr;
    gap: ${theme.space['5']};
    align-self: center;
    align-items: center;
    min-height: ${theme.space['15']};
    ${mq.md.min(css`
      min-height: ${theme.space['10']};
      grid-column: span 2;
    `)}
  `,
)

const CustomLeadingHeading = styled(LeadingHeading)(
  ({ theme }) => css`
    gap: ${theme.space['2']};
    width: 100%;
    margin-left: 0;
  `,
)

const ContentContainer = styled.div(
  () => css`
    margin: 0;
    padding: 0;
    min-height: 0;
    width: 100%;
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
    color: ${theme.colors.greyPrimary};
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
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
)

const TitleWrapper = styled.div<{ $invert: boolean }>(
  ({ $invert }) => css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: stretch;
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

    ${mq.md.min(css`
      justify-content: flex-start;
      width: max-content;

      ${TitleContainer} {
        text-align: left;
        align-items: flex-start;
      }
    `)}
  `,
)

const DummyTitle = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingThree};
    line-height: ${theme.lineHeights.headingThree};
    white-space: pre-wrap;

    ${mq.md.min(css`
      font-size: ${theme.fontSizes.headingTwo};
      line-height: ${theme.lineHeights.headingTwo};
    `)}
  `,
)

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingThree};
    line-height: ${theme.lineHeights.headingThree};
    position: absolute;
    top: 0;
    white-space: nowrap;
    text-overflow: ellipsis;

    ${mq.md.min(css`
      font-size: ${theme.fontSizes.headingTwo};
      line-height: ${theme.lineHeights.headingTwo};
    `)}
  `,
)

const Subtitle = styled(Typography)(
  ({ theme }) => css`
    line-height: ${theme.lineHeights.body};
    color: ${theme.colors.greyPrimary};
  `,
)

const CompactTitle = ({
  invert,
  showSubtitle,
  title,
  subtitle,
  titleButton,
}: {
  invert: boolean
  showSubtitle: boolean
  title: string
  subtitle?: string
  titleButton: ReactNode
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [titleWidth, setTitleWidth] = useState(0)

  const callback = () => {
    const { current } = ref
    if (current) {
      const parent = current.parentElement!
      const parentGap = parseInt(window.getComputedStyle(parent).getPropertyValue('gap'))
      let newWidth = parent.offsetWidth
      for (const child of parent.children) {
        if (child !== current) {
          newWidth -= child.clientWidth + parentGap
        }
      }
      setTitleWidth(newWidth)
    }
  }

  useEffect(() => {
    const observer = new ResizeObserver(callback)
    observer.observe(document.body)
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <ContentContainer ref={ref}>
      <TitleWrapper $invert={invert}>
        {titleButton}
        <TitleContainer>
          <DummyTitle weight="bold"> </DummyTitle>
          <Title
            className="shrinkable-title"
            weight="bold"
            style={{ maxWidth: titleWidth, overflow: 'hidden' }}
          >
            {title}
          </Title>
          {showSubtitle && <Subtitle weight="bold">{subtitle}</Subtitle>}
        </TitleContainer>
      </TitleWrapper>
    </ContentContainer>
  )
}

export const Content = ({
  children,
  loading,
  noTitle,
  title,
  subtitle,
  alwaysShowSubtitle,
  singleColumnContent,
  titleButton,
  hideBack,
  hideHeading,
}: {
  noTitle?: boolean
  title: string
  subtitle?: string
  titleButton?: React.ReactNode
  alwaysShowSubtitle?: boolean
  singleColumnContent?: boolean
  loading?: boolean
  hideBack?: boolean
  hideHeading?: boolean
  children: {
    warning?: {
      type: 'warning' | 'error' | 'info'
      message: string | React.ReactNode
    }
    info?: React.ReactNode
    header?: React.ReactNode
    leading?: React.ReactNode
    trailing: React.ReactNode
  }
}) => {
  const router = useRouter()
  const breakpoints = useBreakpoint()

  const hasBack = router.query.from && !hideBack

  const WarningComponent = !loading && children.warning && (
    <WarningWrapper>
      <Banner alert={children.warning.type} message={children.warning.message} />
    </WarningWrapper>
  )

  const InfoComponent = !loading && children.info && (
    <WarningWrapper>{children.info}</WarningWrapper>
  )

  let LeadingComponent: ReactNode = children.leading ? (
    <ContentContainer>
      <Skeleton loading={loading}>{children.leading}</Skeleton>
    </ContentContainer>
  ) : (
    <ContentPlaceholder />
  )

  if (!children.leading && singleColumnContent) LeadingComponent = null

  return (
    <>
      {!noTitle && (
        <Head>
          <title>{title} - ENS</title>
        </Head>
      )}

      {breakpoints.md && WarningComponent}

      {breakpoints.md && InfoComponent}

      {!hideHeading && (
        <HeadingItems>
          <Skeleton loading={loading} as={FullWidthSkeleton as any}>
            <CustomLeadingHeading>
              {hasBack && (
                <div data-testid="back-button">
                  <Button onClick={() => router.back()} colorScheme="transparent" size="flexible">
                    <BackArrow as={ArrowLeftSVG} />
                  </Button>
                </div>
              )}
              <CompactTitle
                invert={!!hasBack}
                showSubtitle={!!(subtitle && (!breakpoints.md || alwaysShowSubtitle))}
                subtitle={subtitle}
                title={title}
                titleButton={titleButton}
              />
              {!hasBack && !breakpoints.md && <HamburgerRoutes />}
            </CustomLeadingHeading>
          </Skeleton>
        </HeadingItems>
      )}

      {!breakpoints.md && WarningComponent}
      {!breakpoints.md && InfoComponent}

      {LeadingComponent}

      {children.header && (
        <ContentContainer>
          <Skeleton loading={loading}>{children.header}</Skeleton>
        </ContentContainer>
      )}
      <ContentContainer>
        <Skeleton loading={loading} as={FullWidthSkeleton as any}>
          {children.trailing}
        </Skeleton>
      </ContentContainer>
    </>
  )
}
