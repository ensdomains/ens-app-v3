import styled, { css } from 'styled-components'

import { Button, CalendarSVG, Card, FastForwardSVG, mq } from '@ensdomains/thorin'

import { useNameDetails } from '@app/hooks/useNameDetails'

import { ExpiryPanel } from './components/ExpiryPanel'
import { useExpiry } from './hooks/useExpiry'

const Header = styled.div(() => [css``, mq.md.min(css``)])

const PanelsContainer = styled.div(({ theme }) => [
  css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: ${theme.space['4']} 0;
  `,
  mq.md.min(css`
    flex-direction: row;
  `),
])

const Divider = styled.div(({ theme }) => [
  css`
    border-bottom: 1px solid ${theme.colors.border};
  `,
  mq.md.min(css`
    border-bottom: none;
    border-right: 1px solid ${theme.colors.border};
  `),
])

const Footer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: ${theme.space['2']};
  `,
)

type Props = {
  name: string
  details: ReturnType<typeof useNameDetails>
}

export const ExpirySection = ({ name, details }: Props) => {
  const expiry = useExpiry({ name, details })
  console.log(expiry)

  const buttons = [
    {
      label: 'Set reminder',
      icon: <CalendarSVG />,
      primary: false,
      onClick: () => {},
    },
    {
      label: 'Extend',
      icon: <FastForwardSVG />,
      primary: true,
      onClick: () => {},
    },
  ]

  if (!expiry.data || expiry.data?.length === 0) return null
  return (
    <Card>
      <Header>
        <PanelsContainer>
          {expiry.data.map((item, i) => (
            <>
              {i !== 0 && <Divider />}
              <ExpiryPanel key={item.type} {...(item as any)} />
            </>
          ))}
        </PanelsContainer>
      </Header>
      <Card.Divider />
      <Footer>
        {buttons.map(({ label, icon, primary, onClick }) => (
          <div>
            <Button
              key={label}
              prefix={icon}
              onClick={onClick}
              colorStyle={primary ? 'accentPrimary' : 'accentSecondary'}
            >
              {label}
            </Button>
          </div>
        ))}
      </Footer>
    </Card>
  )
}
