import { Box, vars } from "@ensdomains/thorin";
import { ElementType } from "react";
import styled from "styled-components";

const SocialIconWrapper = styled.a<{ $boxSize: keyof typeof vars.space }>`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $boxSize }) => vars.space[$boxSize]};
  min-height: ${({ $boxSize }) => vars.space[$boxSize]};
`;

const StyledIcon = styled(Box)<{ $iconColor?: string }>`
  height: 80%;
  position: absolute;
  transition: 0.15s all ease-in-out;
  fill: ${vars.colors.backgroundHide};
  ${SocialIconWrapper}:hover && {
    ${({ $iconColor }) => `fill: ${$iconColor};`};
  }
`;

const StyledColoredIcon = styled(Box)`
  height: 80%;
  position: absolute;
  transition: 0.15s all ease-in-out;
  opacity: 0;
  ${SocialIconWrapper}:hover && {
    opacity: 1;
  }
`;

export const SocialIcon = ({
  Icon,
  ColoredIcon,
  color,
  iconWidth = "10",
  href,
}: {
  Icon: ElementType;
  ColoredIcon?: ElementType;
  color?: string;
  iconWidth?: keyof typeof vars.space;
  href: string;
}) => {
  return (
    <SocialIconWrapper href={href} $boxSize={iconWidth}>
      <StyledIcon key={href} $iconColor={color} as={Icon} />
      {ColoredIcon && <StyledColoredIcon as={ColoredIcon} />}
    </SocialIconWrapper>
  );
};
