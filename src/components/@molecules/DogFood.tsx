import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { isAddress } from 'viem'
import { useAccount, useChainId } from 'wagmi'

import { Input } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { useAddressRecord } from '@app/hooks/ensjs/public/useAddressRecord'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import { createQueryKey } from '@app/hooks/useQueryOptions'

import { DisplayItems } from './TransactionDialogManager/DisplayItems'

const InnerContainer = styled.div(() => [
  css`
    width: 100%;
  `,
])

type DogFoodProps = Pick<
  ReturnType<typeof useForm<any>>,
  'register' | 'watch' | 'formState' | 'setValue' | 'trigger'
> & { label?: string; validations?: any; disabled?: boolean; hideLabel?: boolean }

export const DogFood = ({
  register,
  watch,
  formState,
  setValue,
  disabled,
  validations,
  label,
  hideLabel,
  trigger,
}: DogFoodProps) => {
  const { t } = useTranslation('profile')
  const queryClient = useQueryClient()

  const inputWatch: string | undefined = watch('dogfoodRaw')

  // Throttle the change of the input
  const [ethNameInput, setEthNameInput] = useState('')
  const throttledSetEthNameInput = useDebouncedCallback(setEthNameInput, 500)
  useEffect(() => {
    throttledSetEthNameInput((inputWatch || '').toLocaleLowerCase())
  }, [inputWatch, throttledSetEthNameInput])

  const chainId = useChainId()
  const { address } = useAccount()

  const { data: addressRecordData } = useAddressRecord({
    enabled: !!ethNameInput?.includes('.'),
    name: ethNameInput,
  })

  const ethNameAddress = useMemo(() => {
    return addressRecordData?.value || ''
  }, [addressRecordData?.value])

  // Update react value of address
  const finalValue = inputWatch?.includes('.') ? ethNameAddress : inputWatch
  useEffect(() => {
    setValue('address', finalValue)
    if (finalValue) trigger('dogfoodRaw')
  }, [finalValue, setValue, trigger])

  const errorMessage = formState.errors.dogfoodRaw?.message as string

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
            hasAddressRecord: async (value: string) => {
              if (value?.includes('.')) {
                try {
                  const result = await queryClient.getQueryData(
                    createQueryKey({
                      chainId,
                      address,
                      queryDependencyType: 'standard',
                      functionName: 'getAddressRecord',
                      params: { name: value.toLowerCase() },
                    }),
                  )
                  if (result) {
                    return undefined
                  }
                  // eslint-disable-next-line no-empty
                } catch (e) {
                  console.error('validation error: ', e)
                }
                return 'ENS Name has no address record'
              }
            },
            ...validations,
          },
        })}
        error={errorMessage}
        onClickAction={() => setValue('dogfoodRaw', '')}
      />
      {!errorMessage && finalValue && !disabled && (
        <>
          <Spacer $height="2" />
          <DisplayItems displayItems={[{ label: 'address', value: finalValue, type: 'address' }]} />
        </>
      )}
    </InnerContainer>
  )
}
