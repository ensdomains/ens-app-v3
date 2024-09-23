import type { TOptions } from 'i18next'
import { ComponentProps } from 'react'

import { ChangePrimaryName } from './intro/ChangePrimaryName'
import { GenericWithDescription } from './intro/GenericWithDescription'
import { MigrateAndUpdateResolver } from './intro/MigrateAndUpdateResolver'
import { SyncManager } from './intro/SyncManager'
import { WrapName } from './intro/WrapName'

export const transactionIntroComponents = {
  WrapName,
  MigrateAndUpdateResolver,
  SyncManager,
  ChangePrimaryName,
  GenericWithDescription,
}

export type TransactionIntroComponent = typeof transactionIntroComponents
export type TransactionIntroComponentName = keyof TransactionIntroComponent

export type TransactionIntroComponentParameters<name extends TransactionIntroComponentName> =
  unknown extends ComponentProps<TransactionIntroComponent[name]>
    ? undefined
    : ComponentProps<TransactionIntroComponent[name]>

export const createTransactionIntro = <name extends TransactionIntroComponentName>(
  name: name,
  data: ComponentProps<TransactionIntroComponent[name]>,
) => ({
  name,
  data,
})

export const AnyTransactionIntro = <name extends TransactionIntroComponentName>({
  name,
  data,
}: GenericTransactionIntro<name>) => {
  const Content = transactionIntroComponents[name]
  return <Content {...((data || {}) as any)} />
}

type GenericTransactionIntro<
  name extends TransactionIntroComponentName = TransactionIntroComponentName,
  data extends
    TransactionIntroComponentParameters<name> = TransactionIntroComponentParameters<name>,
> = {
  name: name
  data: data
}

export type TransactionIntroContent = {
  [name in TransactionIntroComponentName]: GenericTransactionIntro<name>
}[TransactionIntroComponentName]

type StoredTranslationReference = [key: string, options?: TOptions]

export type TransactionIntro<
  name extends TransactionIntroComponentName = TransactionIntroComponentName,
> = {
  title: StoredTranslationReference
  leadingLabel?: StoredTranslationReference
  trailingLabel?: StoredTranslationReference
  content: GenericTransactionIntro<name>
}
