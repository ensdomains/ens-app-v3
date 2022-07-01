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
import { Banner } from '@app/components/@atoms/Banner/Banner'
import SUPPORTED_COIN_KEYS from '@app/constants/supportedAddresses.json'
import ACCOUNT_KEYS from '@app/constants/supportedTexts.json'
import { SelectableInput } from '../../../@molecules/SelectableInput/SelectableInput'
// import { validateCryptoAddress } from '../../../utils/validate'
import { useProfile } from '../../../../hooks/useProfile'
import coinOptions from './coinOptions'
import accountsOptions from './accountsOptions'
import ScrollIndicatorContainer from './ScrollIndicatorContainer'

const GENERAL_KEYS = ['name', 'description', 'location']

const Container = styled.form(({ theme }) => [
  css`
    width: 100%;
    height: content-height;
    max-height: 90vh;
    background: ${theme.colors.white};
    border-radius: ${theme.space['5']};
    overflow: hidden;
    display: flex;
    flex-direction: column;
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
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,
)

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

// const RecordIcon = ({ record }: { record: string }) => {
//   console.log(record)

//   console.log(addressIconTypes[record as AddressIconType])
//   const addressIconKey = record?.toLowerCase() as AddressIconType
//   if (addressIconTypes[addressIconKey]) {
//     return (
//       <IconWrapper>
//         <DynamicAddressIcon name={addressIconKey} />
//       </IconWrapper>
//     )
//   }
//   return null
// }

type ProfileType = {
  general: {
    name?: string
    location?: string
    description?: string
  }
  accounts: {
    [key: string]: string
  }
  address: {
    [key: string]: string
  }
  website: {
    url?: string
  }
  other: {
    [key: string]: string
  }
}

type Props = {
  open: boolean
  onDismiss?: () => void
}

const ProfileEditor = ({ open, onDismiss }: Props) => {
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

  const [existingAccountsRecords, setExistingAccountsRecords] = useState<
    string[]
  >([])
  // const [newAccountsRecords, setNewAccountsRecords] = useState<string[]>([])
  const [existingCoinRecords, setExistingCoinRecords] = useState<string[]>([])
  const [newCoinRecords, setNewCoinRecords] = useState<string[]>([])
  // const [existingOtherRecords, setExistingOtherRecords] = useState<string[]>([])

  const handleRemoveCoinRecord = (coin: string) => () => {
    console.log('>>>>')
    const oldAddress = getValues('address')
    const { [coin]: _, ...newAddress } = oldAddress
    setValue('address', newAddress)
    setExistingCoinRecords((coins) => coins.filter((_coin) => _coin !== coin))
    setNewCoinRecords((coins) => coins.filter((_coin) => _coin !== coin))
  }

  // //
  // const coinOptions = useMemo(() => {
  //   return SUPPORTED_COIN_KEYS.map((coin) => ({
  //     label: coin.toUpperCase(),
  //     value: coin,
  //     prefix: <RecordIcon record={coin} />,
  //   }))
  // }, [])

  const unusedCoinOptions = useMemo(() => {
    const usedCoins = [...existingCoinRecords, ...newCoinRecords]
    const newOptions = coinOptions.filter(
      (option) => !usedCoins.includes(option.value),
    )
    return newOptions
  }, [existingCoinRecords, newCoinRecords])

  // const availableCoinOptions = (coin: string) => {
  //   return [
  //     {
  //       label: coin.toUpperCase(),
  //       value: coin,
  //       prefix: <RecordIcon record={coin} />,
  //     },
  //     ...unusedCoinOptions,
  //   ]
  // }

  const handleAddNewCoin = () => {
    if (unusedCoinOptions.length > 0) {
      const newAddress = unusedCoinOptions[0].value
      setNewCoinRecords((addresses) => [...addresses, newAddress])
    }
  }

  const handleCoinChange = (index: number, newCoin: string) => {
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

  const { profile } = useProfile('khori.eth', false)
  useEffect(() => {
    if (profile) {
      console.log('profile', profile)
      const profileAddress =
        profile.records?.coinTypes?.reduce((map, record) => {
          const { coin } = record
          const { addr } = record as any
          if (coin && SUPPORTED_COIN_KEYS.includes(coin.toLowerCase())) {
            const newMap = { [coin]: addr, ...map }
            return newMap
          }
          if (coin) {
            const newMap = { ...map, [coin]: addr }
            return newMap
          }
          return map
        }, {}) || {}

      const textRecords = profile.records?.texts?.reduce<
        Omit<ProfileType, 'address'>
      >(
        (map, record) => {
          if (GENERAL_KEYS.includes(record.key.toString())) {
            const newMap = {
              ...map,
              general: { ...map.general, [record.key]: record.value },
            }
            return newMap
          }
          if (ACCOUNT_KEYS.includes(record.key.toString())) {
            const key = record.key.toString().replace(/\./g, '_')
            return {
              ...map,
              accounts: { ...map.accounts, [key]: record.value },
            }
          }
          if (record.key === 'url')
            return { ...map, website: { url: record.value } }
          return {
            ...map,
            other: { ...map.other, [record.key]: record.value },
          }
        },
        { general: {}, accounts: {}, website: {}, other: {} },
      ) || { general: {}, accounts: {}, website: {}, other: {} }
      const resp = {
        ...textRecords,
        address: profileAddress,
      }
      console.log('resp----------', resp)

      reset(resp)
      setExistingCoinRecords(Object.keys(resp.address) as string[])
      setExistingAccountsRecords(Object.keys(resp.accounts) as string[])
    }
  }, [profile, reset])

  return (
    <>
      <Modal open={open} onDismiss={onDismiss}>
        <Container onSubmit={handleSubmit((data: any) => console.log(data))}>
          <Banner>
            <AvatarWrapper>
              <Avatar label="profile-avatar" src="" noBorder />
            </AvatarWrapper>
          </Banner>
          <NameContainer>yoginth.eth</NameContainer>
          <ContentContainer>
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
            <ScrollIndicatorContainer>
              {
                {
                  general: (
                    <>
                      <Input label="Nickname" {...register('general.name')} />
                      <Input
                        label="Location"
                        {...register('general.location')}
                      />
                      <Textarea
                        label="Short Bio"
                        {...register('general.description')}
                      />
                    </>
                  ),
                  accounts: (
                    <>
                      {existingAccountsRecords.map((account) => (
                        <SelectableInput
                          key={account}
                          selectValue={account}
                          label="hello111"
                          options={accountsOptions}
                          readOnly
                          {...register(`accounts.${account}`, {})}
                          onDelete={handleRemoveCoinRecord(account)}
                        />
                      ))}{' '}
                    </>
                  ),
                  address: (
                    <>
                      {existingCoinRecords.map((coin) => (
                        <SelectableInput
                          key={coin}
                          selectValue={coin}
                          label="hello111"
                          options={coinOptions}
                          readOnly
                          {...register(`address.${coin}`, {})}
                          onDelete={handleRemoveCoinRecord(coin)}
                        />
                      ))}
                      {newCoinRecords.map((coin, index) => (
                        <SelectableInput
                          key={coin}
                          selectValue={coin}
                          onSelectChange={(e) =>
                            handleCoinChange(index, e.target.value)
                          }
                          error={
                            getFieldState(`address.${coin}`, formState).error
                              ?.message
                          }
                          hasChanges={
                            getFieldState(`address.${coin}`, formState).isDirty
                          }
                          label={coin}
                          options={coinOptions}
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck={false}
                          onDelete={handleRemoveCoinRecord(coin)}
                          {...register(`address.${coin}`, {})}
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
                  website: (
                    <>
                      <SelectableInput
                        selectValue="ipfs"
                        onSelectChange={(e) =>
                          handleCoinChange(0, e.target.value)
                        }
                        error={
                          getFieldState(`website.url`, formState).error?.message
                        }
                        hasChanges={
                          getFieldState(`website.url`, formState).isDirty
                        }
                        label="url"
                        options={[{ value: 'ipfs', label: 'ipfs' }]}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        onDelete={handleRemoveCoinRecord('url')}
                        {...register(`website.url`, {})}
                      />
                    </>
                  ),
                  other: <>other</>,
                }[tab]
              }
            </ScrollIndicatorContainer>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Button tone="grey">Cancel</Button>
              <Button disabled={hasErrors} type="submit">
                Save
              </Button>
            </div>
          </ContentContainer>
        </Container>
      </Modal>
    </>
  )
}

export default ProfileEditor
