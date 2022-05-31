import { NextPage } from 'next'
import { useRouter } from 'next/router'
// import { useTranslation } from 'next-i18next'
// import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { Basic } from '@app/layouts/Basic'
import Accordian from '@app/components/@molecules/Accordian/Accordian'
import AccordianSummary from '@app/components/@molecules/Accordian/AccordianSummary'
import styled from 'styled-components'
import { Avatar, Button } from '@ensdomains/thorin'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import NoProfileSnippet from '@app/components/address/NoProfileSnippet'
import FilterIcon from '@app/assets/Filter.svg'
import FilterControl from '../../components/address/FilterControl'

const AliasesLabel = styled.span`
  ${({ theme }) => `
    font-size: ${theme.fontSizes.extraLarge};
    font-weight: ${theme.fontWeights.bold};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    font-family: ${theme.fonts.sans};
    line-height: ${theme.lineHeights['1.375']};
    font-feature-settings: 'ss01' on, 'ss03' on;
  `}
`

const AliasContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  ${({ theme }) => `
    background: ${theme.colors.foregroundSecondary};
    padding: ${theme.space['0.5']} ${theme.space['0.5']} ${theme.space['0.5']} ${theme.space['4']};
  `}
`

const AliasAvatarContianer = styled.div`
  ${({ theme }) => `
    flex: 0 0 ${theme.space['6']};
  `}
`

const AliasLabel = styled.div`
  ${({ theme }) => `
    font-size: ${theme.fontSizes.root};
    font-weight: ${theme.fontWeights.bold};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      line-height: ${theme.lineHeights['1.25']};
    flex: 1;
    
  `}
`
const AliasButtonContainer = styled.div`
  margin-right: -5px;
`

const AddressPage: NextPage = () => {
  const router = useRouter()
  // const { t } = useTranslation('address')
  // const breakpoints = useBreakpoint()
  const address = router.query.address as string
  return (
    <Basic
      heading="heading"
      subheading="subheading"
      title="title"
      loading={false}
    >
      <FilterIcon />
      {address}
      <FilterControl />
      <NoProfileSnippet />
      <ProfileSnippet
        description="description"
        name="name"
        button="viewProfile"
        network="main"
      />
      <div>
        <Accordian>
          <AccordianSummary>
            <AliasesLabel>Aliases</AliasesLabel>
          </AccordianSummary>
          <AliasContainer>
            <AliasAvatarContianer>
              <Avatar label="hello" />
            </AliasAvatarContianer>
            <AliasLabel>areallylongnamegoeshere.eth</AliasLabel>
            <AliasButtonContainer>
              <Button size="small" variant="transparent">
                VIEW
              </Button>
            </AliasButtonContainer>
          </AliasContainer>
          <AliasContainer>ONE</AliasContainer>
          <AliasContainer>ONE</AliasContainer>
          <AliasContainer>ONE</AliasContainer>
          <AliasContainer>ONE</AliasContainer>
        </Accordian>
        <Accordian>
          <AccordianSummary>HELLO</AccordianSummary>
          <div>ONE</div>
          <div>ONE</div>
          <div>ONE</div>
          <div>ONE</div>
          <div>ONE</div>
        </Accordian>
      </div>
    </Basic>
  )
}

export default AddressPage
