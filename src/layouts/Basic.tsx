import { Footer } from "@app/components/Footer";
import { LoadingOverlay } from "@app/components/LoadingOverlay";
import { Box } from "@ensdomains/thorin";
import { Header } from "../components/Header";

export const Basic = ({
  loading = false,
  children,
}: {
  loading?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Box
      paddingX={{ xs: "8", sm: "16" }}
      paddingY={{ xs: "10", sm: "12" }}
      display="flex"
      gap="8"
      flexDirection="column"
      alignItems="stretch"
      minWidth="full"
      minHeight="viewHeight"
    >
      <Header />
      <Box flexGrow={1} display="flex" flexDirection="column">
        {loading ? <LoadingOverlay /> : children}
      </Box>

      <Footer />
    </Box>
  );
};
