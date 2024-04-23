import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, CheckSVG, Helper, mq, Tag, Typography } from '@ensdomains/thorin'

import CoreFeatureENS from '@app/assets/dotbox/CoreFeatureENS.svg'
import CoreFeatureNFT from '@app/assets/dotbox/CoreFeatureNFT.svg'
import CoreFeatureOnchain from '@app/assets/dotbox/CoreFeatureOnchain.svg'
import CoreFeatureWebsite from '@app/assets/dotbox/CoreFeatureWebsite.svg'
import DotBoxLogoSVG from '@app/assets/dotbox/DotBoxLogo.svg'
import OutlinkSVG from '@app/assets/Outlink.svg'
import { Card } from '@app/components/Card'
import { useGetDotBoxAvailability } from '@app/hooks/useGetDotBoxAvailability'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { Content } from '@app/layouts/Content'

const LEARN_MORE_URL = 'https://docs.my.box/docs/learn-more/reserved-names'

const DotBoxCard = styled(Card)(
  ({ theme }) => css`
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
    align-items: flex-start;

    ${mq.sm.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    `)}
  `,
)

const SubHeading = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

const CoreFeaturesContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: ${theme.space['4']};
    background: ${theme.colors.backgroundSecondary};
    padding: ${theme.space['6']};
    border-radius: ${theme.radii['2xLarge']};
  `,
)

const CoreFeaturesRow = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: ${theme.space['6']};
  `,
)

const SubHeadingRow = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
  `,
)

const OutlinkInner = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

export const DotBoxRegistration = () => {
  const router = useRouterWithHistory()

  const name = router.query.name as string
  const dotBoxResult = useGetDotBoxAvailability(name)
  const nameStatus = dotBoxResult?.data?.data.status

  if (
    !dotBoxResult.isLoading &&
    nameStatus !== 'AVAILABLE' &&
    nameStatus !== 'UNAVAILABLE' &&
    router.isReady
  ) {
    router.push(`/profile/${name}`)
  }

  const { t } = useTranslation('dnssec')

  return (
    <>
      <Head>
        <title>{t('title', { name })}</title>
      </Head>
      <Content noTitle title={name} singleColumnContent inlineHeading>
        {{
          trailing: (
            <DotBoxCard>
              <DotBoxLogoSVG style={{ alignSelf: 'flex-end' }} />
              <SubHeading>
                <SubHeadingRow>
                  <Typography fontVariant="extraLargeBold">{name}</Typography>
                  {nameStatus === 'AVAILABLE' && (
                    <Tag colorStyle="greenSecondary" style={{ gap: 4 }}>
                      <CheckSVG /> Available
                    </Tag>
                  )}
                </SubHeadingRow>
                <Typography color="textSecondary">
                  .box combines the features of ENS and DNS domains
                </Typography>
              </SubHeading>
              <CoreFeaturesContainer>
                <Typography fontVariant="bodyBold" color="textSecondary">
                  Core Features
                </Typography>
                <CoreFeaturesRow>
                  <CoreFeatureENS style={{ minWidth: 25 }} />
                  <Typography>ENS Powered Web3 username</Typography>
                </CoreFeaturesRow>
                <CoreFeaturesRow>
                  <CoreFeatureNFT style={{ minWidth: 25 }} />
                  <Typography>NFT-bound ownership and control</Typography>
                </CoreFeaturesRow>
                <CoreFeaturesRow>
                  <CoreFeatureWebsite style={{ minWidth: 25 }} />
                  <Typography>Website and email hosting via ICANN DNS resolution</Typography>
                </CoreFeaturesRow>
                <CoreFeaturesRow>
                  <CoreFeatureOnchain style={{ minWidth: 25 }} />
                  <Typography>
                    Onchain management of name records (Avatar, Handles, A, CNAME, MX)
                  </Typography>
                </CoreFeaturesRow>
              </CoreFeaturesContainer>
              <ButtonContainer>
                {nameStatus === 'AVAILABLE' ? (
                  <Link href={dotBoxResult?.data?.data.href} legacyBehavior>
                    <Button width="45" size="small">
                      <OutlinkInner>
                        Register on my.box
                        <OutlinkSVG />
                      </OutlinkInner>
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Helper type="warning" alignment="horizontal">
                      Online registration for this domain is unavailable. Please contact the
                      registry directly for further information.
                    </Helper>
                    <Link href={LEARN_MORE_URL} legacyBehavior>
                      <Button width="52" size="small">
                        <OutlinkInner>
                          Learn more at my.box
                          <OutlinkSVG />
                        </OutlinkInner>
                      </Button>
                    </Link>
                  </>
                )}
              </ButtonContainer>
            </DotBoxCard>
          ),
        }}
      </Content>
    </>
  )
}
