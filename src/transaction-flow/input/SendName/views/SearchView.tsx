import { useState } from 'react'
import styled, { css } from 'styled-components'
import { P, match } from 'ts-pattern'

import {
  Button,
  Dialog,
  Input,
  MagnifyingGlassSVG,
  ScrollBox,
  Spinner,
  Typography,
} from '@ensdomains/thorin'

type Props = {
  control: any
}

const StyledScrollBox = styled(ScrollBox)(
  ({ theme }) => css`
    flex: 1;
    width: 100%;
    /* border-bottom: 1px solid ${theme.colors.border}; */
  `,
)
const Content = styled.div(() => css``)

const Centered = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: ${theme.space[2]};
    align-items: center;
    color: ${theme.colors.accent};
  `,
)

const Message = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    gap: ${theme.space[2]};
    align-items: center;
    color: ${theme.colors.accent};
    width: ${theme.space[40]};
  `,
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SearchView = ({ control }: Props) => {
  // const [subview, setSubview] = useState()
  const [search] = useState('ddd')
  const results = {
    data: [
      {
        name: 'test.eth',
        address: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
      },
    ],
    isLoading: false,
  }

  return (
    <>
      <Input name="name" label="Name" hideLabel />
      <StyledScrollBox hideDividers={{ bottom: true }}>
        <Content>
          {match([search, results])
            .with([P.when((s: string) => s.length > 2), { isLoading: true }], () => (
              <Centered>
                <Spinner color="accent" size="medium" />
              </Centered>
            ))
            .with(
              [
                P.when((s: string) => s.length > 2),
                { data: P.when((d) => !!d && d.length > 0), isLoading: false },
              ],
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ([_, { data }]) => (
                <>
                  {data.map((name) => (
                    <div>{name.name}</div>
                  ))}
                </>
              ),
            )
            .otherwise(() => (
              <Centered>
                <Message>
                  <MagnifyingGlassSVG />
                  <Typography>Search for an ENS name or ETH address</Typography>
                </Message>
              </Centered>
            ))}
        </Content>
      </StyledScrollBox>
      <Dialog.Footer trailing={<Button colorStyle="accentSecondary">Cancel</Button>} />
    </>
  )
}
