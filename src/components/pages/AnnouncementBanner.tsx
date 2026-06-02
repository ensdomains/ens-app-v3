import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Typography } from '@ensdomains/thorin'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    width: ${theme.space.full};
    max-width: 466px;
    padding: ${theme.space['4']};
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['4']};
    align-self: center;
    border-radius: ${theme.radii['2xLarge']};
    background-color: ${theme.colors.backgroundPrimary};

    @media (max-width: 640px) {
      a {
        width: 100%;
      }
    }

    @media (min-width: ${theme.breakpoints.sm}px) {
      flex-direction: row;
    }
  `,
)

const TextContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['4']};

    width: ${theme.space.full};
  `,
)

const Text = styled.span(
  ({ theme }) => css`
    width: ${theme.space.full};
  `,
)

// ENSv2 migration banner is not applicable to SNRC. Short-circuited
// rather than removed from the homepage so the diff vs upstream stays
// limited to this file (matches the pattern used for ens-v2.tsx and
// legacyfavourites.tsx).
export const AnnouncementBanner = () => null
