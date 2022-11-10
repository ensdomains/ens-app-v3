import { RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { RadioButton, Typography } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { Outlink } from '@app/components/Outlink'
import useResolverEditor from '@app/hooks/useResolverEditor'

import { DogFood } from '../DogFood'

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
    &::after {
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
  setValue,
  watch,
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
        <DogFood
          {...{
            register,
            getFieldState,
            watch,
            setValue,
            validations: {
              isCurrentResolver: (value) =>
                resolverChoice === 'custom' && value === resolverAddress
                  ? 'This is the current resolver'
                  : undefined,
            },
          }}
        />
      </InputContainer>
      <Spacer $height="4" />
    </form>
  )
}

export default EditResolverForm
