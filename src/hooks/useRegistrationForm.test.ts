import { renderHook } from '@testing-library/react-hooks'

import { ProfileRecord, grouped } from '../constants/profileRecordOptions'
import { useRegistrationForm } from './useRegistrationForm'

const records: ProfileRecord[] = [
  {
    key: 'ETH',
    group: 'address',
    type: 'addr',
    value: '0xb794f5ea0ba39494ce839613fffba74279579268',
  },
  {
    key: 'avatar',
    group: 'general',
    type: 'text',
    value: 'https://image.com/avatar.png',
  },
]

const validEth = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
const invalidEth = '0x70997970C51812dc3A010C7d01b50e0d17dc79C4'
const validSwarm = 'bzz://d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162'

describe('useRegistrationForm', () => {
  it('should load the default records', async () => {
    const { result } = renderHook(() => useRegistrationForm(records))
    expect(result.current.getAvatar()).toBe('https://image.com/avatar.png')
    expect(result.current.getRecords()).toEqual([records[0]])
  })

  it('should not return an empty string for any groups', async () => {
    const { result } = renderHook(() => useRegistrationForm(records))
    grouped.forEach(({ items }) => {
      items.forEach((record) => {
        expect(result.current.labelForRecord(record)).toBeTruthy()
        expect(result.current.secondaryLabelForRecord(record)).toBeTruthy()
      })
    })
  })

  it('should return the right validator', async () => {
    const { result } = renderHook(() => useRegistrationForm(records))
    expect(
      await result.current.validatorForRecord({
        key: 'ETH',
        group: 'address',
        type: 'addr',
      })(validEth),
    ).toBe(true)
    expect(
      typeof (await result.current.validatorForRecord({
        key: 'ETH',
        group: 'address',
        type: 'addr',
      })(invalidEth)),
    ).toBe('string')
    expect(
      await result.current.validatorForRecord({
        key: 'swarm',
        group: 'website',
        type: 'contenthash',
      })(validSwarm),
    ).toBe(true)
    expect(
      typeof (await result.current.validatorForRecord({
        key: 'swarm',
        group: 'website',
        type: 'contenthash',
      })(validSwarm)),
    ).toBe('string')
  })
})
