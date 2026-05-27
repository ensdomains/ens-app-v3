import { useEffect } from 'react'

import UpgradeBanner from '@app/components/@molecules/UpgradeBanner/UpgradeBanner'

const REDIRECT_DELAY_MS = 1000
const MANAGER_BASE_URL = 'https://app.ens.dev'

const getManagerRegisterUrl = (name: string) => `${MANAGER_BASE_URL}/register/${name}`

type Props = {
  name: string
}

/**
 * Shown in place of the registration flow when the legacy ETHRegistrarController
 * has been removed from BaseRegistrarImplementation (e.g. Sepolia post ENSv2
 * beta). Auto-redirects to the Manager registration deep link after 1s so
 * users who don't click the CTA still end up in the right place.
 */
const RegistrationDisabledBanner = ({ name }: Props) => {
  const url = getManagerRegisterUrl(name)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.assign(url)
    }, REDIRECT_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [url])

  return <UpgradeBanner href={url} />
}

export default RegistrationDisabledBanner
