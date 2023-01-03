import styled, { css } from 'styled-components'

import { Button, Typography } from '@ensdomains/thorin'

import { useTransactionFlow } from '../../../../../../transaction-flow/TransactionFlowProvider'
import { Section, SectionFooter, SectionHeader, SectionItem, SectionList } from './Section'

type Props = {
  name?: string
  isCachedData: boolean
}

const TypographyGreyDim = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.greyDim};
  `,
)

export const OwnershipPermissions = ({ name = 'dave', isCachedData }: Props) => {
  const { showDataInput } = useTransactionFlow()

  const handleBurnPCC = () => {
    showDataInput(`burn-pcc-${name}`, 'BurnPCC', {
      name,
    })
  }
  return (
    <Section $isCached={isCachedData}>
      <SectionHeader>
        <Typography typography="Heading/H3">Ownership Permissions</Typography>
      </SectionHeader>
      <SectionItem icon="disabled">
        <Typography typography="Body/Bold">
          This name cannot be controled by it&apos;s parent (dperri.eth)
        </Typography>
        <TypographyGreyDim typography="Small/XS Normal">Revoked Oct 27, 2022</TypographyGreyDim>
        <Typography typography="Small/Normal">
          The owner of the parent name cannot control, modify, remove or retake ownership of this
          name.
        </Typography>
        <SectionList title="The name owner will retain ownership unless one of the following happens:">
          <li>The name expires on Nov 1, 2036 (can be extended)</li>
          <li>The parent name expires on Nov 1, 2036</li>
          <li>Ownership of the name is sent to another address</li>
        </SectionList>
      </SectionItem>
      <SectionItem icon="info">
        <Typography typography="Body/Bold">
          This name can be controled by it&apos;s parent (dperri.eth)
        </Typography>
        <SectionList title="The owner of the parent name can:">
          <li>Control and modify the settings and records</li>
          <li>Retake or reassign ownership of this name</li>
          <li>Remove this name</li>
        </SectionList>
      </SectionItem>
      <SectionItem icon="info">
        <Typography typography="Body/Bold">
          This owner of this name can change permissions
        </Typography>
        <SectionList title="The owner can:">
          <li>Revoke permissions</li>
          <li>Change or burn custom fuses</li>
        </SectionList>
      </SectionItem>
      <SectionFooter>
        <Button onClick={handleBurnPCC}>Give up parent control</Button>
      </SectionFooter>
    </Section>
  )
}
