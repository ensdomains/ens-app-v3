import { ComponentProps, Dispatch, ReactNode, useState } from 'react'
import { Control, useForm, useWatch } from 'react-hook-form'
import styled, { css } from 'styled-components'

import type { NamedFusesToBurn } from '@ensdomains/ensjs'
import { Button, Dialog, Input, RadioButton, Typography } from '@ensdomains/thorin'

import { PermissionsCheckbox } from '@app/components/@molecules/PermissionsCheckbox/PermissionsCheckbox'
import { useGetWrapperData } from '@app/hooks/useGetWrapperData'
import { dateToDateTimeLocal } from '@app/utils/datetime-local'

import { makeTransactionItem } from '../../transaction'
import { TransactionDialogPassthrough, TransactionFlowAction } from '../../types'

type Data = {
  name: string
}

export type Props = {
  data: Data
  onDismiss: () => void
  dispatch: Dispatch<TransactionFlowAction>
} & TransactionDialogPassthrough

type View = 'burn' | 'expiry'

type FormData = {
  burnPCC: boolean
  expiryType: 'max' | 'custom'
  expiryInput: string
}

const Form = styled.form(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};

    padding-top: ${theme.space['2.5']};
  `,
)

type ControlledButtonProps = { control: Control<FormData> } & ComponentProps<typeof Button>

const ControlledButton = ({ control, ...props }: ControlledButtonProps) => {
  const burnPCC = useWatch({ control, name: 'burnPCC' })
  return <Button {...props} disabled={!burnPCC} />
}

const ExpiryOptionsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
  `,
)

const DateContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['2']} ${theme.space['4']};
    background: ${theme.colors.greySurface};
    border-radius: ${theme.space['2']};
  `,
)

const BurnPCC = ({ data, onDismiss, dispatch }: Props) => {
  const { name } = data
  const { wrapperData } = useGetWrapperData((name as string) || '')

  const [view, setView] = useState<View>('burn')

  const now = new Date(Date.now())
  const date = new Date(Date.now() + 12096e5)

  const min = dateToDateTimeLocal(now)
  const max = dateToDateTimeLocal(date)

  const { register, control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      burnPCC: false,
      expiryType: 'max',
      expiryInput: max,
    },
  })

  const onSubmit = (selectedFuses: NamedFusesToBurn, permissions: string[]) => {
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('burnFuses', {
          name: name as string,
          selectedFuses: selectedFuses as NamedFusesToBurn,
          permissions,
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

  const views: { [key in View]: ReactNode } = {
    burn: (
      <div>
        <PermissionsCheckbox
          {...register('burnPCC', { required: true })}
          title="Revoke: Unwrap this name"
          description="Permission for owner to unwrap this name."
        />
      </div>
    ),
    expiry: (
      <ExpiryOptionsContainer>
        <RadioButton
          value="max"
          label={
            <Typography typography="Body/Bold" color="text">
              Keep current (max)
            </Typography>
          }
          description={
            <DateContainer>
              <Typography typography="Small/Bold" color="text">
                {`${date.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}`}
              </Typography>
              <Typography typography="Small/Normal" color="grey">
                {`${date.toLocaleTimeString(undefined, {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: false,
                  timeZoneName: 'longOffset',
                })} `}
              </Typography>
            </DateContainer>
          }
          {...register('expiryType')}
        />
        <RadioButton
          value="custom"
          label={
            <Typography typography="Body/Bold" color="text">
              Choose an earlier date
            </Typography>
          }
          description={
            <Input
              label="custom-expiry"
              hideLabel
              type="datetime-local"
              clearable={false}
              min={min}
              max={max}
              {...register('expiryInput')}
            />
          }
          {...register('expiryType')}
        />
      </ExpiryOptionsContainer>
    ),
  }

  const handleNext = () => {
    setView('expiry')
  }

  const handleBack = () => {
    if (view === 'expiry') return setView('burn')
    return onDismiss()
  }

  const trailingButton: { [key in View]: ReactNode } = {
    burn: (
      <ControlledButton colorScheme="primary" control={control} type="button" onClick={handleNext}>
        Next
      </ControlledButton>
    ),
    expiry: (
      <Button type="submit" colorScheme="primary">
        Next
      </Button>
    ),
  }

  return (
    <Form>
      <Dialog.Heading title="Give up ownership" onDismiss={() => onDismiss()} />
      <Typography typography="Body/Normal" color="text">
        This will give ownership of this name to the manager
      </Typography>
      {views[view]}
      <Dialog.Footer
        leading={
          <Button colorScheme="secondary" onClick={handleBack}>
            Back
          </Button>
        }
        trailing={trailingButton[view]}
      />
    </Form>
  )
}

export default BurnPCC
