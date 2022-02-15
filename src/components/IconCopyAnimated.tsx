import { Box, IconCheck, IconCopy, vars } from "@ensdomains/thorin";
import { memo } from "react";
import styled from "styled-components";

const IconWrapper = styled(Box)<{ $copied: boolean }>`
  position: relative;
  & > svg {
    transition: all 0.15s ease-in-out;
  }
  & > svg:first-child {
    position: absolute;
  }
  ${(props) =>
    props.$copied
      ? `
        & > svg:first-child {
            opacity: 1;
            visibility: visible;
        }
        & > svg:last-child {
            opacity: 0;
            visibility: hidden;
        }
    `
      : `
        & > svg:first-child {
            opacity: 0;
            visibility: hidden;
        }
        & > svg:last-child {
            opacity: 1;
            visibility: visible;
        }
    `}
`;

export const IconCopyAnimated = memo(
  ({
    copied = false,
    checkStrokeWidth = "1",
    ...props
  }: {
    copied?: boolean;
    checkStrokeWidth?: keyof typeof vars.borderWidths;
  }) => {
    return (
      <IconWrapper $copied={copied}>
        <IconCheck strokeWidth={checkStrokeWidth} {...props} />
        <IconCopy {...props} />
      </IconWrapper>
    );
  }
);
