import { gql, useQuery } from "@apollo/client";
import { ProfileDetails } from "@app/components/profile/ProfileDetails";
import { ProfileNftDetails } from "@app/components/profile/ProfileNftDetails";
import { GET_SINGLE_NAME } from "@app/graphql/queries";
import { useGetRecords } from "@app/hooks/useGetRecords";
import { Basic } from "@app/layouts/Basic";
import mq from "@app/mediaQuery";
import { parseSearchTerm, validateName } from "@app/utils/utils";
import { Box } from "@ensdomains/thorin";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

const NETWORK_INFORMATION_QUERY = gql`
  query getNetworkInfo @client {
    isENSReady
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

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const _name = router.query.name as string;

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [valid, setValid] = useState<boolean | undefined>(undefined);
  const [type, setType] = useState<any>(undefined);
  /* eslint-enable @typescript-eslint/no-unused-vars */
  const [name, setNormalisedName] = useState("");

  const {
    data: { isENSReady, network, accounts, primaryName, isReadOnly },
  } = useQuery(NETWORK_INFORMATION_QUERY);
  const { data: { singleName: domain } = { singleName: undefined } } = useQuery(
    GET_SINGLE_NAME,
    {
      variables: { name },
      fetchPolicy: "no-cache",
      context: {
        queryDeduplication: false,
      },
    }
  );
  const { dataAddresses, dataTextRecords, recordsLoading } =
    useGetRecords(domain);
  const expiryDate = domain && domain.expiryTime && (domain.expiryTime as Date);

  useEffect(() => {
    let normalisedName;
    if (
      isENSReady &&
      (_name !== "me" || (_name === "me" && !isReadOnly && primaryName))
    ) {
      try {
        // This is under the assumption that validateName never returns false
        normalisedName = validateName(_name === "me" ? primaryName : _name);
        setNormalisedName(normalisedName);
      } finally {
        parseSearchTerm(normalisedName || _name).then((_type: any) => {
          if (_type === "supported" || _type === "tld" || _type === "search") {
            setValid(true);

            setType(_type);
          } else {
            if (_type === "invalid") {
              setType("domainMalformed");
            } else {
              setType(_type);
            }
            setValid(false);
          }
        });
      }
    }
  }, [_name, primaryName, isReadOnly, isENSReady]);

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
          dataAddresses &&
          !recordsLoading
        )
      }
    >
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
        >
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
