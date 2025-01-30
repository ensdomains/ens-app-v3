import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Card, Dropdown } from '@ensdomains/thorin'

import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { useCalendarOptions } from '@app/hooks/useCalendarOptions'
import { useNameDetails } from '@app/hooks/useNameDetails'

import { EarnifiDialog } from '../../../MoreTab/Miscellaneous/EarnifiDialog'
import { ExpiryPanel } from './components/ExpiryPanel'
import { useExpiryActions } from './hooks/useExpiryActions'
import { useExpiryDetails } from './hooks/useExpiryDetails'

const Header = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    border-bottom: 1px solid ${theme.colors.border};
    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['6']};
    }
  `,
)

const PanelsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: -${theme.space['4']} 0;
    > *:last-child {
      border-bottom: none;
    }
    @media (min-width: ${theme.breakpoints.lg}px) {
      flex-direction: row;
      margin: 0 -${theme.space['4']};
      > *:last-child {
        border-right: none;
      }
    }
  `,
)

const Footer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: ${theme.space['2']};
    min-height: ${theme.space['12']};
  `,
)

const FooterWrapper = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['4']} ${theme.space['6']} ${theme.space['6']};
    }
  `,
)

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    margin: -${theme.space['4']};
    @media (min-width: ${theme.breakpoints.sm}px) {
      margin: -${theme.space['6']};
    }
  `,
)

const StyledCard = styled(Card)(cacheableComponentStyles)

type Props = {
  name: string
  details: ReturnType<typeof useNameDetails>
}

export const ExpirySection = ({ name, details }: Props) => {
  const { t } = useTranslation('profile')

  const expiry = useExpiryDetails({ name, details })
  const actions = useExpiryActions({
    name,
    expiryDetails: expiry.data,
    ownerData: details.ownerData,
    wrapperData: details.wrapperData,
  })
  const { options: calendarOptions, makeEvent } = useCalendarOptions(`Renew ${name}`)

  const [showEarnifiDialog, setShowEarnifiDialog] = useState(false)

  if (!expiry.data || expiry.data?.length === 0) return null

  const isOutOfGracePeriod = expiry.data.find((d) => d.type === 'grace-period')?.date! < new Date()

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
          {!isOutOfGracePeriod ? (
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
                            // Put this back once the reminders are working again
                            // {
                            //   value: 'earnifi',
                            //   label: t('tabs.more.misc.reminderOptions.bankless'),
                            //   onClick: () => {
                            //     setShowEarnifiDialog(true)
                            //   },
                            // },
                            ...calendarOptions.map((option) => ({
                              label: t(option.label, { ns: 'profile' }),
                              onClick: () =>
                                window.open(
                                  option.function(makeEvent(action.expiryDate)),
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
          ) : null}
        </Container>
      </StyledCard>
    </>
  )
}
