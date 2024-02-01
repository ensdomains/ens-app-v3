import Head from 'next/head'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, OutlinkSVG, Typography, mq } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { Card } from '@app/components/Card'
import { useBasicName } from '@app/hooks/useBasicName'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useValidate } from '@app/hooks/useValidate'
import { Content } from '@app/layouts/Content'
import { getSupportLink } from '@app/utils/supportLinks'

const MainContentContainer = styled(Card)(
  ({ theme }) => css`
    width: 100%;
    flex-direction: column;
    gap: ${theme.space['4']};
    text-align: center;
    padding: ${theme.space['4']};

    ${mq.sm.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
    `)}
  `,
)

export default () => {
  const router = useRouterWithHistory()

  const { name, isValid } = useValidate(router.query.name as string)
  const { registrationStatus, isLoading } = useBasicName(name)

  const { t } = useTranslation('dnssec')

  // redirect to profile page if imported
  // not doing this for other registration statuses just incase we get an infinite loop!
  useEffect(() => {
    if (registrationStatus === 'imported' && isValid && !isLoading) {
      router.push(`/profile/${name}`)
    }
  }, [router, name, registrationStatus, isLoading, isValid])

  return (
    <>
      <Head>
        <title>{t('title', { name })}</title>
      </Head>
      <Content noTitle title={name} copyValue={name} singleColumnContent>
        {{
          trailing: (
            <MainContentContainer>
              <Typography fontVariant="headingTwo">{t('gasless.title')}</Typography>
              <Typography>{t('gasless.description')}</Typography>
              <MobileFullWidth>
                <Button as="a" href={getSupportLink('gaslessDnssec')} suffix={<OutlinkSVG />}>
                  {t('action.learnMore', { ns: 'common' })}
                </Button>
              </MobileFullWidth>
            </MainContentContainer>
          ),
        }}
      </Content>
    </>
  )
}
