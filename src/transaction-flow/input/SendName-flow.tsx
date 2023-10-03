import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

type Data = {
  name: string
  type?: 'manager' | 'owner'
}

// type FormData = {
//   managerChoice: string
//   ownerChoice: string
//   dogfoodRaw: string
//   address: string
// }

export type Props = {
  data: Data
} & TransactionDialogPassthrough

// type BasicNameData = ReturnType<typeof useBasicName>

// const SwitchBox = styled.div(
//   ({ theme }) => css`
//     display: flex;
//     align-items: center;
//     justify-content: flex-end;
//     gap: ${theme.space['4']};
//     padding: 20px;
//     width: 100%;
//     border-radius: ${theme.radii.extraLarge};
//     border: ${theme.borderWidths.px} ${theme.borderStyles.solid} ${theme.colors.border};
//   `,
// )

// const TextContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   flex: 1;
// `

// const Form = styled.form(
//   () => css`
//     width: 100%;
//   `,
// )

// const InnerContainer = styled.div(({ theme }) => [
//   css`
//     width: 100%;
//   `,
//   mq.sm.min(css`
//     width: calc(80vw - 2 * ${theme.space['6']});
//     max-width: 510px;
//   `),
// ])

// const FooterContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `

// TODO (tate): readd from refactor
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SendName = ({ data, dispatch, onDismiss }: Props) => {
  return null
}

export default SendName
