/* eslint-disable import/no-extraneous-dependencies */
import { Page } from '@playwright/test'
import { Web3ProviderBackend } from 'headless-web3-provider'

import { AddressPage } from './addressPage'
import { ExtendNamesModal } from './extendNamesModal'
import { HomePage } from './homePage'
import { MorePage } from './morePage'
import { PermissionsPage } from './permissionsPage'
import { ProfilePage } from './profilePage'
import { RegistrationPage } from './registrationPage'
import { SendNameModal } from './sendNameModal'
import { SubnamesPage } from './subnamePage'
import { TransactionModal } from './transactionModal'

type Dependencies = { page: Page; wallet: Web3ProviderBackend }

const pageObjects = {
  AddressPage,
  ExtendNamesModal,
  HomePage,
  MorePage,
  PermissionsPage,
  ProfilePage,
  RegistrationPage,
  SendNameModal,
  SubnamesPage,
  TransactionModal,
}

type PageObjects = typeof pageObjects

type PageObjectName = keyof PageObjects

export const createPageObjectMaker =
  ({ page, wallet }: Dependencies) =>
  <T extends PageObjectName>(name: T) => {
    const PageObject = pageObjects[name]
    return new PageObject(page, wallet) as InstanceType<PageObjects[T]>
  }
