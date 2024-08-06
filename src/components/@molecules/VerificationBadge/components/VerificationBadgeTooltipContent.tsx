import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'

import { Colors, OutlinkSVG, Typography } from '@ensdomains/thorin'

import DentitySVG from '@app/assets/verification/Dentity.svg'
import VerifiedRecordSVG from '@app/assets/VerifiedRecord.svg'
import { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'

type Props = { verifiedBy?: VerificationProtocol }

const Container = styled.div<{ $color: Colors }>(
  ({ theme, $color }) => css`
    display: flex;
    align-items: center;
    width: 100%;
    gap: ${theme.space['1']};

    svg {
      width: ${theme.space['5']};
      height: ${theme.space['5']};
      display: block;
    }

    ${$color && `color: ${theme.colors[$color]};`}
  `,
)

const Content = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['1']};
    white-space: nowrap;

    svg {
      width: ${theme.space['3']};
      height: ${theme.space['3']};
      display: block;
    }
  `,
)

export const VerificationBadgeTooltipContent = ({ verifiedBy }: Props) => {
  return match(verifiedBy)
    .with('dentity', () => (
      <Container as="a" href="https://dentity.com" target="_blank" $color="accent">
        <DentitySVG />
        <Content>
          <Typography fontVariant="bodyBold" color="inherit">
            Verified by Dentity
          </Typography>
          <OutlinkSVG />
        </Content>
      </Container>
    ))
    .otherwise(() => (
      <Container $color="green">
        <VerifiedRecordSVG />
        <Content>
          <Typography fontVariant="body" color="text">
            Personhood verified
          </Typography>
        </Content>
      </Container>
    ))
}
