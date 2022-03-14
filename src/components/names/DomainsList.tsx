import { Typography } from "@ensdomains/thorin";
import styled from "styled-components";
import { DomainsGridView } from "./DomainsGridView";
import { DomainsListView } from "./DomainsListView";

export type Domain = {
  name: string;
  formattedName: string;
};

const AllWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const DomainsList = ({
  domains,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loading,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  view,
}: {
  domains: Domain[];
  loading: boolean;
  view: "list" | "grid";
}) => {
  const network = "mainnet";

  if (loading) {
    return (
      <AllWrapper>
        <Typography>Loading Names...</Typography>
      </AllWrapper>
    );
  }

  if (!domains || domains === undefined || domains.length === 0) {
    return (
      <AllWrapper>
        <Typography size="headingTwo" weight="bold" color="textTertiary">
          There are no names owned by this wallet
        </Typography>
      </AllWrapper>
    );
  }

  if (view === "list") {
    return <DomainsListView domains={domains} network={network} />;
  }

  return <DomainsGridView domains={domains} network={network} />;
};
