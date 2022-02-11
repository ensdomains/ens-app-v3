import { Footer } from "@app/components/Footer";
import { Box } from "@ensdomains/thorin";
import { Header } from "../components/Header";

export const Basic = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      paddingX={{ xs: "8", sm: "16" }}
      paddingY={{ xs: "10", sm: "12" }}
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      minWidth="full"
      minHeight="viewHeight"
    >
      <Header />
      <Box flexGrow={1} display="flex" flexDirection="column">
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
