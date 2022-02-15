import { ensNftImageUrl, shortenAddress } from "@app/utils/utils";
import { Box, Stack, Typography, vars } from "@ensdomains/thorin";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { Fragment } from "react";
import styled from "styled-components";
import { CopyButton } from "../CopyButton";

const StyledNftBox = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${vars.space["8"]};
  & > span {
    border-radius: ${vars.radii["2xLarge"]};
  }
`;

export const ProfileNftDetails = ({
  name,
  selfAddress,
  network,
  expiryDate,
  domain,
}: {
  name: string;
  selfAddress?: string;
  network: string;
  expiryDate: Date;
  domain: Record<any, any>;
}) => {
  const { t } = useTranslation("profile");
  const { t: tc } = useTranslation("common");

  return (
    <Box>
      <StyledNftBox>
        <Image src={ensNftImageUrl(name, network)} width={270} height={270} />
      </StyledNftBox>
      <Box marginTop="4">
        <Stack>
          {[
            {
              label: tc("name.expires"),
              type: "text",
              value: `${expiryDate.toLocaleDateString(undefined, {
                month: "long",
              })} ${expiryDate.getDate()}, ${expiryDate.getFullYear()}`,
            },
            {
              label: tc("name.registrant"),
              type: "address",
              value: domain.registrant,
            },
            {
              label: tc("name.controller"),
              type: "address",
              value: domain.owner,
            },
          ].map((item, inx, arr) => (
            <Fragment key={item.label}>
              <Box
                marginX="2"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                fontWeight="bold"
              >
                <Typography color="textTertiary">{item.label}</Typography>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap="2"
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                    gap="1"
                  >
                    {item.type === "address" && item.value === selfAddress && (
                      <Typography color="textTertiary">
                        {t("yourWallet")}
                      </Typography>
                    )}
                    <Typography color="textSecondary">
                      {item.type === "address"
                        ? shortenAddress(item.value)
                        : item.value}
                    </Typography>
                  </Box>
                  {item.type === "address" && <CopyButton value={item.value} />}
                </Box>
              </Box>
              {inx !== arr.length - 1 && (
                <Box height="0.25" backgroundColor="foregroundSecondary" />
              )}
            </Fragment>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};
