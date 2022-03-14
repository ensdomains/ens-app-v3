import { networkReactive } from "@app/apollo/reactiveVars";
import IconClock from "@app/assets/Clock.svg";
import { secondsToDays } from "@app/utils/utils";
import { Typography, vars } from "@ensdomains/thorin";
import styled from "styled-components";
import { DomainDetailItem } from "../DomainDetailItem";
import type { Domain } from "./DomainsList";

const ExpiryWrapper = styled.div`
  display: flex;
  gap: 4px;
  flex-gap: 4px;
`;

const OtherItemsContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const DomainDetailWrapper = styled.div`
  background-color: ${vars.colors.background};
  border-radius: ${vars.radii["2xLarge"]};
`;

const ReadableExpiry = ({ expiry }: { expiry: string }) => {
  const date = new Date(parseInt(expiry) * 1000);
  return (
    <ExpiryWrapper>
      <Typography weight="bold" color="textSecondary">
        {`${date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}, ${date.getFullYear()}`}
      </Typography>
      <Typography weight="bold" color="textTertiary">
        {`at ${date.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        })}`}
      </Typography>
    </ExpiryWrapper>
  );
};

const ExpiryClock = ({ expiry }: { expiry: string }) => {
  const date = new Date(parseInt(expiry) * 1000);
  const currentDate = new Date();
  const difference = secondsToDays(
    (date.getTime() - currentDate.getTime()) / 1000
  );

  if (difference < 0) {
    return <IconClock color={vars.colors.red} width="24" height="24" />;
  }
  if (difference < 90) {
    return <IconClock color={vars.colors.orange} width="24" height="24" />;
  }

  return <IconClock color={vars.colors.grey} width="24" height="24" />;
};

export const DomainsListView = ({
  domains,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  network,
}: {
  domains: Domain[];
  network: string;
}) => {
  return (
    <DomainDetailWrapper>
      {domains.map((item: any) => (
        <DomainDetailItem
          key={item.domain.name}
          network={networkReactive()?.name || "mainnet"}
          name={item.domain.name}
          formattedName={item.domain.formattedName}
        >
          <OtherItemsContainer>
            <ReadableExpiry expiry={item.expiryDate} />
            <ExpiryClock expiry={item.expiryDate} />
          </OtherItemsContainer>
        </DomainDetailItem>
      ))}
    </DomainDetailWrapper>
  );
};
