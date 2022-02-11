import { useBreakpoint } from "@app/utils/BreakpointProvider";
import { Box, DropdownButton } from "@ensdomains/thorin";
import ISO6391 from "iso-639-1";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export const LanugageDropdown = () => {
  const breakpoints = useBreakpoint();
  const router = useRouter();
  const { i18n } = useTranslation();

  const formatName = (language: string) =>
    breakpoints.sm ? ISO6391.getNativeName(language) : language.toUpperCase();

  return (
    <DropdownButton
      inner
      shortThrow={!breakpoints.sm}
      chevron={!!breakpoints.sm}
      size={breakpoints.sm ? "medium" : "small"}
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
      <Box
        width={{ xs: "fit", sm: "14" }}
        paddingX={{ xs: "1.5", sm: "0" }}
        paddingY={{ xs: "0.5", sm: "0" }}
        display={{ xs: "block", sm: "flex" }}
        fontSize={{ xs: "small", sm: "base" }}
        alignItems="flex-start"
      >
        {formatName(i18n.language)}
      </Box>
    </DropdownButton>
  );
};
