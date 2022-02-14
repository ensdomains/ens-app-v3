import { gql, useQuery } from "@apollo/client";
import { GET_REVERSE_RECORD } from "@app/graphql/queries";
import { useBreakpoint } from "@app/utils/BreakpointProvider";
import { imageUrl } from "@app/utils/utils";
import {
  Button,
  IconEthTransparentInverted,
  Profile,
  Spinner,
  vars,
} from "@ensdomains/thorin";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import styled from "styled-components";

const NETWORK_INFORMATION_QUERY = gql`
  query getNetworkInfo @client {
    accounts
    isReadOnly
    isSafeApp
    avatar
    network
    displayName
  }
`;

const StyledIconEthTransparentInverted = styled(IconEthTransparentInverted)`
  margin-right: calc(${vars.space["2"]} * -1);
  margin-left: calc(${vars.space["2"]} * -1);
`;

export const HeaderConnect = () => {
  const breakpoints = useBreakpoint();
  const { t } = useTranslation("common");
  const {
    data: { accounts, network, displayName, isReadOnly },
  } = useQuery(NETWORK_INFORMATION_QUERY);

  const { data: { getReverseRecord } = {}, loading: reverseRecordLoading } =
    useQuery(GET_REVERSE_RECORD, {
      variables: {
        address: accounts?.[0],
      },
      skip: !accounts?.length,
    });

  useEffect(
    () => console.log(isReadOnly, accounts, reverseRecordLoading),
    [isReadOnly, accounts, reverseRecordLoading, network]
  );

  return !isReadOnly ? (
    <Profile
      address={accounts[0]}
      ensName={displayName}
      dropdownItems={[
        {
          label: t("profile.disconnect"),
          color: "red",
          onClick: () =>
            import("@app/utils/providerUtils").then((module) =>
              module.disconnectProvider()
            ),
        },
      ]}
      avatar={
        !reverseRecordLoading &&
        getReverseRecord &&
        getReverseRecord.avatar &&
        imageUrl(getReverseRecord?.avatar, displayName, network)
      }
      size={breakpoints.sm ? "medium" : "small"}
      alignDropdown="right"
    />
  ) : (
    <Button
      onClick={() =>
        import("@app/utils/providerUtils").then((module) =>
          module.connectProvider()
        )
      }
      prefix={
        network === "Loading" || accounts?.[0] ? (
          <Spinner color="white" />
        ) : (
          <StyledIconEthTransparentInverted size={{ xs: "4", sm: "6" }} />
        )
      }
      variant="action"
      size={breakpoints.sm ? "medium" : "small"}
    >
      Connect
    </Button>
  );
};
