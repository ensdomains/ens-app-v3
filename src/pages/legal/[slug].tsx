/* stylelint-disable no-descending-specificity */
import { readFileSync } from 'fs'
import path from 'path'

import Markdown from 'markdown-to-jsx'
import { GetStaticPropsContext } from 'next'
import { ReactElement } from 'react'
import styled, { css } from 'styled-components'
import { globSync } from 'tinyglobby'

import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'

const Container = styled.div(
  ({ theme }) => css`
    line-height: ${theme.lineHeights.body};

    &,
    ol {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
    }

    gap: ${theme.space['4']};

    ol {
      gap: ${theme.space['1']};
      padding: ${theme.space['2']} 0;
      position: relative;
      counter-reset: section;
      list-style-type: none;
      margin-left: ${theme.space['4']};
      list-style-position: outside;
    }

    & > ol {
      gap: ${theme.space['6']};
    }

    li {
      margin-left: ${theme.space['4']};
    }

    li::before {
      text-align: right;
      transform: translateX(calc(-100% - ${theme.space['1']}));
      position: absolute;
      counter-increment: section;
      content: counters(section, '.') '. ';
    }

    ol ol ol li::before {
      content: '';
    }

    ol ol ol {
      list-style-position: outside;
      list-style-type: lower-alpha;
    }

    ol ol ol ol {
      list-style-position: outside;
      list-style-type: lower-roman;
    }

    a {
      color: ${theme.colors.accent};
      &:hover {
        filter: brightness(1.05);
      }
    }
  `,
)

function Page({
  source,
  title,
  lastModified,
}: {
  source: string
  title: string
  lastModified: string
}) {
  return (
    <Content title={title} subtitle={`Last modified: ${lastModified}`} alwaysShowSubtitle>
      {{
        trailing: (
          <Markdown options={{ wrapper: Container, forceWrapper: true }}>{source}</Markdown>
        ),
      }}
    </Content>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}

const getFilePaths = () =>
  globSync(['./src/assets/legal/*.md'], { cwd: process.cwd(), absolute: true })

const getPageName = (pathname: string) => {
  const pageName = path.basename(pathname, '.md')
  return pageName.replace(path.extname(pageName), '')
}

export function getStaticPaths() {
  return {
    paths: getFilePaths().map((x) => ({ params: { slug: getPageName(x) } })),
    fallback: false,
  }
}

export function getStaticProps(context: GetStaticPropsContext) {
  const slug = context.params!.slug as string
  const title = slug
    .replace(/-/g, ' ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())
  const pathname = getFilePaths().find((x) => getPageName(x) === slug) as string
  const source = readFileSync(pathname, 'utf-8')
  const lastModified = source.match(/(?<=Last modified: )(.*)/g)?.[0] || ''

  return {
    props: {
      title,
      source: source.replace(/Last modified: (.*)/, ''),
      lastModified,
    },
  }
}

export default Page
