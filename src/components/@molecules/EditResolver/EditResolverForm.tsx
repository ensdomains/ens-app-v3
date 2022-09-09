import { Spacer } from '@app/components/@atoms/Spacer'
import { Outlink } from '@app/components/Outlink'
import useResolverEditor from '@app/hooks/useResolverEditor'
import { Input, RadioButton, Typography } from '@ensdomains/thorin'
import { ethers } from 'ethers'
import { RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

const InputContainer = styled.div(
  ({ theme }) => css`
    margin-left: ${theme.space[8]};
  `,
)

const NegativeSpacer = styled.div(
  ({ theme }) => css`
    margin-top: -${theme.space['5.5']};
  `,
)

const LatestResolverLabel = styled.div<{ $offset: boolean }>(
  ({ theme, $offset }) => css`
    display: flex;
    flex-direction: column;
    ${$offset && `padding-top: ${theme.space['5.5']};`}
  `,
)

const LatestResolverTitleContainer = styled.div(
  () => css`
    display: flex;
    align-items: center;
  `,
)

const LatestResolverTitle = styled.span(
  () => css`
    :after {
      content: '\xa0';
    }
  `,
)

const LatestResolverSubtitle = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textSecondary};
  `,
)

type Props = ReturnType<typeof useResolverEditor> & {
  formRef: RefObject<HTMLFormElement>
  resolverAddress: string | undefined
}

const EditResolverForm = ({
  isResolverAddressLatest,
  lastestResolverAddress,
  resolverChoice,
  handleSubmit,
  register,
  trigger,
  getFieldState,
  formRef,
  resolverAddress,
}: Props) => {
  const { t } = useTranslation('transactionFlow')

  const latestResolverLabel = (
    <LatestResolverLabel $offset={isResolverAddressLatest}>
      <LatestResolverTitleContainer>
        <LatestResolverTitle>{t('input.editResolver.latestLabel')}</LatestResolverTitle>
        <Outlink href={`https://etherscan.io/address/${lastestResolverAddress}`}>
          {t('input.editResolver.etherscan')}
        </Outlink>
      </LatestResolverTitleContainer>
      {isResolverAddressLatest && (
        <LatestResolverSubtitle weight="medium" variant="small">
          {t('input.editResolver.latestMessage')}
        </LatestResolverSubtitle>
      )}
    </LatestResolverLabel>
  )

  return (
    <form data-testid="edit-resolver-form" onSubmit={handleSubmit} ref={formRef}>
      {isResolverAddressLatest && <NegativeSpacer />}
      <RadioButton
        label={latestResolverLabel}
        value="latest"
        labelRight
        disabled={isResolverAddressLatest}
        {...register('resolverChoice', {
          required: true,
          validate: {},
          onChange: () => {
            process.nextTick(() => trigger())
            trigger()
          },
        })}
      />
      <RadioButton
        label={t('input.editResolver.customLabel')}
        value="custom"
        labelRight
        {...register('resolverChoice')}
      />
      <InputContainer>
        <Input
          label="Custom resolver input"
          hideLabel
          placeholder={t('input.editResolver.customPlaceholder')}
          disabled={resolverChoice !== 'custom'}
          {...register('customResolver', {
            validate: {
              length: (value) =>
                resolverChoice === 'custom' && value.length !== 42
                  ? 'Address should be 42 characters long'
                  : undefined,
              isCurrentResolver: (value) =>
                resolverChoice === 'custom' && value === resolverAddress
                  ? 'This is the current resolver'
                  : undefined,
              isAddress: (value) =>
                resolverChoice === 'custom' && !ethers.utils.isAddress(value)
                  ? 'Not a valid address'
                  : undefined,
            },
          })}
          error={getFieldState('customResolver').error?.message}
        />
      </InputContainer>
      <Spacer $height="4" />
    </form>
  )
}

export default EditResolverForm
