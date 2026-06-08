import { describe, expect, it } from 'vitest'

import { calculateTransactions } from './calculateTransactions'

// Minimal RegistrationParameters fixture — only the fields makeCommitment
// reads matter for slot-layout assertions.
const baseParams = {
  name: 'somename.testing',
  owner: '0x000000000000000000000000000000000000beef',
  duration: 31_536_000,
  secret: '0x0000000000000000000000000000000000000000000000000000000000000001',
  resolverAddress: '0x000000000000000000000000000000000000c0de',
  records: [],
  fuses: { named: [], unnamed: [] },
  reverseRecord: false,
} as unknown as Parameters<typeof calculateTransactions>[0]['registrationParams']

describe('calculateTransactions', () => {
  // BINDING — DO NOT CHANGE WITHOUT MATCHING CONTRACT CHANGE.
  //
  // SimplexController is UUPS-upgradeable on OpenZeppelin v4.9.3. The
  // inheritance chain (Initializable + ContextUpgradeable + OwnableUpgradeable
  // + Ownable2StepUpgradeable + ERC1967UpgradeUpgradeable + UUPSUpgradeable)
  // consumes 251 storage slots of __gap padding + owner state before any of
  // the controller's own variables. `commitments` is declared 10th in
  // SimplexController.sol (after ens, base, minCommitmentAge,
  // maxCommitmentAge, reverseRegistrar, defaultReverseRegistrar, prices,
  // tldNode, tldSuffix), so it lands at slot 260. Verified on mainnet via
  // eth_getStorageAt.
  //
  // Symptom of getting this wrong: `eth_estimateGas` for the register tx
  // reverts during state-override simulation, the gas estimate is treated as
  // 0n, and the user sees "0.0000 ETH" as the network fee.
  it('writes the simulated commitment to commitments-mapping slot 260, not slot 1 (upstream ENS)', () => {
    const result = calculateTransactions({
      registrationParams: baseParams,
      ethRegistrarControllerAddress: '0x000000000000000000000000000000000000ca11',
      fiveMinutesAgoInSeconds: 1_700_000_000,
      price: { base: 0n, premium: 0n },
    })

    expect(result).not.toBeNull()
    const registerTx = result!.find((t) => t.name === 'registerName')
    expect(registerTx).toBeDefined()
    const controllerOverride = registerTx!.stateOverride![0]
    expect(controllerOverride.stateDiff![0].slot).toBe(260)
  })

  it('returns null when any required input is missing', () => {
    expect(
      calculateTransactions({
        registrationParams: undefined,
        ethRegistrarControllerAddress: '0xCA11',
        fiveMinutesAgoInSeconds: 0,
        price: { base: 0n, premium: 0n },
      }),
    ).toBeNull()
    expect(
      calculateTransactions({
        registrationParams: baseParams,
        ethRegistrarControllerAddress: undefined,
        fiveMinutesAgoInSeconds: 0,
        price: { base: 0n, premium: 0n },
      }),
    ).toBeNull()
    expect(
      calculateTransactions({
        registrationParams: baseParams,
        ethRegistrarControllerAddress: '0xCA11',
        fiveMinutesAgoInSeconds: 0,
        price: undefined,
      }),
    ).toBeNull()
  })

  it('emits the commit + register transaction pair in order', () => {
    const result = calculateTransactions({
      registrationParams: baseParams,
      ethRegistrarControllerAddress: '0x000000000000000000000000000000000000ca11',
      fiveMinutesAgoInSeconds: 1_700_000_000,
      price: { base: 1n, premium: 0n },
    })
    expect(result?.map((t) => t.name)).toEqual(['commitName', 'registerName'])
  })
})
