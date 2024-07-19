import { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'

export const getVerifierData = (key: VerificationProtocol, value: string) => {
  switch (key) {
    case 'dentity':
      return {
        icon: 'dentity',
        color: '#000000',
        label: 'Dentity',
        value,
        type: 'link',
        urlFormatter: `https://dentity.com/${value}`, // TODO: GET THE CORRECT URL
      }
    default:
      return null
  }
}
