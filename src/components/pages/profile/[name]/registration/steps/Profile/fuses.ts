import { FuseObj } from '@app/types'

export const defaultFuses: Partial<FuseObj> = {
  CANNOT_BURN_FUSES: false,
  CANNOT_UNWRAP: false,
  CANNOT_CREATE_SUBDOMAIN: false,
  CANNOT_SET_RESOLVER: false,
  CANNOT_SET_TTL: false,
  CANNOT_TRANSFER: false,
}
