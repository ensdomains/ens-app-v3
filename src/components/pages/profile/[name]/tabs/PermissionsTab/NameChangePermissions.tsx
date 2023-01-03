import styled, { css } from 'styled-components'

import { Button, Typography } from '@ensdomains/thorin'

import { Section, SectionFooter, SectionHeader, SectionItem } from './Section'

type Props = {
  isCachedData: boolean
}

const TypographyGreyDim = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.greyDim};
  `,
)

export const NameChangePermissions = ({ isCachedData }: Props) => {
  return (
    <Section $isCached={isCachedData}>
      <SectionHeader>
        <Typography typography="Heading/H3">Name Change Permissions</Typography>
        <Typography typography="Body/Normal">
          The owner of this name may be able to change settings on this name.
        </Typography>
      </SectionHeader>
      <SectionItem icon="info">
        <Typography typography="Body/Bold">Can create subnames</Typography>
        <Typography typography="Small/Normal">
          The owner of this name can create new subnames.
        </Typography>
      </SectionItem>
      <SectionItem icon="disabled">
        <Typography typography="Body/Bold">Cannot create subnames</Typography>
        <TypographyGreyDim typography="Small/XS Normal">Revoked Oct 27, 2022</TypographyGreyDim>
        <Typography typography="Small/Normal">
          {' '}
          The owner of this name cannot create new subnames.
        </Typography>
      </SectionItem>
      <SectionFooter>
        <Button>Revoke permissions</Button>
      </SectionFooter>
    </Section>
  )
}
