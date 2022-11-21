import { ethers } from 'ethers'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useQuery } from 'wagmi'
import pMemoize from 'p-memoize';

import { Input } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { useEns } from '@app/utils/EnsProvider'
import { DisplayItems } from './TransactionDialogManager/DisplayItems'


const InnerContainer = styled.div(() => [
  css`
    width: 100%;
  `,
])

export const DogFood = (
    { 
      register, 
      watch, 
      formState,
      setValue,
      disabled,
      validations,
      label, 
    // eslint-disable-next-line prettier/prettier
    }: Pick<ReturnType<typeof useForm<any>>, 'register' | 'watch' | 'formState' | 'setValue'> 
    & { label?: string, validations?: any, disabled?: boolean },
) => {
  const { t } = useTranslation('profile')
  const { getRecords } = useEns()
  const getRecordsMem = useRef(pMemoize(getRecords))

  const inputWatch = watch('dogfoodRaw')

  const { data: ethNameAddress } = useQuery(
    ['ethNameAddress', inputWatch],
    async () => {
      try {
      const result = await getRecordsMem.current(inputWatch)
      return result?.address ?? '' 
      } catch (e) {
        return ''
      }
    },
    { enabled: inputWatch?.includes('.') },
  )
  const finalValue = inputWatch?.includes('.') ? ethNameAddress : inputWatch
  useEffect(() => { 
    setValue('address', finalValue)
  }, [finalValue, setValue])
  const errorMessage = formState.errors.dogfoodRaw?.message

  return (
    <InnerContainer>
      <Input
        data-testid="dogfood"
        disabled={disabled}
        label={label}
        placeholder={t('details.sendName.inputPlaceholder')}
        {...register('dogfoodRaw', {
          validate: {
            length: (value) =>
              !disabled && !value?.includes('.') && value?.length !== 42
                ? t('errors.addressLength')
                : undefined,
            isAddress: (value) =>
              !disabled && !value?.includes('.') && !ethers.utils.isAddress(value)
                ? t('errors.invalidAddress')
                : undefined,
            hasAddressRecord: async (value) => {
              if(value?.includes('.')) {
                try {
                  const result = await getRecordsMem.current(value)
                  return result?.address ? undefined : 'ENS Name has no address record'
                } catch (e) {
                  return 'ENS Name has no address record'
                }
                }
              },
            ...validations
          },
        })}
        error={errorMessage}
      />
      {!errorMessage && finalValue && !disabled && (
        <>
         <Spacer $height='2' />
          <DisplayItems displayItems={[
            { label: 'address', value: finalValue, type: 'address' },
          ]} />
        </>
      )}
    </InnerContainer>
  )
}
