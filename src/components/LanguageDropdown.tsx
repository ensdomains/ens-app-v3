import mq from '@app/mediaQuery'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { Dropdown } from '@ensdomains/thorin'
import ISO6391 from 'iso-639-1'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'

const MobileInnerDropdownButton = styled.div<{ $large: boolean }>`
  ${({ theme, $large }) => css`
    width: fit;
    padding: ${theme.space['0.5']} ${theme.space['1.5']};
    display: block;
    font-size: ${theme.fontSizes.label};
    align-items: center;
    transition: none;
    ${$large &&
    mq.small.min`
      width: ${theme.space['12']};
      padding: 0;
      display: flex;
      align-items: flex-start;
    `}
  `}
`

export const LanugageDropdown = () => {
  const breakpoints = useBreakpoint()
  const router = useRouter()
  const { i18n } = useTranslation()

  const isLarge: boolean = router.asPath === '/' && !!breakpoints.sm

  const formatName = (language: string) =>
    isLarge ? ISO6391.getNativeName(language) : language.toUpperCase()

  return i18n.options ? (
    <Dropdown
      inner
      shortThrow={!isLarge}
      chevron={isLarge}
      size={isLarge ? 'medium' : 'small'}
      items={(i18n.options as any).locales
        .filter((lang: string) => lang !== i18n.language)
        .map((lang: string) => ({
          label: formatName(lang),
          onClick: () =>
            router.push(
              { pathname: router.pathname, query: router.query },
              router.asPath,
              { locale: lang },
            ),
        }))}
      menuLabelAlign="flex-start"
      label={
        <MobileInnerDropdownButton $large={isLarge}>
          {formatName(i18n.language)}
        </MobileInnerDropdownButton>
      }
    />
  ) : null
}
