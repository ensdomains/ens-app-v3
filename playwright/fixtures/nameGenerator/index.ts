/* eslint-disable import/no-extraneous-dependencies */
import { registerLegacy } from './registerLegacy'

type Props = {
  provider: any
}

export const nameGenerator = async (page: any) => {
  const label = `helloworld${Date.now()}`
  await registerLegacy(label, {})
  return `${label}.eth`
}
