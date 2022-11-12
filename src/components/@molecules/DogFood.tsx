import { ethers } from 'ethers'
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
      disabled,
      register, 
      getFieldState, 
      watch, 
      setValue,
      setError,
      label, 
      validations,
    // eslint-disable-next-line prettier/prettier
    }: Pick<ReturnType<typeof useForm<any>>, 'register' | 'getFieldState' | 'watch' | 'setValue' | 'setError' | 'getValues'> 
    & { label?: string, validations?: any, disabled?: boolean },
) => {
  const { t } = useTranslation('profile')
  const { getRecords } = useEns()
  const inputWatch = watch('dogfoodRaw')

  const { data: ethNameAddress } = useQuery(
    ['ethNameAddress', inputWatch],
    async () => {
      try {
      const result = await getRecords(inputWatch)
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
    if(inputWatch?.includes('.') && !finalValue) {
      setError('dogfoodRaw', { type: 'custom', message: 'ENS Name has no ethereum address record' }, { shouldFocus: true })
    }
  }, [finalValue, inputWatch, setError, setValue])

  const error = getFieldState('dogfoodRaw').error?.message

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
            ...validations
          },
        })}
        error={error}
      />
      {!error && finalValue && !disabled && (
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
