import Head from 'next/head'
import { ComponentProps, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Banner, Button, Skeleton, Typography } from '@ensdomains/thorin'

import Hamburger from '@app/components/@molecules/Hamburger/Hamburger'
import { IconCopyAnimated } from '@app/components/IconCopyAnimated'
import { LeadingHeading } from '@app/components/LeadingHeading'
import { useContentWarning } from '@app/hooks/useContentWarning'
import { useCopied } from '@app/hooks/useCopied'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

type BannerProps = ComponentProps<typeof Banner>

export type ContentWarning =
  | {
      type: BannerProps['alert']
      title?: BannerProps['title']
      message: BannerProps['children']
    }
  | undefined

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
    min-height: ${theme.space['12']};
    @media (min-width: ${theme.breakpoints.sm}px) {
      min-height: ${theme.space['10']};
      grid-column: span 2;
    }
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
  ({ theme }) => css`
    display: none;
    height: 0;
    width: 0;
    @media (min-width: ${theme.breakpoints.sm}px) {
      display: block;
    }
  `,
)

const WarningWrapper = styled.div(
  ({ theme }) => css`
    width: 100%;
    grid-column: span 1;
    height: min-content;
    @media (min-width: ${theme.breakpoints.sm}px) {
      grid-column: span 2;
    }
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

const TitleWrapper = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: stretch;
    flex-direction: row;

    ${TitleContainer} {
      align-items: flex-start;
    }

    @media (min-width: ${theme.breakpoints.sm}px) {
      justify-content: flex-start;
      width: max-content;

      ${TitleContainer} {
        text-align: left;
        align-items: flex-start;
      }
    }
  `,
)

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingThree};
    line-height: ${theme.lineHeights.headingThree};
    white-space: nowrap;
    text-overflow: ellipsis;

    @media (min-width: ${theme.breakpoints.sm}px) {
      font-size: ${theme.fontSizes.headingTwo};
      line-height: ${theme.lineHeights.headingTwo};
    }
  `,
)

const Subtitle = styled(Typography)(
  ({ theme }) => css`
    line-height: ${theme.lineHeights.body};
    color: ${theme.colors.greyPrimary};
  `,
)

const CopyButton = styled(Button)(
  ({ theme }) => css`
    padding: 0;
    width: ${theme.space['8.5']};
    height: ${theme.space['8.5']};

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;

    margin-left: ${theme.space['2']};
  `,
)

const CompactTitle = ({
  title,
  titleButton,
  subtitle,
  copyValue,
}: {
  title: string
  titleButton: ReactNode
  subtitle?: string
  copyValue?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [titleWidth, setTitleWidth] = useState(0)
  const { copy, copied } = useCopied()

  const hasCopyButton = !!copyValue

  const callback = useCallback(() => {
    const { current } = ref
    if (current) {
      const parent = current.parentElement!
      const parentGap = parseInt(window.getComputedStyle(parent).getPropertyValue('gap'))
      // 48 width for copy button (40 + 8 padding)
      let newWidth = parent.offsetWidth - (hasCopyButton ? 48 : 0)
      for (const child of parent.children) {
        if (child !== current) {
          newWidth -= child.clientWidth + parentGap
        }
      }
      setTitleWidth(newWidth)
    }
  }, [hasCopyButton])

  useEffect(() => {
    const observer = new ResizeObserver(callback)
    observer.observe(document.body)
    return () => {
      observer.disconnect()
    }
  }, [callback])

  return (
    <ContentContainer ref={ref}>
      <TitleWrapper>
        {titleButton}
        <TitleContainer style={{ maxWidth: 'fit-content' }}>
          <Title
            className="shrinkable-title"
            weight="bold"
            style={{ maxWidth: titleWidth, overflow: 'hidden' }}
          >
            {title || ''}
          </Title>
          {subtitle && <Subtitle weight="bold">{subtitle}</Subtitle>}
        </TitleContainer>
        {hasCopyButton && (
          <CopyButton colorStyle="transparent" shape="square" onClick={() => copy(copyValue)}>
            <IconCopyAnimated copied={copied} color="grey" size="4.5" />
          </CopyButton>
        )}
      </TitleWrapper>
    </ContentContainer>
  )
}

export const Content = ({
  children,
  loading,
  noTitle,
  title,
  titleButton,
  subtitle,
  alwaysShowSubtitle,
  singleColumnContent,
  hideHeading,
  inlineHeading,
  copyValue,
}: {
  noTitle?: boolean
  title: string
  titleButton?: React.ReactNode
  subtitle?: string
  alwaysShowSubtitle?: boolean
  singleColumnContent?: boolean
  loading?: boolean
  hideHeading?: boolean
  inlineHeading?: boolean
  copyValue?: string
  children: {
    warning?: ContentWarning
    info?: React.ReactNode
    header?: React.ReactNode
    leading?: React.ReactNode
    trailing: React.ReactNode
    titleExtra?: React.ReactNode
  }
}) => {
  const router = useRouterWithHistory()
  const breakpoints = useBreakpoint()
  const isDesktopMode = breakpoints.sm

  const warning = useContentWarning([children.warning])
  const WarningComponent = !loading && warning && (
    <WarningWrapper>
      <Banner title={warning.title} alert={warning.type}>
        {warning.message}
      </Banner>
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

  const fullTitle = `${title} - ENS`

  if (!router.isReady) return null
  return (
    <>
      {!noTitle && (
        <Head>
          <title>{fullTitle}</title>
        </Head>
      )}

      {isDesktopMode && WarningComponent}

      {isDesktopMode && InfoComponent}

      {!hideHeading && (
        <HeadingItems>
          <Skeleton loading={loading} as={FullWidthSkeleton as any}>
            <CustomLeadingHeading>
              <CompactTitle
                copyValue={copyValue}
                title={title}
                subtitle={subtitle && (!isDesktopMode || alwaysShowSubtitle) ? subtitle : undefined}
                titleButton={titleButton}
              />
              {isDesktopMode && children.titleExtra}
              {inlineHeading && children.header && isDesktopMode && (
                <ContentContainer>
                  <Skeleton loading={loading}>{children.header}</Skeleton>
                </ContentContainer>
              )}
              {!isDesktopMode && <Hamburger />}
            </CustomLeadingHeading>
            {!isDesktopMode && children.titleExtra}
          </Skeleton>
        </HeadingItems>
      )}

      {!isDesktopMode && WarningComponent}
      {!isDesktopMode && InfoComponent}
      {LeadingComponent}

      {!inlineHeading && children.header && (
        <ContentContainer>
          <Skeleton loading={loading} as={FullWidthSkeleton as any}>
            {children.header}
          </Skeleton>
        </ContentContainer>
      )}
      {inlineHeading && children.header && !isDesktopMode && (
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
