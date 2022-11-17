/* stylelint-disable no-descending-specificity */
import Markdown from 'markdown-to-jsx'
import { GetStaticPropsContext } from 'next'
import Link from 'next/link'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography, mq } from '@ensdomains/thorin'

import { Card } from '@app/components/Card'
import { faqOptions } from '@app/constants/faq'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'

const OptionLinks = styled(Card)(
  ({ theme }) => css`
    box-shadow: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: ${theme.space['2']};

    padding: ${theme.space['4']};

    & > a {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: ${theme.space['2']};
      color: ${theme.colors.textTertiary};
      transition: color 0.15s ease-in-out;

      & > svg {
        display: block;
        width: ${theme.space['4']};
        height: ${theme.space['4']};
      }

      &:hover {
        color: ${theme.colors.textSecondary};
      }

      &.selected {
        font-weight: bold;
        color: ${theme.colors.accent};
      }
    }

    ${mq.md.min(css`
      gap: ${theme.space['4']};
      padding: ${theme.space['6']};
    `)}
  `,
)

const OptionFAQ = styled(Card)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: ${theme.space['4']};

    padding: ${theme.space['4']};

    & > div {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;

      li {
        list-style: disc;
        margin: ${theme.space['1']} 0;
        margin-left: ${theme.space['4']};
      }

      li ul li {
        margin-left: ${theme.space['8']};
        list-style: circle;
      }

      a {
        color: ${theme.colors.accent};
        text-decoration: underline;
      }

      & > div:first-of-type {
        font-weight: ${theme.fontWeights.bold};
      }
    }

    & > div:first-of-type {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: ${theme.space['2']};
      font-size: ${theme.fontSizes.headingThree};
      font-weight: ${theme.fontWeights.bold};

      & > svg {
        display: block;
        width: ${theme.space['6']};
        height: ${theme.space['6']};
      }
    }

    ${mq.md.min(css`
      padding: ${theme.space['6']};
    `)}
  `,
)

function Page({ slug }: { slug: string }) {
  const currentOption = faqOptions.find((option) => option.slug === slug)!
  const { t } = useTranslation('faq')
  const questions = t(currentOption.title, { returnObjects: true }) as Record<string, string>
  const questionArray = Object.entries(questions)

  return (
    <Content title={t('title')}>
      {{
        leading: (
          <OptionLinks>
            {faqOptions.map(({ title, slug: itemSlug, icon: Icon }) => (
              <Link href={`/faq/${itemSlug}`} passHref key={title}>
                <a className={slug === itemSlug ? 'selected' : undefined}>
                  <Icon />
                  <Typography>{t(`option.${title}`)}</Typography>
                </a>
              </Link>
            ))}
          </OptionLinks>
        ),
        trailing: (
          <OptionFAQ>
            <div>
              <currentOption.icon />
              <Typography>{t(`option.${currentOption.title}`)}</Typography>
            </div>
            <>
              {questionArray.map(([question, answer]) => (
                <div key={question}>
                  <Typography>{question}</Typography>
                  <Typography>
                    <Markdown>{answer}</Markdown>
                  </Typography>
                </div>
              ))}
            </>
          </OptionFAQ>
        ),
      }}
    </Content>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}

export function getStaticPaths() {
  return {
    paths: faqOptions.map(({ slug }) => `/faq/${slug}`),
    fallback: false,
  }
}

export function getStaticProps(context: GetStaticPropsContext) {
  const slug = context.params!.slug as string

  return {
    props: {
      slug,
    },
  }
}

export default Page
