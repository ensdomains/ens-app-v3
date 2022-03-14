import { gql, useQuery } from "@apollo/client";
import IconGrid from "@app/assets/Grid.svg";
import IconList from "@app/assets/List.svg";
import { DomainsList } from "@app/components/names/DomainsList";
import { ProfileNftDetails } from "@app/components/profile/ProfileNftDetails";
import { VerticalLine } from "@app/components/VerticalLine";
import { useDomainsByAddress } from "@app/hooks/useDomainsByAddress";
import { useGetDomainFromInput } from "@app/hooks/useGetDomainFromInput";
import { useGetReverseRecord } from "@app/hooks/useGetReverseRecord";
import { Basic } from "@app/layouts/Basic";
import { Button, Select, Typography } from "@ensdomains/thorin";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

const NETWORK_INFORMATION_QUERY = gql`
  query getNetworkInfo @client {
    isAppReady
    network
    accounts
    primaryName
    isReadOnly
    names
  }
`;

const SectionHeading = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div style={{ marginBottom: 16 }}>
    <Typography weight="bold" size="headingTwo">
      {title}
    </Typography>
    <Typography weight="bold" color="textTertiary">
      {subtitle}
    </Typography>
  </div>
);

const HorizontalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 64px;
  flex-gap: 64px;
`;

const DomainHeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-gap: 16px;
`;

const SortItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-gap: 8px;
`;

const MyNamesPage: NextPage = () => {
  const router = useRouter();
  const inputAddress = router.query.address as string;
  const isSelf = inputAddress === "me";

  const [viewType, setViewType] = useState<"grid" | "list">("list");
  const [sortType, setSortType] = useState<
    "expiryDate" | "labelName" | "registrationDate"
  >("expiryDate");
  const {
    data: { isAppReady, network, accounts, primaryName },
    loading,
  } = useQuery(NETWORK_INFORMATION_QUERY);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentDate, setCurrentDate] = useState<number>(
    Date.now() / 1000 - 90 * 24 * 60 * 60
  );

  const { data, loading: domainsLoading } = useDomainsByAddress({
    resultsPerPage: 10,
    domainType: "registrant",
    address: isSelf ? accounts && accounts[0].toLowerCase() : inputAddress,
    sort: {
      direction: "asc",
      type: sortType,
    },
    expiryDate: parseInt(currentDate.toString()),
  });

  const { data: reverseData, loading: reverseLoading } = useGetReverseRecord(
    inputAddress && inputAddress.toLowerCase(),
    isSelf
  );

  const { domain, loading: domainLoading } = useGetDomainFromInput(
    isSelf ? primaryName : reverseData?.name,
    (isSelf && !primaryName) || !reverseData?.name
  );

  const expiryDate = domain && domain.expiryTime && (domain.expiryTime as Date);

  return (
    <Basic
      title="My Names"
      loading={
        loading ||
        domainLoading ||
        !isAppReady ||
        (primaryName && isSelf && !domain?.name) ||
        (!isSelf && reverseLoading) ||
        (reverseData?.name && !domain)
      }
    >
      <HorizontalWrapper>
        <div>
          <SectionHeading title="Primary" subtitle="Your web3 username" />
          {(isSelf && primaryName) || (!isSelf && reverseData?.name) ? (
            <ProfileNftDetails
              domain={domain}
              expiryDate={expiryDate}
              name={isSelf ? primaryName : reverseData?.name}
              network={network}
              selfAddress={accounts?.[0]}
            />
          ) : (
            <Typography>No Primary Set</Typography>
          )}
        </div>
        <div style={{ flexGrow: 1 }}>
          <DomainHeading>
            <SectionHeading
              title="Names"
              subtitle="All the names held by your wallet"
            />
            <div style={{ flexGrow: 1 }} />
            <SortItem>
              <Typography>Sort by</Typography>
              {/* implement a default select value once the infinite loop for select is fixed */}
              <Select
                label="Sort by"
                onChange={(e) =>
                  e?.value &&
                  setSortType(
                    e.value as "expiryDate" | "labelName" | "registrationDate"
                  )
                }
                hideLabel
                width="36"
                options={[
                  { label: "Expiration", value: "expiryDate" },
                  { label: "Name", value: "labelName" },
                  { label: "Registration", value: "registrationDate" },
                ]}
              />
            </SortItem>
            <VerticalLine style={{ height: "46px" }} />
            <Button
              pressed={viewType === "grid"}
              onClick={() => setViewType("grid")}
              variant="transparent"
              shadowless
              size="extraSmall"
            >
              <div style={{ height: "24px" }}>
                <IconGrid width="24" height="24" />
              </div>
            </Button>
            <Button
              pressed={viewType === "list"}
              onClick={() => setViewType("list")}
              variant="transparent"
              shadowless
              size="extraSmall"
            >
              <div style={{ height: "24px" }}>
                <IconList width="24" height="24" />
              </div>
            </Button>
          </DomainHeading>
          <DomainsList
            domains={data}
            loading={domainsLoading}
            view={viewType}
          />
        </div>
      </HorizontalWrapper>
    </Basic>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  };
}

export default MyNamesPage;
