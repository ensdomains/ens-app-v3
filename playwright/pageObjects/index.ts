/* eslint-disable import/no-extraneous-dependencies */
import { Page } from '@playwright/test'

import { Web3ProviderBackend } from '@ensdomains/headless-web3-provider'

import { AddressPage } from './addressPage'
import { AdvancedEditorModal } from './advancedEditorModal'
import { EditRolesModal } from './editRolesModal'
import { ExtendNamesModal } from './extendNamesModal'
import { HomePage } from './homePage'
import { ImportPage } from './importPage'
import { MorePage } from './morePage'
import { OwnershipPage } from './ownershipPage'
import { PermissionsPage } from './permissionsPage'
import { ProfilePage } from './profilePage'
import { RecordsPage } from './recordsPage'
import { RegistrationPage } from './registrationPage'
import { SelectPrimaryNameModal } from './selectPrimaryNameModal'
import { SendNameModal } from './sendNameModal'
import { SettingsPage } from './settingsPage'
import { SubnamesPage } from './subnamePage'
import { TransactionModal } from './transactionModal'
import { VerificationsModal } from './verificationsModal'

type Dependencies = { page: Page; wallet: Web3ProviderBackend }

const pageObjects = {
  AddressPage,
  EditRolesModal,
  ExtendNamesModal,
  HomePage,
  ImportPage,
  MorePage,
  OwnershipPage,
  PermissionsPage,
  ProfilePage,
  RegistrationPage,
  SendNameModal,
  SubnamesPage,
  SettingsPage,
  SelectPrimaryNameModal,
  TransactionModal,
  RecordsPage,
  AdvancedEditorModal,
  VerificationsModal,
}

type PageObjects = typeof pageObjects

type PageObjectName = keyof PageObjects

type MyInstanceType<T extends { prototype: any }> = T['prototype']

type PageObjectInstance<T extends PageObjectName> = MyInstanceType<PageObjects[T]>

export const createPageObjectMaker =
  ({ page, wallet }: Dependencies) =>
  <T extends PageObjectName>(name: T): PageObjectInstance<T> => {
    if (name === 'TransactionModal') return new pageObjects.TransactionModal(page, wallet)
    const PageObject = pageObjects[name as Exclude<PageObjectName, 'TransactionModal'>]
    return new PageObject(page) as PageObjectInstance<T>
  }
