import useThrottledCallback from '@app/hooks/useThrottledCallback'
import { isAddress } from '@ethersproject/address'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useQuery } from 'wagmi'

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
      hideLabel
    // eslint-disable-next-line prettier/prettier
    }: Pick<ReturnType<typeof useForm<any>>, 'register' | 'watch' | 'formState' | 'setValue'> 
    & { label?: string, validations?: any, disabled?: boolean, hideLabel?: boolean },
) => {
  const { t } = useTranslation('profile')
  const { getAddr } = useEns()

  const inputWatch: string | undefined = watch('dogfoodRaw')

  const throttledGetAddr = useThrottledCallback(getAddr, 500)

  const { data: ethNameAddress, refetch } = useQuery(
    ['getAddr', inputWatch],
    async ({ queryKey: [, name] }) => {
      try {
      const result = await throttledGetAddr(name!)
      return result as string ?? '' 
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
                  const result = await refetch({ queryKey: ['getAddr', value] })
                  if (result) { return undefined }
                // eslint-disable-next-line no-empty
                } catch {}
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
