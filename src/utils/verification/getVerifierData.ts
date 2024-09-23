import { createDentityPublicProfileUrl } from '@app/transaction/user/input/VerifyProfile/utils/createDentityUrl'
import type { VerificationProtocol } from '@app/transaction/user/input/VerifyProfile/VerifyProfile-flow'

export const getVerifierData = (key: VerificationProtocol, value: string) => {
  switch (key) {
    case 'dentity':
      return {
        icon: 'dentity',
        color: '#000000',
        label: 'Dentity',
        value,
        type: 'link',
        urlFormatter: createDentityPublicProfileUrl({ name: value }),
      }
    default:
      return null
  }
}
