import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Banner } from '@ensdomains/thorin'

import { useIsLegacyFlowDisabled } from '@app/hooks/registration/useIsLegacyFlowDisabled'

const REDIRECT_DELAY_MS = 1000

const getManagerRegisterUrl = (baseUrl: string, name: string) => `${baseUrl}/register/${name}`

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    padding: ${theme.space['4']} 0;
  `,
)

type Props = {
  name: string
}

const RegistrationDisabledBanner = ({ name }: Props) => {
  const { t } = useTranslation('register')
  const { isMainnet, managerBaseUrl } = useIsLegacyFlowDisabled()
  const url = getManagerRegisterUrl(managerBaseUrl, name)
  // The Sepolia-specific copy mentions the ENS v2 beta on Sepolia, so mainnet
  // uses its own keys.
  const i18nPrefix = isMainnet ? 'disabledMainnet' : 'disabled'

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.assign(url)
    }, REDIRECT_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [url])

  return (
    <Container>
      <Banner alert="warning" title={t(`${i18nPrefix}.title`)}>
        <Trans
          t={t}
          i18nKey={`${i18nPrefix}.banner`}
          components={{
            // eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label
            ManagerLink: <a href={url} />,
          }}
        />
      </Banner>
    </Container>
  )
}

export default RegistrationDisabledBanner
