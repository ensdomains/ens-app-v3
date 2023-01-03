import { ComponentProps, Dispatch, PropsWithChildren, ReactNode, useState } from 'react'
import { Control, useForm, useWatch } from 'react-hook-form'
import styled, { css } from 'styled-components'

import type { NamedFusesToBurn } from '@ensdomains/ensjs'
import { Button, Checkbox, Dialog, Input, RadioButton, Typography } from '@ensdomains/thorin'

import BurnFusesContent from '@app/components/@molecules/BurnFuses/BurnFusesContent'
import { PermissionsCheckbox } from '@app/components/@molecules/PermissionsCheckbox/PermissionsCheckbox'
import { useGetWrapperData } from '@app/hooks/useGetWrapperData'

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

const DateContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['2']} ${theme.space['4']};
    background: ${theme.colors.greySurface};
    border-radius: ${theme.space['2']};
  `,
)

export const BurnPCC = ({ data, onDismiss, dispatch }: Props) => {
  const { name } = data
  const { wrapperData } = useGetWrapperData((name as string) || '')

  const [view, setView] = useState<View>('burn')

  const { register, watch, control } = useForm<FormData>({
    defaultValues: {
      burnPCC: false,
    },
  })

  const test = watch('burnPCC')
  console.log('watch', test)

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

  const date = (() => {
    const now = new Date()
    return new Date(now.getDate() + 7)
  })()

  console.log('date', typeof date, date)

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
      <div>
        <RadioButton
          label={
            <Typography typography="Body/Bold" color="text">
              Keep current (max)
            </Typography>
          }
          description={
            <DateContainer>
              <Typography typography="Small/Bold" color="text">
                {`${date.getMonth()} ${date.getDate()}, ${date.getFullYear()}`}
              </Typography>
              <Typography typography="Small/Normal" color="grey">
                date
              </Typography>
            </DateContainer>
          }
        />
        <RadioButton
          label={
            <Typography typography="Body/Bold" color="text">
              Choose an earlier date
            </Typography>
          }
          description={
            <Input label="custom-expiry" hideLabel type="datetime-local" clearable={false} />
          }
        />
      </div>
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
