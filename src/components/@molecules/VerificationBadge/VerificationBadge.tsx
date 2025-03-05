import { cloneElement, forwardRef, ReactElement } from 'react'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'

import { AlertSVG, Colors, Tooltip } from '@ensdomains/thorin'

import VerifiedPersonSVG from '@app/assets/VerifiedPerson.svg'
import VerifiedRecordSVG from '@app/assets/VerifiedRecord.svg'
import { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'

type Color = Extract<Colors, 'accent' | 'green' | 'red'>

type Props = {
  showBadge?: boolean
  isVerified?: boolean
  type: 'personhood' | 'record'
  tooltipContent?: ReactElement
  verifier?: VerificationProtocol
  color?: Color
  children: ReactElement
}

const Container = styled.div<{ $color: Color }>(
  ({ theme, $color }) => css`
    display: flex;
    background: ${theme.colors[`${$color}Surface`]};
    transition: transform 0.2s;
    border-radius: ${theme.radii.large};

    &:hover {
      transform: translateY(-1px);
    }
  `,
)

const InnerContainer = styled.div(
  () => css`
    display: flex;
    transition: transform 0.2s;

    /* Counteract the hover of child element */
    &:hover {
      transform: translateY(1px);
    }
  `,
)

const Badge = styled.div<{ $color: Color }>(
  ({ theme, $color }) => css`
    width: ${theme.space['11']};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors[`${$color}Primary`]};

    svg {
      width: ${theme.space['5']};
      height: ${theme.space['5']};
      display: block;
    }
  `,
)

export const VerificationBadge = forwardRef<HTMLElement, Props>(
  ({ showBadge, isVerified, type, verifier, tooltipContent, children, ...props }: Props, ref) => {
    const clonedChild = cloneElement(children, { ref, ...props })

    if (!showBadge) return clonedChild

    const color = type === 'personhood' ? 'green' : 'accent'
    const finalColor = isVerified ? color : 'red'
    return (
      <Container $color={finalColor} data-testid={`verification-badge-${type}`}>
        <InnerContainer>{clonedChild}</InnerContainer>
        <Tooltip mobileWidth={250} content={tooltipContent}>
          <Badge $color={finalColor}>
            {match([isVerified, type])
              .with([false, P._], () => <AlertSVG data-testid="verification-badge-error-icon" />)
              .with([true, 'personhood'], () => (
                <VerifiedPersonSVG data-testid="verification-badge-person-icon" />
              ))
              .otherwise(() => (
                <VerifiedRecordSVG data-testid="verification-badge-record-icon" />
              ))}
          </Badge>
        </Tooltip>
      </Container>
    )
  },
)
