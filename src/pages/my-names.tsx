import { gql, useQuery } from "@apollo/client";
import { ProfileNftDetails } from "@app/components/profile/ProfileNftDetails";
import { useGetDomainFromInput } from "@app/hooks/useGetDomainFromInput";
import { Basic } from "@app/layouts/Basic";
import { Box, Select, Stack, Typography } from "@ensdomains/thorin";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const NETWORK_INFORMATION_QUERY = gql`
  query getNetworkInfo @client {
    isAppReady
    network
    accounts
    primaryName
    isReadOnly
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

const MyNamesPage: NextPage = () => {
  const {
    data: { isAppReady, network, accounts, primaryName },
    loading,
  } = useQuery(NETWORK_INFORMATION_QUERY);

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
        <Box>
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
