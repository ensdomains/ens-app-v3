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

const EllipsesWrapper = styled(Box)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: ${vars.fontSizes.headingTwo};
  font-weight: bold;
`;

const ProfileSection = ({
  condition,
  label,
  array,
  button,
  supported,
  type,
}: {
  condition: any;
  label: string;
  array: Array<Record<"key" | "value", string>>;
  button: any;
  supported?: Array<string>;
  type?: "address" | "text";
}) => {
  const { t } = useTranslation("profile");
  const Button = button;
  const supportedArray = supported
    ? array.filter((x) => supported.includes(x.key.toLowerCase()))
    : array;
  const unsupportedArray = supported
    ? array
        .filter((x) => !supported.includes(x.key.toLowerCase()))
        .map((x) => ({ ...x, type }))
    : [];

  return condition ? (
    <Box>
      <Typography color="textSecondary" weight="bold" size="base">
        {t(label)}
      </Typography>
      <Box marginTop="2" marginLeft="-4">
        <Stack direction="horizontal" space="2" wrap>
          {supportedArray.map(
            (item: {
              key: string;
              value: string;
              type?: "text" | "address";
            }) => (
              <Button {...{ ...item, iconKey: item.key }} />
            )
          )}
          {unsupportedArray.length > 0 &&
            unsupportedArray.map(
              (item: {
                key: string;
                value: string;
                type?: "text" | "address";
              }) => <OtherProfileButton {...{ ...item, iconKey: item.key }} />
            )}
        </Stack>
      </Box>
    </Box>
  ) : null;
};

export const ProfileDetails = ({
  name,
  formattedName,
  network,
  textRecords = [],
  addresses = [],
}: {
  name: string;
  formattedName: string;
  network: string;
  textRecords: Array<Record<"key" | "value", string>>;
  addresses: Array<Record<"key" | "value", string>>;
}) => {
  const getTextRecord = (key: string) => textRecords.find((x) => x.key === key);
  const otherRecords = [
    ...textRecords
      .filter((x) => !supportedTexts.includes(x.key.toLowerCase()))
      .map((x) => ({ ...x, type: "text" })),
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
        placeholder={!getTextRecord("avatar")}
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
      <Stack direction="horizontal" align="center">
        <EllipsesWrapper>{formattedName || name}</EllipsesWrapper>
        {getTextRecord("name") && (
          <Box marginTop="1">
            <Typography weight="bold" color="textTertiary">
              {getTextRecord("name")?.value}
            </Typography>
          </Box>
        )}
      </Stack>
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
            type="address"
            condition={addresses && addresses.length > 0}
            supported={supportedAddresses}
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
