import { imageUrlUnknownRecord } from "@app/utils/utils";
import { Avatar, Typography, vars } from "@ensdomains/thorin";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import styled from "styled-components";

const DomainItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${vars.space["3"]} ${vars.space["4.5"]};
  border-bottom: 1px solid ${vars.colors.borderTertiary};
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: ${vars.colors.backgroundTertiary};
  }

  &:last-of-type {
    border: none;
  }
`;

const DomainItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-gap: 16px;
`;

type Domain = {
  name: string;
  formattedName: string;
};

export const DomainDetailItem = ({
  name,
  formattedName,
  network,
  children,
}: Domain & {
  network: string;
  children: ReactNode;
}) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const run = async () => {
      const response = await fetch(imageUrlUnknownRecord(name, network));
      const imgBlob = response && (await response.blob());
      const _src = URL.createObjectURL(imgBlob);
      if (imgBlob?.type.startsWith("image/")) {
        setSrc(_src);
      }
    };

    run();
  }, [name, network]);

  return (
    <Link href={`/profile/${name}`} passHref>
      <DomainItemWrapper as="a">
        <DomainItemContainer>
          <Avatar
            label={formattedName}
            src={src}
            placeholder={src === ""}
            size="9"
          />
          <Typography color="text" weight="bold" size="extraLarge">
            {formattedName}
          </Typography>
        </DomainItemContainer>
        {children}
      </DomainItemWrapper>
    </Link>
  );
};
