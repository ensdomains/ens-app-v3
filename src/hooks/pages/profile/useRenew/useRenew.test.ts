import { it, expect, describe} from "vitest";

import { calculateRenewState } from "./useRenew";

describe('calculateRenewState', () => {
  it('should return connect-user if accountStatus is disconnected', () => {
    expect(calculateRenewState({
      registrationStatus: 'gracePeriod',
      isRegistrationStatusLoading: false,
      renewSeconds: 123,
      connectModalOpen: false,
      accountStatus: 'disconnected',
      isAbilitiesLoading: false,
      isRouterReady: true,
      name: 'name',
      openedConnectModal: false,
      openConnectModal: () => {}
    })).toBe('connect-user')
  })

  it('should return connect-user if accountStatus is connected', () => {
    expect(calculateRenewState({
      registrationStatus: 'registered',
      isRegistrationStatusLoading: false,
      renewSeconds: 123,
      connectModalOpen: false,
      accountStatus: 'connected',
      isAbilitiesLoading: false,
      isRouterReady: true,
      name: 'name',
      openedConnectModal: false,
      openConnectModal: () => {}
    })).toBe('display-extend-names')
  })

  it('should return idle if registration status is available', () => {
    expect(calculateRenewState({
      registrationStatus: 'available',
      isRegistrationStatusLoading: false,
      renewSeconds: 123,
      connectModalOpen: false,
      accountStatus: 'connected',
      isAbilitiesLoading: false,
      isRouterReady: true,
      name: 'name',
      openedConnectModal: false,
      openConnectModal: () => {}
    })).toBe('idle')
  })

  it('should return idle if registration status is loading', () => {
    expect(calculateRenewState({
      registrationStatus: 'registered',
      isRegistrationStatusLoading: true,
      renewSeconds: 123,
      connectModalOpen: false,
      accountStatus: 'connected',
      isAbilitiesLoading: false,
      isRouterReady: true,
      name: 'name',
      openedConnectModal: false,
      openConnectModal: () => {}
    })).toBe('idle')
  })

  it('should return idle if renewSeconds is null', () => {
    expect(calculateRenewState({
      registrationStatus: 'registered',
      isRegistrationStatusLoading: false,
      renewSeconds: null,
      connectModalOpen: false,
      accountStatus: 'connected',
      isAbilitiesLoading: false,
      isRouterReady: true,
      name: 'name',
      openedConnectModal: false,
      openConnectModal: () => {}
    })).toBe('idle')
  })

  it('should return idle if connectModalOpen is true', () => {
    expect(calculateRenewState({
      registrationStatus: 'registered',
      isRegistrationStatusLoading: false,
      renewSeconds: 123,
      connectModalOpen: true,
      accountStatus: 'connected',
      isAbilitiesLoading: false,
      isRouterReady: true,
      name: 'name',
      openedConnectModal: false,
      openConnectModal: () => {}
    })).toBe('idle')
  })

  it('should return idle if abilities is loading', () => {
    expect(calculateRenewState({
      registrationStatus: 'registered',
      isRegistrationStatusLoading: false,
      renewSeconds: 123,
      connectModalOpen: false,
      accountStatus: 'connected',
      isAbilitiesLoading: true,
      isRouterReady: true,
      name: 'name',
      openedConnectModal: false,
      openConnectModal: () => {}
    })).toBe('idle')
  })

  it('should return idle if isRouterReady is false', () => {
    expect(calculateRenewState({
      registrationStatus: 'registered',
      isRegistrationStatusLoading: false,
      renewSeconds: 123,
      connectModalOpen: false,
      accountStatus: 'connected',
      isAbilitiesLoading: false,
      isRouterReady: false,
      name: 'name',
      openedConnectModal: false,
      openConnectModal: () => {}
    })).toBe('idle')
  })

  it('should return idle if name is empty', () => {
    expect(calculateRenewState({
      registrationStatus: 'registered',
      isRegistrationStatusLoading: false,
      renewSeconds: 123,
      connectModalOpen: false,
      accountStatus: 'connected',
      isAbilitiesLoading: false,
      isRouterReady: true,
      name: '',
      openedConnectModal: false,
      openConnectModal: () => {}
    })).toBe('idle')
  })

  it('should return idle if openedConnectModal is true', () => {
    expect(calculateRenewState({
      registrationStatus: 'registered',
      isRegistrationStatusLoading: false,
      renewSeconds: 123,
      connectModalOpen: false,
      accountStatus: 'connected',
      isAbilitiesLoading: false,
      isRouterReady: true,
      name: 'name',
      openedConnectModal: true,
      openConnectModal: () => {}
    })).toBe('idle')
  })

  it('should return idle if openConnectModal is undefined and accountStatus is disconnected', () => {
    expect(calculateRenewState({
      registrationStatus: 'registered',
      isRegistrationStatusLoading: false,
      renewSeconds: 123,
      connectModalOpen: false,
      accountStatus: 'disconnected',
      isAbilitiesLoading: false,
      isRouterReady: true,
      name: 'name',
      openedConnectModal: false,
      openConnectModal: undefined
    })).toBe('idle')
  })
})