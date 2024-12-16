import { fireEvent, mockFunction, render, screen, waitFor } from '@app/test-utils'

import { beforeAll, describe, expect, it, vi } from 'vitest'
import { useAccount, useSignTypedData } from 'wagmi'

import { useChainName } from '@app/hooks/chain/useChainName'

import { makeMockIntersectionObserver } from '../../../../../test/mock/makeMockIntersectionObserver'
import { AvatarUpload } from './AvatarUpload'

vi.mock('wagmi')

vi.mock('@app/hooks/chain/useChainName')

const mockUseChainName = mockFunction(useChainName)
const mockUseSignTypedData = mockFunction(useSignTypedData)
const mockUseAccount = mockFunction(useAccount)

const mockHandleCancel = vi.fn()
const mockHandleSubmit = vi.fn()
const mockFile = new File([], 'avatar.png')
const mockFileDataURL = 'data:image/jpeg;base64,00'

const mockSignTypedDataAsync = vi.fn()

makeMockIntersectionObserver()

const props = {
  handleCancel: mockHandleCancel,
  handleSubmit: mockHandleSubmit,
  avatar: mockFile,
  name: 'test.eth',
}

describe('<AvatarUpload />', () => {
  mockUseSignTypedData.mockImplementation(() => ({
    signTypedDataAsync: mockSignTypedDataAsync,
  }))
  mockUseAccount.mockImplementation(() => ({
    address: '0x80c5657CEE59A5a193EfDCfDf3D3913Fad977B61',
  }))
  mockUseChainName.mockImplementation(() => 'mainnet')

  beforeAll(() => {
    URL.createObjectURL = vi.fn(() => 'https://localhost/test.png')
  })
  it('initially shows crop component', () => {
    render(<AvatarUpload {...props} />)
    expect(screen.getByTestId('edit-image-container')).toBeVisible()
  })
  it('shows confirmation once crop is complete', () => {
    render(<AvatarUpload {...props} />)
    fireEvent.click(screen.getByTestId('continue-button'))
    expect(screen.getByTestId('cropped-image-preview')).toBeVisible()
  })
  it('calls handleCancel when cancel button is clicked', () => {
    render(<AvatarUpload {...props} />)
    fireEvent.click(screen.getByTestId('avatar-cancel-button'))
    expect(mockHandleCancel).toHaveBeenCalled()
  })
  it('calls handleSubmit with correct data if upload is successful', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => ({ message: 'uploaded' }),
      }),
    )
    vi.spyOn(Date, 'now').mockImplementation(() => 1588994800000)
    vi.spyOn(Uint8Array, 'from').mockImplementation(() => new Uint8Array())
    mockSignTypedDataAsync.mockResolvedValue('sig')

    render(<AvatarUpload {...props} />)
    fireEvent.click(screen.getByTestId('continue-button'))
    fireEvent.click(screen.getByTestId('upload-button'))
    await waitFor(() =>
      expect(global.fetch).toBeCalledWith('https://euc.li/test.eth', {
        method: 'PUT',
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expiry: `${1588994800000 + 1000 * 60 * 60 * 24 * 7}`,
          dataURL: mockFileDataURL,
          sig: 'sig',
          unverifiedAddress: '0x80c5657CEE59A5a193EfDCfDf3D3913Fad977B61',
        }),
      }),
    )

    await waitFor(() =>
      expect(mockHandleSubmit).toHaveBeenCalledWith(
        'upload',
        'https://euc.li/test.eth',
        mockFileDataURL,
      ),
    )
  })
  it('calls handleSubmit with network path if network is not mainnet', async () => {
    mockUseChainName.mockImplementation(() => 'sepolia')
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => ({ message: 'uploaded' }),
      }),
    )
    vi.spyOn(Date, 'now').mockImplementation(() => 1588994800000)
    vi.spyOn(Uint8Array, 'from').mockImplementation(() => new Uint8Array())
    mockSignTypedDataAsync.mockResolvedValue('sig')

    render(<AvatarUpload {...props} />)
    fireEvent.click(screen.getByTestId('continue-button'))
    fireEvent.click(screen.getByTestId('upload-button'))
    await waitFor(() =>
      expect(global.fetch).toBeCalledWith('https://euc.li/sepolia/test.eth', {
        method: 'PUT',
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expiry: `${1588994800000 + 1000 * 60 * 60 * 24 * 7}`,
          dataURL: mockFileDataURL,
          sig: 'sig',
          unverifiedAddress: '0x80c5657CEE59A5a193EfDCfDf3D3913Fad977B61',
        }),
      }),
    )
  })
  it('does not call handleSubmit if upload is unsuccessful', async () => {
    mockHandleSubmit.mockClear()
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => ({ error: 'failed', status: 500 }),
      }),
    )

    render(<AvatarUpload {...props} />)
    fireEvent.click(screen.getByTestId('continue-button'))
    fireEvent.click(screen.getByTestId('upload-button'))

    await waitFor(() => expect(global.fetch).toBeCalled())
    await waitFor(() => expect(mockHandleSubmit).not.toHaveBeenCalled())
  })
  it('shows error when upload fails', async () => {
    mockHandleSubmit.mockClear()
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => ({ error: 'failed', status: 500 }),
      }),
    )

    render(<AvatarUpload {...props} />)
    fireEvent.click(screen.getByTestId('continue-button'))
    fireEvent.click(screen.getByTestId('upload-button'))

    await waitFor(() => expect(global.fetch).toBeCalled())
    await waitFor(() => expect(mockHandleSubmit).not.toHaveBeenCalled())

    expect(screen.getByTestId('avatar-upload-error')).toBeVisible()
    expect(screen.getByTestId('avatar-upload-error')).toHaveTextContent('failed')
  })
})
