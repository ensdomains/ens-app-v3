import { ethers } from 'ethers'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useQuery } from 'wagmi'

import { Input, Typography, mq } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { NameAvatar } from '@app/components/AvatarWithZorb'
import { useChainId } from '@app/hooks/useChainId'
import { usePrimary } from '@app/hooks/usePrimary'
import { useEns } from '@app/utils/EnsProvider'

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['7']};
    min-width: ${theme.space['7']};
    height: ${theme.space['7']};
  `,
)

const ValueTypography = styled(Typography)(
  () => css`
    text-align: right;
  `,
)

const ValueWithAvatarContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.space['4']};
    padding: 20px;
    width: 100%;
    border-radius: ${theme.radii.extraLarge};
    border: ${theme.borderWidths.px} ${theme.borderStyles.solid}
      rgba(${theme.shadesRaw.foreground}, 0.06);
  `,
)

const InnerContainer = styled.div(() => [
  css`
    width: 100%;
  `,
  mq.sm.min(css`
    width: 510px;
  `),
])

const NameValue = ({ value }: { value: string }) => {
  const network = useChainId()

  return (
    <ValueWithAvatarContainer>
      <ValueTypography weight="bold">{value}</ValueTypography>
      <AvatarWrapper>
        <NameAvatar name={value} label={`${value}-avatar`} network={network} />
      </AvatarWrapper>
    </ValueWithAvatarContainer>
  )
}

export const DogFood = (
    { 
      register, 
      getFieldState, 
      watch, 
      setValue 
    // eslint-disable-next-line prettier/prettier
    }: Pick<ReturnType<typeof useForm<any>>, 'register' | 'getFieldState' | 'watch' | 'setValue'>
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
  const { name: primaryName } = usePrimary(ethNameAddress || inputWatch)

  useEffect(() => {
    setValue('address', ethNameAddress || inputWatch)
  }, [ethNameAddress, inputWatch, setValue])

  return (
    <InnerContainer>
      <Input
        data-testid="send-name-input"
        label="Send to"
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
          },
        })}
        error={getFieldState('dogfoodRaw').error?.message}
      />
      {primaryName && (
        <>
         <Spacer $height="2" />
         <NameValue value={primaryName} />
        </>
      )}
    </InnerContainer>
  )
}
