import React, { useState, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Theme } from 'typings-custom/styled-components'
import { useForm } from 'react-hook-form'
import { mq, Modal, Avatar, Input, Textarea } from '@ensdomains/thorin'
import {
  AddressIconType,
  DynamicAddressIcon,
} from '@app/assets/address/DynamicAddressIcon'
import { Banner } from '../@atoms/Banner/Banner'
import { SelectableInput } from '../@molecules/SelectableInput/SelectableInput'

const ACCCOUNT_OPTIONS: AddressIconType[] = [
  'btc',
  'bnb',
  'eth',
  'doge',
  'ltc',
  'dot',
  'sol',
]

const Container = styled.div(({ theme }) => [
  css`
    width: 100%;
    height: content-height;
    max-height: 95%;
    background: ${theme.colors.white};
    border-radius: ${theme.space['5']};
    overflow: hidden;
  `,
  mq.sm.min`
    width: 95vw;
    max-width: 600px;
  `,
])

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    position: absolute;
    left: 24px;
    bottom: 0;
    height: 90px;
    width: 90px;
    border: 4px solid ${theme.colors.borderSecondary};
    box-sizing: border-box;
    border-radius: 50%;
    transform: translateY(50%);
    background: white;
  `,
)

const NameContainer = styled.div(({ theme }) => [
  css`
    display: block;
    height: 45px;
    width: 100%;
    padding-left: 134px;
    padding-right: 16px;
    letter-spacing: ${theme.letterSpacings['-0.01']};
    line-height: 45px;
    vertical-align: middle;
    text-align: right;
    font-feature-settings: 'ss01' on, 'ss03' on, 'ss04' on;
    font-weight: ${theme.fontWeights.bold};
    font-size: 1.25rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `,
  mq.sm.min(css`
    font-size: 1.5rem;
    text-align: left;
  `),
])

const ContentContainer = styled.div(
  () => css`
    padding: 16px;
  `,
)
const TabContainer = styled.div(() => css``)

const TabButtonsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.space['1.25']} ${theme.space['3']};
  `,
)

const getIndicatorStyle = (
  theme: Theme,
  $selected?: boolean,
  $hasError?: boolean,
  $isDirty?: boolean,
) => {
  let color = ''
  if ($hasError) color = theme.colors.red
  else if ($selected && $isDirty) color = theme.colors.accent
  else if ($isDirty) color = theme.colors.green
  if (!color) return ''
  return css`
    :after {
      content: '';
      position: absolute;
      background-color: ${color};
      width: 12px;
      height: 12px;
      border: 1px solid ${theme.colors.white};
      box-sizing: border-box;
      border-radius: 50%;
      top: 0;
      right: 0;
      transform: translate(70%, 0%);
    }
  `
}
const TabButton = styled.button<{
  $selected?: boolean
  $hasError?: boolean
  $isDirty?: boolean
}>(
  ({ theme, $selected, $hasError, $isDirty }) => css`
    position: relative;
    display: block;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    background: none;
    color: ${$selected ? theme.colors.accent : theme.colors.textTertiary};
    font-size: 1.25rem;
    transition: all 0.15s ease-in-out;
    cursor: pointer;

    &:hover {
      color: ${$selected ? theme.colors.accent : theme.colors.textSecondary};
    }

    ${getIndicatorStyle(theme, $selected, $hasError, $isDirty)}
  `,
)

type TabType = 'general' | 'accounts' | 'address' | 'website' | 'other'

const IconWrapper = styled.div(
  () => css`
    width: 22px;
    margin-right: -8px;
    margin-left: -8px;
    display: flex;
    align-items: center;
  `,
)

const ProfileEditor = () => {
  const { register, formState, watch } = useForm()
  const [tab, setTab] = useState<TabType>('general')
  const handleTabClick = (_tab: TabType) => () => setTab(_tab)

  const accountOptions = useMemo(() => {
    return ACCCOUNT_OPTIONS.map((coin) => ({
      label: coin.toUpperCase(),
      value: coin,
      prefix: (
        <IconWrapper>
          <DynamicAddressIcon name={coin} />
        </IconWrapper>
      ),
    }))
  }, [])

  console.log(formState)
  console.log(watch('eth'))
  console.log(watch('btc'))

  return (
    <>
      <Modal open onDismiss={() => {}}>
        <Container>
          <Banner>
            <AvatarWrapper>
              <Avatar label="profile-avatar" src="" noBorder />
            </AvatarWrapper>
          </Banner>
          <NameContainer>yoginth.eth</NameContainer>
          <ContentContainer>
            <TabContainer>
              <TabButtonsContainer>
                <TabButton
                  $selected={tab === 'general'}
                  onClick={handleTabClick('general')}
                >
                  General
                </TabButton>
                <TabButton
                  $selected={tab === 'accounts'}
                  $hasError
                  onClick={handleTabClick('accounts')}
                >
                  Accounts
                </TabButton>
                <TabButton
                  $selected={tab === 'address'}
                  $isDirty
                  onClick={handleTabClick('address')}
                >
                  Address
                </TabButton>
                <TabButton
                  $selected={tab === 'website'}
                  onClick={handleTabClick('website')}
                >
                  Website
                </TabButton>
                <TabButton
                  $selected={tab === 'other'}
                  onClick={handleTabClick('other')}
                >
                  Other
                </TabButton>
              </TabButtonsContainer>
              {
                {
                  general: (
                    <>
                      <Input label="Nickname" />
                      <Input label="Nickname" />
                      <Textarea label="Short Bio" />
                    </>
                  ),
                  accounts: (
                    <>
                      <SelectableInput
                        value="eth"
                        options={accountOptions}
                        register={register}
                      />
                    </>
                  ),
                  address: <>address</>,
                  website: <>website</>,
                  other: <>other</>,
                }[tab]
              }
            </TabContainer>
          </ContentContainer>
        </Container>
      </Modal>
    </>
  )
}

export default ProfileEditor
