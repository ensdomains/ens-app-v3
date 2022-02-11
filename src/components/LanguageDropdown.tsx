import { Box, DropdownButton } from "@ensdomains/thorin";
import ISO6391 from "iso-639-1";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export const LanugageDropdown = () => {
  const router = useRouter();
  const { i18n } = useTranslation();

  return (
    <DropdownButton
      inner
      dropdownItems={(i18n.options as any).locales.map((lang: string) => ({
        label: ISO6391.getNativeName(lang),
        onClick: () =>
          router.push(
            { pathname: router.pathname, query: router.query },
            router.asPath,
            { locale: lang }
          ),
      }))}
    >
      <Box width="14" display="flex" alignItems="flex-start">
        {ISO6391.getNativeName(i18n.language)}
      </Box>
    </DropdownButton>
  );
};
