import mq from "@app/mediaQuery";
import { useBreakpoint } from "@app/utils/BreakpointProvider";
import { Box, DropdownButton, vars } from "@ensdomains/thorin";
import ISO6391 from "iso-639-1";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styled from "styled-components";

const MobileInnerDropdownButton = styled(Box)<{ $large: boolean }>`
  width: fit;
  padding: ${vars.space["0.5"]} ${vars.space["1.5"]};
  display: block;
  font-size: ${vars.fontSizes.label};
  align-items: center;

  ${({ $large }) =>
    $large &&
    mq.small.min`
    width: ${vars.space["12"]};
    padding: 0;
    display: flex;
    align-items: flex-start;
  `}
`;

export const LanugageDropdown = () => {
  const breakpoints = useBreakpoint();
  const router = useRouter();
  const { i18n } = useTranslation();

  const isLarge: boolean = router.asPath === "/" && !!breakpoints.sm;

  const formatName = (language: string) =>
    isLarge ? ISO6391.getNativeName(language) : language.toUpperCase();

  return i18n.options ? (
    <DropdownButton
      inner
      shortThrow={!isLarge}
      chevron={isLarge}
      size={isLarge ? "medium" : "small"}
      dropdownItems={(i18n.options as any).locales
        .filter((lang: string) => lang !== i18n.language)
        .map((lang: string) => ({
          label: formatName(lang),
          onClick: () =>
            router.push(
              { pathname: router.pathname, query: router.query },
              router.asPath,
              { locale: lang }
            ),
        }))}
    >
      <MobileInnerDropdownButton $large={isLarge}>
        {formatName(i18n.language)}
      </MobileInnerDropdownButton>
    </DropdownButton>
  ) : null;
};
