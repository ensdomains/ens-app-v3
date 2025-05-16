import posthog from 'posthog-js'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Button, Card, Typography } from '@ensdomains/thorin'

import { useCookieConsent } from '@app/utils/analytics/cookies'

const BannerContainer = styled.div`
  position: fixed;
  bottom: 16px;
  left: 16px;
  max-width: 320px;
  z-index: 9999;
  font-family: inherit;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 480px) {
    top: 72px;
    right: 10px;
    left: 10px;
    max-width: 100%;
    border-radius: 8px 8px 0 0;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`

export const CookieConsentBanner = () => {
  const { consent, setConsent } = useCookieConsent()
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    setShowBanner(consent === 'undecided')
    // Set PostHog persistence based on consent
    if (consent !== 'undecided') {
      posthog.set_config({
        persistence: consent === 'yes' ? 'localStorage+cookie' : 'memory',
      })
    }
  }, [consent])

  if (!showBanner) {
    return null
  }

  const handleAccept = () => {
    setConsent('yes')
  }

  const handleDecline = () => {
    setConsent('no')
  }

  return (
    <BannerContainer>
      <Card>
        <Typography>
          ENS uses a single in-house cookie to enhance your experience. We don&apos;t use any
          third-party tracking cookies.
        </Typography>
        <ButtonContainer>
          <Button size="small" colorStyle="background" onClick={handleDecline}>
            Decline
          </Button>
          <Button size="small" onClick={handleAccept}>
            Accept
          </Button>
        </ButtonContainer>
      </Card>
    </BannerContainer>
  )
}
