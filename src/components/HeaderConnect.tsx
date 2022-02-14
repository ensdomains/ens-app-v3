import { gql, useQuery } from "@apollo/client";
import { GET_REVERSE_RECORD } from "@app/graphql/queries";
import { useBreakpoint } from "@app/utils/BreakpointProvider";
import { imageUrl } from "@app/utils/utils";
import {
  Button,
  IconEthTransparentInverted,
  Profile,
  vars,
} from "@ensdomains/thorin";
import { useTranslation } from "next-i18next";
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
    />
  ) : (
    <Button
      onClick={() =>
        import("@app/utils/providerUtils").then((module) =>
          module.connectProvider()
        )
      }
      prefix={<StyledIconEthTransparentInverted size={{ xs: "4", sm: "6" }} />}
      variant="action"
      size={breakpoints.sm ? "medium" : "small"}
    >
      Connect
    </Button>
  );
};
