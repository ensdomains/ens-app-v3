import { gql, useQuery } from "@apollo/client";
import { ProfileDetails } from "@app/components/profile/ProfileDetails";
import { ProfileNftDetails } from "@app/components/profile/ProfileNftDetails";
import { useGetDomainFromInput } from "@app/hooks/useGetDomainFromInput";
import { useGetRecords } from "@app/hooks/useGetRecords";
import { useProtectedRoute } from "@app/hooks/useProtectedRoute";
import { Basic } from "@app/layouts/Basic";
import mq from "@app/mediaQuery";
import { useBreakpoint } from "@app/utils/BreakpointProvider";
import { Box, IconArrowCircle, Typography, vars } from "@ensdomains/thorin";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

const NETWORK_INFORMATION_QUERY = gql`
  query getNetworkInfo @client {
    isENSReady
    isAppReady
    network
    accounts
    primaryName
    isReadOnly
  }
`;

const DetailsWrapper = styled(Box)`
  width: 90vw;
  max-width: 600px;

  ${mq.medium.min`
    width: 50vw;
  `}
`;

const ArrowBack = styled(Box)`
  color: ${vars.colors.textTertiary};
  transform: rotate(180deg);
  width: ${vars.space["7"]};
  height: ${vars.space["7"]};
`;

const BackContainer = styled(Box)`
  transition: all 0.15s ease-in-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${vars.space["2"]};

  &:hover {
    filter: contrast(0.8);
    transform: translateY(-1px);
  }
`;

const BackButton = ({ to }: { to: string }) => {
  const { t } = useTranslation("common");

  return (
    <Link href={to}>
      <a>
        <BackContainer>
          <ArrowBack as={IconArrowCircle} />
          <Typography weight="bold" color="textTertiary" size="large">
            {t("navigation.back")}
          </Typography>
        </BackContainer>
      </a>
    </Link>
  );
};

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const breakpoints = useBreakpoint();
  const _name = router.query.name as string;
  const isSelf = _name === "me";

  const [domain, setDomain] = useState<any>(undefined);

  const {
    data: {
      isENSReady,
      isAppReady,
      network,
      accounts,
      primaryName,
      isReadOnly,
    },
  } = useQuery(NETWORK_INFORMATION_QUERY);

  const name = isSelf ? primaryName : _name;

  const { domain: _domain, loading: domainLoading } =
    useGetDomainFromInput(name);
  const { dataAddresses, dataTextRecords, recordsLoading } =
    useGetRecords(_domain);

  useProtectedRoute(
    "/",
    // for /profile route, always redirect
    router.asPath !== "/profile" &&
      // When anything is loading, return true
      (network !== "Loading" && isENSReady && isAppReady
        ? // if is self, user must be connected
          (isSelf ? !isReadOnly : true) &&
          typeof name === "string" &&
          name.length > 0
        : true)
  );

  const expiryDate = domain && domain.expiryTime && (domain.expiryTime as Date);

  useEffect(() => {
    const timeout = _domain && setTimeout(() => setDomain(_domain), 100);
    return () => clearTimeout(timeout);
  }, [_domain]);

  return (
    <Basic
      title={
        (_name === "me" && "Your Profile") ||
        (domain && domain.name ? `${_name}'s Profile` : `Loading Profile`)
      }
      loading={
        !(
          network &&
          network !== "Loading" &&
          domain &&
          domain.name &&
          !domainLoading &&
          !recordsLoading
        )
      }
    >
      {router.query.from && !breakpoints.md && (
        <Box width="full" display="flex" alignItems="flex-start">
          <BackButton to={router.query.from as string} />
        </Box>
      )}
      <Box
        flexGrow={1}
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        width="full"
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column-reverse", md: "row" }}
          gap="8"
          position="relative"
          marginTop={router.query.from ? "8" : "0"}
        >
          {router.query.from && breakpoints.md && (
            <Box marginTop="-12" position="absolute">
              <BackButton to={router.query.from as string} />
            </Box>
          )}
          <ProfileNftDetails
            name={name}
            selfAddress={accounts?.[0]}
            {...{ network, expiryDate, domain }}
          />
          <DetailsWrapper>
            <ProfileDetails
              name={name}
              addresses={dataAddresses && dataAddresses.getAddresses}
              textRecords={dataTextRecords && dataTextRecords.getTextRecords}
              network={network}
            />
          </DetailsWrapper>
        </Box>
      </Box>
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

export default ProfilePage;
