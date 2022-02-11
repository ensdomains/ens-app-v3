import { useBreakpoint } from "@app/utils/BreakpointProvider";
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
  href,
}: {
  Icon: ElementType;
  ColoredIcon?: ElementType;
  color?: string;
  href: string;
}) => {
  const breakpoints = useBreakpoint();

  return (
    <SocialIconWrapper href={href} $boxSize={breakpoints.sm ? "10" : "8"}>
      <StyledIcon key={href} $iconColor={color} as={Icon} />
      {ColoredIcon && <StyledColoredIcon as={ColoredIcon} />}
    </SocialIconWrapper>
  );
};
