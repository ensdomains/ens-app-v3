import { connectorsForWallets } from '@getpara/rainbowkit'
import {
  ConstructorOpts,
  Environment,
  GetParaIntegratedOpts,
  getParaWalletIntegrated,
  OAuthMethod,
  ParaWeb,
  type ParaModalProps,
} from '@getpara/rainbowkit-wallet'

import i18n from '../../i18n'
import { ENS_LINKS, WC_PROJECT_ID } from '../constants'
import { transports } from './wagmi'

const prodParaApiKey = process.env.NEXT_PUBLIC_PARA_API_KEY_PROD

const APP_NAME = 'ENS'
const PARA_ENV: Environment = prodParaApiKey ? Environment.PROD : Environment.BETA
const PARA_API_KEY = prodParaApiKey || 'de88c0d78a98dd9a3b11897893997b06' // NOSONAR

const paraConstructorOpts: ConstructorOpts = {
  // Passkey Portal Branding
  portalBackgroundColor: '#FFFFFF',
  portalPrimaryButtonColor: '#5298FF',
  portalTextColor: '#000000',
  portalPrimaryButtonTextColor: '#FFFFFF',

  // User Email Branding
  emailTheme: 'light' as any,
  emailPrimaryColor: '#5298FF',
  githubUrl: ENS_LINKS.GITHUB,
  xUrl: ENS_LINKS.X,
  homepageUrl: ENS_LINKS.HOMEPAGE,
  supportUrl: ENS_LINKS.EMAIL,
}

export const paraClient = new ParaWeb(PARA_ENV, PARA_API_KEY, paraConstructorOpts)

export const paraModalProps = {
  appName: 'ENS Manager App',
  oAuthMethods: [OAuthMethod.GOOGLE, OAuthMethod.DISCORD, OAuthMethod.APPLE, OAuthMethod.FACEBOOK],
  recoverySecretStepEnabled: true,
} as const satisfies Partial<ParaModalProps>

const paraWalletItegratedOpts: GetParaIntegratedOpts = {
  para: paraClient,
  nameOverride: i18n.t('para.signInWithPara'),
  iconBackgroundOverride: '#ffffff',
  transports,
}

export const paraWallet = getParaWalletIntegrated(paraWalletItegratedOpts)

export const paraWalletConnectorFn = connectorsForWallets(
  [
    {
      groupName: 'Sign up or log in',
      wallets: [paraWallet],
    },
  ],
  {
    appName: APP_NAME,
    projectId: WC_PROJECT_ID,
  },
)[0]
