import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Banner } from '@ensdomains/thorin'

const REDIRECT_DELAY_MS = 1000
const MANAGER_BASE_URL = 'https://app.ens.dev'

const getManagerRegisterUrl = (name: string) => `${MANAGER_BASE_URL}/register/${name}`

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
  const url = getManagerRegisterUrl(name)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.assign(url)
    }, REDIRECT_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [url])

  return (
    <Container>
      <Banner alert="warning" title={t('disabled.title')}>
        <Trans
          t={t}
          i18nKey="disabled.banner"
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
