import dynamic from 'next/dynamic'

import { VerificationProtocol } from '@app/transaction/user/input/VerifyProfile/VerifyProfile-flow'

export const verificationIconTypes: {
  [key in VerificationProtocol]: any
} = {
  dentity: dynamic(() => import('./Dentity.svg')),
}

export const DynamicVerificationIcon = ({ name }: { name: VerificationProtocol }) => {
  if (name in verificationIconTypes) {
    const Icon = verificationIconTypes[name]
    return <Icon />
  }
  return null
}
