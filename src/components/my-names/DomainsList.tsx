import { Typography } from "@ensdomains/thorin";
import styled from "styled-components";

type Domain = {
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
  network,
  loading,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  view,
}: {
  domains: Domain[];
  network: string;
  loading: boolean;
  view: "list" | "grid";
}) => {
  if (loading) {
    return (
      <AllWrapper>
        <Typography>Loading Names...</Typography>
      </AllWrapper>
    );
  }

  if (domains.length === 0) {
    return (
      <AllWrapper>
        <Typography size="headingTwo" weight="bold" color="textTertiary">
          There are no names owned by this wallet
        </Typography>
      </AllWrapper>
    );
  }
  return null;
};
