import { RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Dialog, RadioButton, Typography } from '@ensdomains/thorin'

import { Outlink } from '@app/components/Outlink'
import { useChainName } from '@app/hooks/chain/useChainName'
import useResolverEditor from '@app/hooks/useResolverEditor'
import { makeEtherscanLink } from '@app/utils/utils'

import { DogFood } from '../DogFood'
import EditResolverWarnings from './EditResolverWarnings'

const LatestResolverLabel = styled.div<{ $offset: boolean }>(
  ({ theme, $offset }) => css`
    display: flex;
    flex-direction: column;

    /* ${$offset && `padding-top: ${theme.space['5.5']};`} */
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
  formState,
  hasWarnings,
  resolverWarnings,
}: Props) => {
  const { t } = useTranslation('transactionFlow')
  const chainName = useChainName()

  const latestResolverLabel = (
    <LatestResolverLabel $offset={isResolverAddressLatest}>
      <LatestResolverTitleContainer>
        <LatestResolverTitle>{t('input.editResolver.latestLabel')}</LatestResolverTitle>
        <Outlink
          data-testid="latest-resolver-etherscan"
          href={makeEtherscanLink(lastestResolverAddress, chainName, 'address')}
        >
          {t('input.editResolver.etherscan')}
        </Outlink>
      </LatestResolverTitleContainer>
      {isResolverAddressLatest && (
        <LatestResolverSubtitle fontVariant="small">
          {t('input.editResolver.latestMessage')}
        </LatestResolverSubtitle>
      )}
    </LatestResolverLabel>
  )

  return (
    <Dialog.Content
      as="form"
      data-testid="edit-resolver-form"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <EditResolverWarnings {...{ hasWarnings, resolverWarnings }} />
      <RadioButton
        label={latestResolverLabel}
        value="latest"
        data-testid="latest-resolver-radio"
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
        description={
          <DogFood
            {...{
              formState,
              disabled: resolverChoice !== 'custom',
              register,
              getFieldState,
              watch,
              setValue,
              hideLabel: true,
              trigger,
              validations: {
                isCurrentResolver: (value: string) =>
                  resolverChoice === 'custom' && value === resolverAddress
                    ? 'This is the current resolver'
                    : undefined,
              },
            }}
          />
        }
        value="custom"
        data-testid="custom-resolver-radio"
        {...register('resolverChoice')}
      />
    </Dialog.Content>
  )
}

export default EditResolverForm
