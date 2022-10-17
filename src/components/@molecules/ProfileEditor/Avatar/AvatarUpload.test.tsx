import { fireEvent, mockFunction, render, screen, waitFor } from '@app/test-utils'

import { useSignTypedData } from 'wagmi'

import { AvatarUpload } from './AvatarUpload'

jest.mock('@app/hooks/useChainName', () => ({
  useChainName: () => 'mainnet',
}))

const mockHandleCancel = jest.fn()
const mockHandleSubmit = jest.fn()
const mockFile = new File([], 'avatar.png')
const mockUseSignTypedData = mockFunction(useSignTypedData)
const mockFileDataURL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCADOAM4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8qqKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/2Q=='

const mockSignTypedDataAsync = jest.fn()

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
  window.IntersectionObserver = jest.fn()
  ;(window.IntersectionObserver as jest.Mock).mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }))

  window.ResizeObserver = jest.fn()
  ;(window.ResizeObserver as jest.Mock).mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }))

  beforeAll(() => {
    URL.createObjectURL = jest.fn(() => 'https://localhost/test.png')
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
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => ({ message: 'uploaded' }),
      }),
    )
    jest.spyOn(Date, 'now').mockImplementation(() => 1588994800000)
    jest.spyOn(Uint8Array, 'from').mockImplementation(() => new Uint8Array())
    mockSignTypedDataAsync.mockResolvedValue('sig')

    render(<AvatarUpload {...props} />)
    fireEvent.click(screen.getByTestId('continue-button'))
    fireEvent.click(screen.getByTestId('upload-button'))
    await waitFor(() =>
      expect(global.fetch).toBeCalledWith(
        'https://avatar-upload.ens-cf.workers.dev/mainnet/test.eth',
        {
          method: 'PUT',
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            expiry: `${1588994800000 + 1000 * 60 * 60 * 24 * 7}`,
            dataURL: mockFileDataURL,
            sig: 'sig',
          }),
        },
      ),
    )

    await waitFor(() => expect(mockHandleSubmit).toHaveBeenCalled())
  })
  it('does not call handleSubmit if upload is unsuccessful', async () => {
    mockHandleSubmit.mockClear()
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => ({ message: 'failed' }),
      }),
    )

    render(<AvatarUpload {...props} />)
    fireEvent.click(screen.getByTestId('continue-button'))
    fireEvent.click(screen.getByTestId('upload-button'))

    await waitFor(() => expect(global.fetch).toBeCalled())
    await waitFor(() => expect(mockHandleSubmit).not.toHaveBeenCalled())
  })
})
