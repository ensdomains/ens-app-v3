import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography, mq } from '@ensdomains/thorin'

import { faqOptions } from '@app/constants/faq'
import { Content } from '@app/layouts/Content'

const OptionContainer = styled.div(
  ({ theme }) => css`
    flex-grow: 1;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(1fr, 4);
    gap: ${theme.space['3']};
    flex-gap: ${theme.space['3']};

    ${mq.md.min(css`
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(1fr 1fr, 2);
      height: 100%;
    `)}
  `,
)

const OptionItem = styled.a(
  ({ theme }) => css`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};
    padding: ${theme.space['6']};

    border: 1px solid ${theme.colors.grey};
    border-radius: ${theme.radii['2xLarge']};
    background-color: ${theme.colors.background};
    transition: all 0.15s ease-in-out;

    cursor: pointer;

    & > svg {
      display: block;
      color: ${theme.colors.accent};
      width: ${theme.space['12']};
      height: ${theme.space['12']};
    }

    & > div {
      font-weight: ${theme.fontWeights.bold};
      font-size: ${theme.fontSizes.extraLarge};
    }

    &:hover {
      background-color: ${theme.colors.backgroundSecondary};
      border-color: ${theme.colors.borderSecondary};
    }

    ${mq.md.min(css`
      padding: ${theme.space['10']} ${theme.space['6']};
    `)}
  `,
)

const spacing = '1fr'

export default function Page() {
  const { t } = useTranslation('faq')

  return (
    <Content singleColumnContent title={t('title')} spacing={spacing}>
      {{
        leading: null,
        trailing: (
          <OptionContainer>
            {faqOptions.map(({ title, slug, icon: Icon }) => (
              <Link href={`/faq/${slug}`} passHref key={title}>
                <OptionItem>
                  <Icon />
                  <Typography>{t(`option.${title}`)}</Typography>
                </OptionItem>
              </Link>
            ))}
          </OptionContainer>
        ),
      }}
    </Content>
  )
}

// const Wrapper = styled.div(
//   ({ theme }) => css`
//     flex-grow: 1;
//     display: flex;
//     flex-direction: column;
//     align-items: stretch;
//     justify-content: center;
//   `,
// )

// Page.getLayout = function getLayout(page: ReactElement) {
//   return <Wrapper>{page}</Wrapper>
// }
