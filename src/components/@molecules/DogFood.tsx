import { isAddress } from '@ethersproject/address'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useQuery, useQueryClient } from 'wagmi'

import { Input } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { useEns } from '@app/utils/EnsProvider'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback';
import { useQueryKeys } from '@app/utils/cacheKeyFactory'
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
      hideLabel,
      trigger
    // eslint-disable-next-line prettier/prettier
    }: Pick<ReturnType<typeof useForm<any>>, 'register' | 'watch' | 'formState' | 'setValue' | 'trigger'> 
    & { label?: string, validations?: any, disabled?: boolean, hideLabel?: boolean },
) => {
  const { t } = useTranslation('profile')
  const { getAddr, ready } = useEns()
  const queryClient = useQueryClient()

  const inputWatch: string | undefined = watch('dogfoodRaw')

  // Throttle the change of the input
  const [ethNameInput, setEthNameInput] = useState('')
  const throttledSetEthNameInput = useDebouncedCallback(setEthNameInput, 500)
  useEffect(() => {
      throttledSetEthNameInput((inputWatch || '').toLocaleLowerCase())
  }, [inputWatch, throttledSetEthNameInput])

  const queryKeyGenerator = useQueryKeys().dogfood 

  // Attempt to get address of ENS name
  const { data: ethNameAddress } = useQuery(
     queryKeyGenerator(ethNameInput),
    async () => {
      try {
      const result = await getAddr(ethNameInput, '60')
      return (result as any)?.addr || ''
      } catch (e) {
        return ''
      }
    },
    { enabled: !!ethNameInput?.includes('.') && ready },
  )

  // Update react value of address
  const finalValue = inputWatch?.includes('.') ? ethNameAddress : inputWatch
  useEffect(() => { 
    setValue('address', finalValue)
    if (finalValue) trigger('dogfoodRaw')
  }, [finalValue, setValue, trigger])

  const errorMessage = formState.errors.dogfoodRaw?.message

  return (
    <InnerContainer>
      <Input
        data-testid="dogfood"
        disabled={disabled}
        label={label}
        hideLabel={hideLabel}
        placeholder={t('details.sendName.inputPlaceholder')}
        {...register('dogfoodRaw', {
          validate: {
            length: (value) =>
              !disabled && !value?.includes('.') && value?.length !== 42
                ? t('errors.addressLength')
                : undefined,
            isAddress: (value) =>
              !disabled && !value?.includes('.') && !isAddress(value)
                ? t('errors.invalidAddress')
                : undefined,
            hasAddressRecord: async (value) => {
              if(value?.includes('.')) {
                try {
                  const result = await queryClient.getQueryData(queryKeyGenerator(value.toLowerCase()))
                  if (result) { return undefined }
                // eslint-disable-next-line no-empty
                } catch (e){
                  console.error('validation error: ', e)
                }
                return 'ENS Name has no address record'
                }
              },
            ...validations
          },
        })}
        error={errorMessage}
        onClickAction={() => setValue('dogfoodRaw', '')}
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
