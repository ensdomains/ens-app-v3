import { Box, Input } from "@ensdomains/thorin";

export const SearchInput = () => {
  return (
    <Box paddingX={{ xs: "0", md: "12" }} width="full">
      <Box
        boxShadow="0.25"
        borderRadius="2.5xLarge"
        borderWidth="px"
        borderColor="borderTertiary"
        width="full"
      >
        <Input
          size="extraLarge"
          borderRadius="2.5xLarge"
          label="Name search"
          hideLabel
          placeholder="Search for a name"
        />
      </Box>
    </Box>
  );
};
