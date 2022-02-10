import { Box, BoxProps } from "@ensdomains/thorin";
import { ElementType } from "react";
import styled from "styled-components";

const SocialIconWrapper = styled.div<{ boxSize: string }>`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-${({ boxSize }) => boxSize});
  min-height: var(--space-${({ boxSize }) => boxSize});
`;

const StyledIcon = styled(Box)<{ iconColor?: string; iconWidth: string }>`
  height: 80%;
  position: absolute;
  transition: 0.15s all ease-in-out;
  fill: var(--colors-backgroundHide);
  &:hover {
    ${({ iconColor }) => iconColor && `fill: ${iconColor};`};
  }
`;

const StyledColoredIcon = styled(Box)`
  height: 80%;
  position: absolute;
  transition: 0.15s all ease-in-out;
  opacity: 0;
  ${SocialIconWrapper}:hover & {
    opacity: 1;
  }
`;

export const SocialIcon = ({
  Icon,
  ColoredIcon,
  color,
  iconWidth = "10",
}: {
  Icon: ElementType;
  ColoredIcon?: ElementType;
  color?: string;
  iconWidth?: BoxProps["width"];
}) => {
  return (
    <SocialIconWrapper boxSize={iconWidth}>
      <StyledIcon iconWidth={iconWidth} iconColor={color} as={Icon} />
      {ColoredIcon && <StyledColoredIcon as={ColoredIcon} />}
    </SocialIconWrapper>
  );
};
