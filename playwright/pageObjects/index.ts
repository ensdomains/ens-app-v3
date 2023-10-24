/* eslint-disable import/no-extraneous-dependencies */
import { Page } from '@playwright/test'
import { Web3ProviderBackend } from 'headless-web3-provider'

import { AddressPage } from './addressPage'
import { EditRolesModal } from './editRolesModal'
import { ExtendNamesModal } from './extendNamesModal'
import { HomePage } from './homePage'
import { MorePage } from './morePage'
import { OwnershipPage } from './ownershipPage'
import { PermissionsPage } from './permissionsPage'
import { ProfilePage } from './profilePage'
import { RegistrationPage } from './registrationPage'
import { SendNameModal } from './sendNameModal'
import { SubnamesPage } from './subnamePage'
import { TransactionModal } from './transactionModal'

type Dependencies = { page: Page; wallet: Web3ProviderBackend }

const pageObjects = {
  AddressPage,
  EditRolesModal,
  ExtendNamesModal,
  HomePage,
  MorePage,
  OwnershipPage,
  PermissionsPage,
  ProfilePage,
  RegistrationPage,
  SendNameModal,
  SubnamesPage,
  TransactionModal,
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
