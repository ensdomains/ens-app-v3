import IconClock from "@app/assets/Clock.svg";
import { ensNftImageUrl, secondsToDays } from "@app/utils/utils";
import { Button, Dropdown, IconDotsVertical, vars } from "@ensdomains/thorin";
import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import type { Domain } from "./DomainsList";

const DomainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 16px;
`;

const DomainGridItem = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
`;

const StyledNftBox = styled.div<{ $loading: boolean }>`
  max-width: 270px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ $loading }) =>
    $loading ? vars.colors.accentGradient : "none"};
  border-radius: ${vars.radii["2xLarge"]};
  margin-bottom: ${vars.space["8"]};
  & > span {
    border-radius: ${vars.radii["2xLarge"]};
  }
`;

const ExpiryWrapper = styled.div<{ $color: string; $primary: boolean }>`
  display: flex;
  gap: 4px;
  flex-gap: 4px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${vars.colors.background};
  border-radius: ${vars.radii.full};
  padding: ${vars.space["0.5"]} ${vars.space["1.5"]};

  position: absolute;
  z-index: 5;
  right: calc(-1 * ${vars.space["1.5"]});
  top: calc(-1 * ${vars.space["1.5"]});
  border-radius: ${vars.radii.full};
  border-style: solid;
  border-width: 2px;
  border-color: rgba(
    ${({ $color }) => $color},
    ${({ $primary }) => ($primary ? "0.2" : "0.42")}
  );
  color: rgb(${({ $color }) => $color});
`;

const ExpiryText = styled.div<{ $primary: boolean }>`
  font-weight: bold;
  opacity: ${({ $primary }) => ($primary ? 0.6 : 0.8)};
`;

const Expiry = ({ expiry }: { expiry: string }) => {
  const date = new Date(parseInt(expiry) * 1000);
  const currentDate = new Date();
  const difference = secondsToDays(
    (date.getTime() - currentDate.getTime()) / 1000
  );
  const months = Math.round(difference / 30);
  const years = Math.round(difference / 365);
  let text = `${years}y`;
  let color = "foreground";

  if (difference < 0) {
    text = `${difference + 90}d`;
    color = "red";
  } else if (difference < 90) {
    text = `${months}m`;
    color = "orange";
  } else if (difference < 365) {
    text = `${months}m`;
    color = "foreground";
  }

  return (
    <ExpiryWrapper
      $primary={color === "foreground"}
      $color={(vars.mode.colors as any)[color]}
    >
      <IconClock
        opacity={color === "foreground" ? "0.2" : "0.8"}
        color={(vars.colors as any)[color]}
        width="16"
        height="16"
      />
      <ExpiryText $primary={color === "foreground"}>{text}</ExpiryText>
    </ExpiryWrapper>
  );
};

const DotMenuWrapper = styled.div`
  position: absolute;
  right: 24px;
  top: 36px;
  z-index: 5;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DotMenu = ({ name, expiry }: { name: string; expiry: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <DotMenuWrapper>
      <Dropdown
        isOpen={open}
        setIsOpen={setOpen}
        items={[
          {
            label: `Expires: ${new Date(
              parseInt(expiry) * 1000
            ).toLocaleDateString()}`,
            onClick: () => {},
          },
        ]}
        align="right"
      >
        <Button
          size="extraSmall"
          variant="secondary"
          shadowless
          shape="circle"
          onClick={() => setOpen(!open)}
        >
          <IconDotsVertical />
        </Button>
      </Dropdown>
    </DotMenuWrapper>
  );
};

const GridItem = ({
  name,
  network,
  expiry,
}: {
  name: string;
  network: string;
  expiry: string;
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <DomainGridItem>
      <Expiry expiry={expiry} />
      <DotMenu name={name} expiry={expiry} />
      <StyledNftBox $loading={loading}>
        <Image
          onLoadingComplete={() => setLoading(false)}
          src="/"
          loader={() => ensNftImageUrl(name, network)}
          width={270}
          height={270}
        />
      </StyledNftBox>
    </DomainGridItem>
  );
};

export const DomainsGridView = ({
  domains,
  network,
}: {
  domains: Domain[];
  network: string;
}) => {
  return (
    <DomainGrid>
      {domains.map((item: any) => (
        <GridItem
          key={item.domain.name}
          name={item.domain.name}
          expiry={item.expiryDate}
          network={network}
        />
      ))}
    </DomainGrid>
  );
};
