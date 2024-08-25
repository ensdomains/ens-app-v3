import {
  CapsuleWeb,
  ConstructorOpts,
  Environment,
  GetCapsuleIntegratedOpts,
  getCapsuleWalletIntegrated,
  OAuthMethod,
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
}

export const capsuleClient = new CapsuleWeb(CAPSULE_ENV, CAPSULE_API_KEY, capsuleConstructorOpts)

export const capsuleIntegratedProps = {
  appName: '',
  oAuthMethods: [
    OAuthMethod.GOOGLE,
    OAuthMethod.TWITTER,
    OAuthMethod.DISCORD,
    OAuthMethod.APPLE,
    OAuthMethod.FACEBOOK,
  ],
  logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvaJ1zKHDtEqPik1OsCoPvQ8S92j7-AI1Q6F2j4yyE-Q&s',
}

const capsuleWalletItegratedOpts: GetCapsuleIntegratedOpts = {
  capsule: capsuleClient,
  nameOverride: `Sign in with ${APP_NAME}`,
  iconOverride: 'https://cryptologos.cc/logos/ethereum-name-service-ens-logo.png',
  iconBackgroundOverride: '#ffffff',
  onRampConfig: {
    network: 'ETHEREUM',
    // Supported values: 'BASE', 'OPTIMISM', 'ARBITRUM', 'POLYGON'
    asset: 'ETH',
    // Supported values: 'ETHEREUM', 'USDC', 'POLYGON', 'MATIC'
    providers: [
      { id: 'STRIPE' },
      // Enables Stripe
      {
        id: 'RAMP',
        hostApiKey: 'your-ramp-api-key',
      },
      // Enables Ramp
    ],
    testMode: false,
    // Enable test mode by passing 'true'
  },
}

export const capsuleWallet = getCapsuleWalletIntegrated(capsuleWalletItegratedOpts)
