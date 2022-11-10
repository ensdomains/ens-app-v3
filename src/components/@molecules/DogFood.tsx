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
      register, 
      getFieldState, 
      watch, 
      setValue,
      label, 
      validations = {},
    // eslint-disable-next-line prettier/prettier
    }: Pick<ReturnType<typeof useForm<any>>, 'register' | 'getFieldState' | 'watch' | 'setValue'> 
    & { label?: string, validations?: any }
) => {
  const { t } = useTranslation('profile')
  const { getRecords } = useEns()

  const inputWatch = watch('dogfoodRaw')
  const { data: ethNameAddress } = useQuery(
    ['ethNameValidation', inputWatch],
    async () => {
      const result = await getRecords(inputWatch)
      return result?.address
    },
    { enabled: inputWatch?.includes('.eth') },
  )

  useEffect(() => {
    setValue('address', ethNameAddress || inputWatch)
  }, [ethNameAddress, inputWatch, setValue])

  const error = getFieldState('dogfoodRaw').error?.message

  return (
    <InnerContainer>
      <Input
        data-testid="send-name-input"
        label={label}
        placeholder={t('details.sendName.inputPlaceholder')}
        {...register('dogfoodRaw', {
          validate: {
            length: (value) =>
              !value.includes('.eth') && value.length !== 42
                ? t('errors.addressLength')
                : undefined,
            isAddress: (value) =>
              !value.includes('.eth') && !ethers.utils.isAddress(value)
                ? t('errors.invalidAddress')
                : undefined,
            ...validations
          },
        })}
        error={getFieldState('dogfoodRaw').error?.message}
      />
      {!error && inputWatch && (
        <>
        <Spacer $height='2' />
      <DisplayItems displayItems={[
        { label: 'address', value: inputWatch, type: 'address' },
      ]} />
        </>
      )}
    </InnerContainer>
  )
}
