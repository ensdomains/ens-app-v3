import Head from 'next/head'
import { ComponentProps, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Button } from '@ensdomains/thorin'
import { Banner, mq, Skeleton, Typography } from '@ensdomains/thorin2'

import Hamburger from '@app/components/@molecules/Hamburger/Hamburger'
import { IconCopyAnimated } from '@app/components/IconCopyAnimated'
import { LeadingHeading } from '@app/components/LeadingHeading'
import { useContentWarning } from '@app/hooks/useContentWarning'
import { useCopied } from '@app/hooks/useCopied'
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
    ${mq.sm.min(css`
      min-height: ${theme.space['10']};
      grid-column: span 2;
    `)}
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
    ${mq.sm.min(css`
      display: block;
    `)}
  `,
)

const WarningWrapper = styled.div(
  () => css`
    width: 100%;
    grid-column: span 1;
    height: min-content;
    ${mq.sm.min(css`
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

const TitleWrapper = styled.div(
  () => css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: stretch;
    flex-direction: row;

    ${TitleContainer} {
      align-items: flex-start;
    }

    ${mq.sm.min(css`
      justify-content: flex-start;
      width: max-content;

      ${TitleContainer} {
        text-align: left;
        align-items: flex-start;
      }
    `)}
  `,
)

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingThree};
    line-height: ${theme.lineHeights.headingThree};
    white-space: nowrap;
    text-overflow: ellipsis;

    ${mq.sm.min(css`
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
  title = '',
  titleButton,
  subtitle = '',
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
            {title}
          </Title>
          {subtitle && <Subtitle weight="bold">{subtitle}</Subtitle>}
        </TitleContainer>
        {hasCopyButton && (
          <Button
            colorStyle="transparent"
            shape="square"
            onClick={() => copy(copyValue)}
            px="$0"
            wh="$8.5"
            display="flex"
            alignItems="center"
            justifyContent="center"
            marginLeft="$2"
          >
            <IconCopyAnimated copied={copied} color="$grey" size="$4.5" />
          </Button>
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
  }
}) => {
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
            <LeadingHeading width="$full" marginLeft="$0" gap="$2">
              <CompactTitle
                copyValue={copyValue}
                title={title}
                subtitle={subtitle && (!isDesktopMode || alwaysShowSubtitle) ? subtitle : undefined}
                titleButton={titleButton}
              />
              {inlineHeading && children.header && isDesktopMode && (
                <ContentContainer>
                  <Skeleton loading={loading}>{children.header}</Skeleton>
                </ContentContainer>
              )}
              {!isDesktopMode && <Hamburger />}
            </LeadingHeading>
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
