import supportedAddresses from "@app/constants/supportedAddresses.json";
import supportedTexts from "@app/constants/supportedTexts.json";
import { imageUrl } from "@app/utils/utils";
import { Avatar, Box, Stack, Typography, vars } from "@ensdomains/thorin";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import {
  AddressProfileButton,
  OtherProfileButton,
  SocialProfileButton,
} from "./ProfileButton";

const ProfileInfoBox = styled(Box)`
  background-image: ${vars.colors.accentGradient};
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: 100% 120px;
`;

const ProfileSection = ({
  condition,
  label,
  array,
  button,
}: {
  condition: any;
  label: string;
  array: Array<Record<"key" | "value", string>>;
  button: any;
}) => {
  const { t } = useTranslation("profile");
  const Button = button;

  return (
    condition && (
      <Box>
        <Typography color="textSecondary" weight="bold" size="base">
          {t(label)}
        </Typography>
        <Box marginTop="2" marginLeft="-4">
          <Stack direction="horizontal" space="2" wrap>
            {array.map((item: { key: string; value: string }) => (
              <Button key={item.key} iconKey={item.key} value={item.value} />
            ))}
          </Stack>
        </Box>
      </Box>
    )
  );
};

export const ProfileDetails = ({
  name,
  network,
  textRecords,
  addresses,
}: {
  name: string;
  network: string;
  textRecords: Array<Record<"key" | "value", string>>;
  addresses: Array<Record<"key" | "value", string>>;
}) => {
  const getTextRecord = (key: string) => textRecords.find((x) => x.key === key);
  const otherRecords = [
    ...textRecords
      .filter((x) => !supportedTexts.includes(x.key.toLowerCase()))
      .map((x) => ({ ...x, type: "text" })),
    ...addresses
      .filter((x) => !supportedAddresses.includes(x.key.toLowerCase()))
      .map((x) => ({ ...x, type: "address" })),
  ];

  return (
    <ProfileInfoBox
      padding="12"
      backgroundColor="background"
      borderRadius="2xLarge"
    >
      <Avatar
        size="32"
        label={name}
        src={
          textRecords && textRecords.length > 0 && getTextRecord("avatar")
            ? imageUrl(
                (
                  getTextRecord("avatar") || {
                    key: "avatar",
                    value: "",
                  }
                ).value,
                name,
                network
              )
            : undefined
        }
      />
      <Typography size="headingTwo" weight="bold">
        {name}
      </Typography>
      {getTextRecord("description") && (
        <Typography>{getTextRecord("description")?.value}</Typography>
      )}
      {getTextRecord("url") && (
        <Box width="min">
          <a href={getTextRecord("url")?.value}>
            <Typography color="blue">
              {getTextRecord("url")
                ?.value.replace(/http(s?):\/\//g, "")
                .replace(/\/$/g, "")}
            </Typography>
          </a>
        </Box>
      )}
      <Box marginTop="4">
        <Stack direction="vertical" space="4">
          <ProfileSection
            label="accounts"
            condition={
              textRecords &&
              textRecords.filter((x) =>
                supportedTexts.includes(x.key.toLowerCase())
              ).length > 0
            }
            array={textRecords}
            button={SocialProfileButton}
          />
          <ProfileSection
            label="addresses"
            condition={
              addresses &&
              addresses.filter((x) =>
                supportedAddresses.includes(x.key.toLowerCase())
              ).length > 0
            }
            array={addresses}
            button={AddressProfileButton}
          />
          <ProfileSection
            label="otherRecords"
            condition={otherRecords && otherRecords.length > 0}
            array={otherRecords}
            button={OtherProfileButton}
          />
        </Stack>
      </Box>
    </ProfileInfoBox>
  );
};
