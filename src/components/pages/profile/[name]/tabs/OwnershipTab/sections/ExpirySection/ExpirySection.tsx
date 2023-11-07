import { CalendarEvent, google, ics, office365, outlook, yahoo } from 'calendar-link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Card, Dropdown, mq } from '@ensdomains/thorin2'

import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { useNameDetails } from '@app/hooks/useNameDetails'

import { EarnifiDialog } from '../../../MoreTab/Miscellaneous/EarnifiDialog'
import { ExpiryPanel } from './components/ExpiryPanel'
import { useExpiryActions } from './hooks/useExpiryActions'
import { useExpiryDetails } from './hooks/useExpiryDetails'

const calendarOptions = [
  {
    value: 'google',
    label: 'tabs.more.misc.reminderOptions.google',
    function: google,
  },
  {
    value: 'outlook',
    label: 'tabs.more.misc.reminderOptions.outlook',
    function: outlook,
  },
  {
    value: 'office365',
    label: 'tabs.more.misc.reminderOptions.office365',
    function: office365,
  },
  {
    value: 'yahoo',
    label: 'tabs.more.misc.reminderOptions.yahoo',
    function: yahoo,
  },
  {
    value: 'ics',
    label: 'tabs.more.misc.reminderOptions.ical',
    function: ics,
  },
]

const makeEvent = (name: string, expiryDate: Date): CalendarEvent => ({
  title: `Renew ${name}`,
  start: expiryDate,
  duration: [10, 'minute'],
  url: window.location.href,
})

const Header = styled.div(({ theme }) => [
  css`
    padding: ${theme.space['4']};
    border-bottom: 1px solid ${theme.colors.border};
  `,
  mq.sm.min(css`
    padding: ${theme.space['6']};
  `),
])

const PanelsContainer = styled.div(({ theme }) => [
  css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: -${theme.space['4']} 0;
    > *:last-child {
      border-bottom: none;
    }
  `,
  mq.lg.min(css`
    flex-direction: row;
    margin: 0 -${theme.space['4']};
    > *:last-child {
      border-right: none;
    }
  `),
])

const Footer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: ${theme.space['2']};
    min-height: ${theme.space['12']};
  `,
)

const FooterWrapper = styled.div(({ theme }) => [
  css`
    padding: ${theme.space['4']};
  `,
  mq.sm.min(css`
    padding: ${theme.space['4']} ${theme.space['6']} ${theme.space['6']};
  `),
])

const Container = styled.div(({ theme }) => [
  css`
    display: flex;
    flex-direction: column;
    margin: -${theme.space['4']};
  `,
  mq.sm.min(css`
    margin: -${theme.space['6']};
  `),
])

const StyledCard = styled(Card)(cacheableComponentStyles)

type Props = {
  name: string
  details: ReturnType<typeof useNameDetails>
}

export const ExpirySection = ({ name, details }: Props) => {
  const { t } = useTranslation('profile')
  const expiry = useExpiryDetails({ name, details })
  const actions = useExpiryActions({ name, expiryDetails: expiry.data })

  const [showEarnifiDialog, setShowEarnifiDialog] = useState(false)

  if (!expiry.data || expiry.data?.length === 0) return null
  return (
    <>
      <EarnifiDialog
        name={name}
        open={showEarnifiDialog}
        onDismiss={() => setShowEarnifiDialog(false)}
      />
      <StyledCard $isCached={expiry.isCachedData}>
        <Container>
          <Header>
            <PanelsContainer>
              {expiry.data.map((item) => (
                <ExpiryPanel key={item.type} {...(item as any)} />
              ))}
            </PanelsContainer>
          </Header>
          <FooterWrapper>
            <Footer>
              {actions?.map((action) => {
                if (action.type === 'set-reminder')
                  return (
                    <div key={action.type}>
                      <Dropdown
                        shortThrow
                        keepMenuOnTop
                        width={220}
                        items={[
                          {
                            value: 'earnifi',
                            label: t('tabs.more.misc.reminderOptions.earnifi', { ns: 'profile' }),
                            onClick: () => {
                              setShowEarnifiDialog(true)
                            },
                          },
                          ...calendarOptions.map((option) => ({
                            label: t(option.label, { ns: 'profile' }),
                            onClick: () =>
                              window.open(
                                option.function(makeEvent(name, action.expiryDate)),
                                '_blank',
                              ),
                          })),
                        ]}
                      >
                        <Button
                          data-testid={`expiry-action-${action.type}`}
                          id="remind-me-button"
                          style={{ display: 'inline-flex' }}
                          prefix={action.icon}
                          colorStyle="accentSecondary"
                        >
                          {action.label}
                        </Button>
                      </Dropdown>
                    </div>
                  )
                return (
                  <div key={action.type}>
                    <Button
                      data-testid={`expiry-action-${action.type}`}
                      key={action.label}
                      prefix={action.icon}
                      onClick={action.onClick}
                      colorStyle={action.primary ? 'accentPrimary' : 'accentSecondary'}
                    >
                      {action.label}
                    </Button>
                  </div>
                )
              })}
            </Footer>
          </FooterWrapper>
        </Container>
      </StyledCard>
    </>
  )
}
