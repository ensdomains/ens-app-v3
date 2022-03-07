import { gql, useQuery } from "@apollo/client";
import { DomainsList } from "@app/components/my-names/DomainsList";
import { ProfileNftDetails } from "@app/components/profile/ProfileNftDetails";
import {
  GET_DOMAINS_SUBGRAPH,
  GET_REGISTRATIONS_SUBGRAPH,
} from "@app/graphql/queries";
import { useGetDomainFromInput } from "@app/hooks/useGetDomainFromInput";
import { Basic } from "@app/layouts/Basic";
import { Box, Select, Stack, Typography } from "@ensdomains/thorin";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";

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
  <Box marginBottom="4">
    <Typography weight="bold" size="headingTwo">
      {title}
    </Typography>
    <Typography weight="bold" color="textTertiary">
      {subtitle}
    </Typography>
  </Box>
);

function useDomains({
  resultsPerPage,
  domainType,
  address,
  sort,
  page,
  expiryDate,
}: {
  resultsPerPage: number;
  domainType: "registrant" | "controller";
  address: string;
  sort: {
    type: "expiryDate" | "name";
    direction: "asc" | "desc";
  };
  page: number;
  expiryDate: number;
}) {
  const skip = (page - 1) * resultsPerPage;
  const registrationsQuery = useQuery(GET_REGISTRATIONS_SUBGRAPH, {
    variables: {
      id: address,
      first: resultsPerPage,
      skip,
      orderBy: sort.type,
      orderDirection: sort.direction,
      expiryDate,
    },
    skip: domainType !== "registrant",
    fetchPolicy: "no-cache",
  });

  const controllersQuery = useQuery(GET_DOMAINS_SUBGRAPH, {
    variables: {
      id: address,
      first: resultsPerPage,
      skip,
    },
    skip: domainType !== "controller",
    fetchPolicy: "no-cache",
  });

  if (domainType === "registrant") {
    return registrationsQuery;
  }
  if (domainType === "controller") {
    return controllersQuery;
  }
  throw new Error("Unrecognised domainType");
}

const MyNamesPage: NextPage = () => {
  const {
    data: { isAppReady, network, accounts, primaryName },
    loading,
  } = useQuery(NETWORK_INFORMATION_QUERY);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentDate, setCurrentDate] = useState<number>(Date.now() / 1000);

  const { data, loading: domainsLoading } = useDomains({
    resultsPerPage: 10,
    domainType: "registrant",
    address: accounts && accounts[0].toLowerCase(),
    sort: {
      direction: "asc",
      type: "expiryDate",
    },
    page: 1,
    expiryDate: parseInt(currentDate.toString()),
  });

  const { domain, loading: domainLoading } = useGetDomainFromInput(
    primaryName,
    !primaryName
  );

  const expiryDate = domain && domain.expiryTime && (domain.expiryTime as Date);

  return (
    <Basic
      title="My Names"
      loading={
        loading ||
        domainLoading ||
        !isAppReady ||
        (primaryName && !domain?.name)
      }
    >
      <Stack direction="horizontal" align="flex-start" space="16">
        <Box>
          <SectionHeading title="Primary" subtitle="Your web3 username" />
          <ProfileNftDetails
            domain={domain}
            expiryDate={expiryDate}
            name={primaryName}
            network={network}
            selfAddress={accounts?.[0]}
          />
        </Box>
        <Box flexGrow={1}>
          <Stack direction="horizontal" align="center" justify="space-between">
            <SectionHeading
              title="Names"
              subtitle="All the names held by your wallet"
            />
            <Box flexGrow={1} />
            <Box>
              <Stack direction="horizontal" justify="center" align="center">
                <Typography>Sort by</Typography>
                <Select
                  label="Sort by"
                  hideLabel
                  width="36"
                  options={[
                    { label: "Expiration", value: "expiryTime" },
                    { label: "Name", value: "name" },
                  ]}
                />
              </Stack>
            </Box>
          </Stack>
          <DomainsList
            domains={data?.getRegistrations}
            loading={domainsLoading}
            network="mainnet"
            view="list"
          />
        </Box>
      </Stack>
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
