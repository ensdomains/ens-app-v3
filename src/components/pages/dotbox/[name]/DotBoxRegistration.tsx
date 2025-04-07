import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'

import { Button, CheckSVG, Helper, Spinner, Tag, Typography } from '@ensdomains/thorin'

import CoreFeatureENS from '@app/assets/dotbox/CoreFeatureENS.svg'
import CoreFeatureNFT from '@app/assets/dotbox/CoreFeatureNFT.svg'
import CoreFeatureOnchain from '@app/assets/dotbox/CoreFeatureOnchain.svg'
import CoreFeatureWebsite from '@app/assets/dotbox/CoreFeatureWebsite.svg'
import DotBoxLogoSVG from '@app/assets/dotbox/DotBoxLogo.svg'
import OutlinkSVG from '@app/assets/Outlink.svg'
import { Card } from '@app/components/Card'
import { useDotBoxAvailabilityOffchain } from '@app/hooks/dotbox/useDotBoxAvailabilityOffchain'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { Content } from '@app/layouts/Content'
import { sendEvent } from '@app/utils/analytics/events'
import { shouldRedirect } from '@app/utils/shouldRedirect'

const LEARN_MORE_URL = 'https://docs.my.box/docs/learn-more/reserved-names'

const DotBoxCard = styled(Card)(
  ({ theme }) => css`
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
    align-items: flex-start;

    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    }
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
  const dotBoxResult = useDotBoxAvailabilityOffchain({ name })
  const nameStatus = dotBoxResult?.data?.data.status

  shouldRedirect(router, 'DotBoxRegistration.tsx', `/profile/${name}`, dotBoxResult)

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
                  {nameStatus === 'AVAILABLE' && !dotBoxResult.isLoading && (
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
                {match({ isLoading: dotBoxResult.isLoading, nameStatus })
                  .with({ isLoading: true }, () => <Spinner size="medium" color="accent" />)
                  .with({ isLoading: false, nameStatus: 'AVAILABLE' }, () => (
                    <a href={dotBoxResult?.data?.data.href} target="_blank" rel="noreferrer">
                      <Button
                        width="45"
                        size="small"
                        onClick={() =>
                          sendEvent(
                            'register:dotbox',
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            { ens_name: name },
                          )
                        }
                      >
                        <OutlinkInner>
                          Register on my.box
                          <OutlinkSVG />
                        </OutlinkInner>
                      </Button>
                    </a>
                  ))
                  .with({ isLoading: false, nameStatus: P._ }, () => (
                    <>
                      <Helper alert="warning" alignment="horizontal">
                        Online registration for this domain is unavailable. Please contact the
                        registry directly for further information.
                      </Helper>
                      <a href={LEARN_MORE_URL} target="_blank" rel="noreferrer">
                        <Button width="52" size="small">
                          <OutlinkInner>
                            Learn more at my.box
                            <OutlinkSVG />
                          </OutlinkInner>
                        </Button>
                      </a>
                    </>
                  ))
                  .otherwise(() => null)}
              </ButtonContainer>
            </DotBoxCard>
          ),
        }}
      </Content>
    </>
  )
}
