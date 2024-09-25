import { connectorsForWallets } from '@usecapsule/rainbowkit'
import {
  CapsuleWeb,
  ConstructorOpts,
  Environment,
  GetCapsuleIntegratedOpts,
  getCapsuleWalletIntegrated,
  OAuthMethod,
  type CapsuleModalProps,
} from '@usecapsule/rainbowkit-wallet'

const APP_NAME = 'ENS'
const CAPSULE_ENV: Environment = Environment.BETA
const CAPSULE_API_KEY = 'ea5557d8aed418b3c195f28c5a8dd3bb'

const capsuleConstructorOpts: ConstructorOpts = {
  // Passkey Portal Branding
  portalBackgroundColor: '#FFFFFF',
  portalPrimaryButtonColor: '#5298FF',
  portalTextColor: '#000000',
  portalPrimaryButtonTextColor: '#FFFFFF',

  // User Email Branding
  emailTheme: 'light' as any,
  emailPrimaryColor: '#5298FF',
  githubUrl: 'https://github.com/ensdomains',
  xUrl: 'https://twitter.com/ensdomains',
  homepageUrl: 'https://ens.domains/',
  supportUrl: 'mailto:help@ens.domains',

  disableWorkers: true,
}

export const capsuleClient = new CapsuleWeb(CAPSULE_ENV, CAPSULE_API_KEY, capsuleConstructorOpts)

export const capsuleModalProps = {
  appName: '',
  oAuthMethods: [
    OAuthMethod.GOOGLE,
    OAuthMethod.TWITTER,
    OAuthMethod.DISCORD,
    OAuthMethod.APPLE,
    OAuthMethod.FACEBOOK,
  ],
} as const satisfies Partial<CapsuleModalProps>

const capsuleWalletItegratedOpts: GetCapsuleIntegratedOpts = {
  capsule: capsuleClient,
  nameOverride: 'Sign in with Capsule',
  iconBackgroundOverride: '#ffffff',
}

export const capsuleWallet = getCapsuleWalletIntegrated(capsuleWalletItegratedOpts)

export const capsuleWalletConnectorFn = connectorsForWallets(
  [
    {
      groupName: 'Managed',
      wallets: [capsuleWallet],
    },
  ],
  {
    appName: APP_NAME,
    projectId: '',
  },
)[0]
