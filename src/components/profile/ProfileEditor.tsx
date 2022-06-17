import React, { useState, useMemo, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { Theme } from 'typings-custom/styled-components'
import { useForm } from 'react-hook-form'
import {
  mq,
  Modal,
  Avatar,
  Input,
  Textarea,
  Button,
  PlusSVG,
} from '@ensdomains/thorin'
import { DynamicAddressIcon } from '@app/assets/address/DynamicAddressIcon'
import { Banner } from '../@atoms/Banner/Banner'
import { SelectableInput } from '../@molecules/SelectableInput/SelectableInput'
import { validateCryptoAddress } from '../../utils/validate'

enum AccountType {
  twitter = 'twitter',
  opensea = 'opensea',
}

// const ACCOUNT_LIST = Object.values(AccountType)

enum CoinType {
  bitcoin = 'btc',
  binanceCoin = 'bnb',
  ethereum = 'eth',
  dogeCoin = 'doge',
  litecoin = 'ltc',
  polkadot = 'dot',
  solana = 'sol',
}

const COIN_LIST = Object.values(CoinType)

const Container = styled.form(({ theme }) => [
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

type ProfileType = {
  general: {
    nickname?: string
    location?: string
    bio?: string
  }
  accounts: {
    [key in AccountType]: string
  }
  address: {
    [key in CoinType]: string
  }
  website: {
    ipfs?: string
  }
  other: {
    [key: string]: string
  }
}
const ProfileEditor = () => {
  const {
    register,
    formState,
    watch,
    reset,
    setValue,
    getValues,
    getFieldState,
    handleSubmit,
  } = useForm<ProfileType>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      general: {},
      accounts: {},
      address: {},
      website: {},
      other: {},
    },
  })

  const [tab, setTab] = useState<TabType>('address')
  const handleTabClick = (_tab: TabType) => () => setTab(_tab)
  const hasErrors = Object.keys(formState.errors || {}).length > 0

  /** * GENERAL TAB */

  /**
   * ADDRESSES TAB
   * */

  const address = watch('address')
  console.log('address', address)

  const [existingCoinRecords, setExistingCoinRecords] = useState<CoinType[]>([])
  const [newCoinRecords, setNewCoinRecords] = useState<CoinType[]>([])

  const handleRemoveCoinRecord = (coin: CoinType) => () => {
    setExistingCoinRecords((coins) => coins.filter((_coin) => _coin !== coin))
  }

  //
  const coinOptions = useMemo(() => {
    return COIN_LIST.map((coin) => ({
      label: coin.toUpperCase(),
      value: coin,
      prefix: (
        <IconWrapper>
          <DynamicAddressIcon name={coin} />
        </IconWrapper>
      ),
    }))
  }, [])

  const unusedCoinOptions = useMemo(() => {
    const usedCoins = [...existingCoinRecords, ...newCoinRecords]
    return coinOptions.filter((option) => !usedCoins.includes(option.value))
  }, [coinOptions, existingCoinRecords, newCoinRecords])

  const availableCoinOptions = (coin: CoinType) => {
    return [
      {
        label: coin.toUpperCase(),
        value: coin,
        prefix: (
          <IconWrapper>
            <DynamicAddressIcon name={coin} />
          </IconWrapper>
        ),
      },
      ...unusedCoinOptions,
    ]
  }

  const handleAddNewCoin = () => {
    if (unusedCoinOptions.length > 0) {
      const newAddress = unusedCoinOptions[0].value
      setNewCoinRecords((addresses) => [...addresses, newAddress])
    }
  }

  const handleCoinChange = (index: number, newCoin: CoinType) => {
    const oldCoin = newCoinRecords[index]
    if (oldCoin) {
      const { [oldCoin]: oldCoinAddress, ...otherAddresses } =
        getValues('address')
      const newAddress = { ...otherAddresses, [newCoin]: oldCoinAddress }
      setValue(`address`, newAddress as any)
      setNewCoinRecords((coins) =>
        coins.map((coin, coinIndex) => (index === coinIndex ? newCoin : coin)),
      )
    }
  }

  console.log(formState)
  console.log(
    'accounts.eth',
    watch('address.eth'),
    getFieldState('address.eth', formState),
  )
  console.log('bnb', getFieldState('address.bnb', formState))
  console.log('ltc', getFieldState('address.ltc', formState))

  console.log('accounts.btc', watch('address.btc'))
  console.log('errors', formState.errors)

  useEffect(() => {
    setTimeout(() => {
      const resp = {
        general: {
          nickname: 'The fonz',
          location: 'old town america',
          bio: 'HEEEEEEYYYYY',
        },
        accounts: {
          twitter: 'yoyoyoyo',
        },
        address: {
          eth: 'ethaddress',
          btc: 'btcaddress',
        },
      }
      reset(resp)
      setExistingCoinRecords(Object.keys(resp.address) as CoinType[])
    }, 1000)
  }, [])

  return (
    <>
      <Modal open onDismiss={() => {}}>
        <Container onSubmit={handleSubmit((data) => console.log(data))}>
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
                  $hasError={!!getFieldState('general', formState).error}
                  $isDirty={getFieldState('general').isDirty}
                  onClick={handleTabClick('general')}
                >
                  General
                </TabButton>
                <TabButton
                  $selected={tab === 'accounts'}
                  $hasError={!!getFieldState('accounts', formState).error}
                  $isDirty={getFieldState('accounts').isDirty}
                  onClick={handleTabClick('accounts')}
                >
                  Accounts
                </TabButton>
                <TabButton
                  $selected={tab === 'address'}
                  $hasError={!!getFieldState('address', formState).error}
                  $isDirty={getFieldState('address').isDirty}
                  onClick={handleTabClick('address')}
                >
                  Address
                </TabButton>
                <TabButton
                  $selected={tab === 'website'}
                  $hasError={!!getFieldState('website', formState).error}
                  $isDirty={getFieldState('website').isDirty}
                  onClick={handleTabClick('website')}
                >
                  Website
                </TabButton>
                <TabButton
                  $selected={tab === 'other'}
                  $hasError={!!getFieldState('other', formState).error}
                  $isDirty={getFieldState('other').isDirty}
                  onClick={handleTabClick('other')}
                >
                  Other
                </TabButton>
              </TabButtonsContainer>
              {
                {
                  general: (
                    <>
                      <Input
                        label="Nickname"
                        {...register('general.nickname')}
                      />
                      <Input
                        label="Location"
                        {...register('general.location')}
                      />
                      <Textarea
                        label="Short Bio"
                        {...register('general.bio')}
                      />
                    </>
                  ),
                  accounts: <>accounts</>,
                  address: (
                    <>
                      {existingCoinRecords.map((coin) => (
                        <SelectableInput
                          key={coin}
                          selectValue={coin}
                          label="hello111"
                          options={coinOptions}
                          readOnly
                          {...register(`address.${coin}`, {
                            validate: validateCryptoAddress(coin),
                          })}
                          onDelete={handleRemoveCoinRecord(coin)}
                        />
                      ))}
                      {newCoinRecords.map((coin, index) => (
                        <SelectableInput
                          key={coin}
                          selectValue={coin}
                          onSelectChange={(e) =>
                            handleCoinChange(index, e.target.value as CoinType)
                          }
                          error={
                            getFieldState(`address.${coin}`, formState).error
                              ?.message
                          }
                          hasChanges={
                            getFieldState(`address.${coin}`, formState).isDirty
                          }
                          label={coin}
                          options={availableCoinOptions(coin)}
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck={false}
                          onDelete={handleRemoveCoinRecord(coin)}
                          {...register(`address.${coin}`, {
                            validate: validateCryptoAddress(coin),
                          })}
                        />
                      ))}
                      {unusedCoinOptions.length > 0 && (
                        <Button
                          outlined
                          prefix={<PlusSVG />}
                          variant="transparent"
                          shadowless
                          onClick={handleAddNewCoin}
                        >
                          Add Address
                        </Button>
                      )}
                    </>
                  ),
                  website: <>website</>,
                  other: <>other</>,
                }[tab]
              }
            </TabContainer>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Button tone="grey">Cancel</Button>
              <Button disabled={hasErrors} type="submit">
                Save
              </Button>
            </div>
          </ContentContainer>
          <div style={{ height: '200px' }} />
        </Container>
      </Modal>
    </>
  )
}

export default ProfileEditor
