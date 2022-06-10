import { Button, Input, Select, CloseSVG } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'
import { SelectProps } from '@ensdomains/thorin/dist/types/components/molecules/Select'
import { FieldValues, UseFormRegister } from 'react-hook-form'

const Container = styled.div(
  () => css`
    display: flex;
    align-items: flex-end;
    gap: 5px;
  `,
)

const ButtonContainer = styled.div(
  () => css`
    width: 33px;
    height: 33px;
    margin-bottom: 10px;
    margin-right: -10px;
    svg {
      display: block;
    }
  `,
)

type Props = {
  value: string
  options: SelectProps['options']
  register: UseFormRegister<FieldValues>
}

export const SelectableInput = ({ value, options, register }: Props) => {
  return (
    <Container>
      <Input
        label="hello"
        size="medium"
        prefix={
          <Select
            value="eth"
            options={options}
            label="hello"
            hideLabel
            style={{ marginLeft: '-18px' }}
          />
        }
        {...register(value)}
      />
      <ButtonContainer>
        <Button size="extraSmall" variant="transparent" shadowless>
          <CloseSVG />
        </Button>
      </ButtonContainer>
    </Container>
  )
}
