import { fireEvent, render, screen, userEvent, waitFor } from '@app/test-utils'

import { ExpirationDate } from './ExpirationDate'

describe('ExpirateDate', () => {
  it('should render the expiry date correctly', () => {
    const expiryDate = new Date('2022-12-31T23:59:59Z')
    const formattedDate = new Intl.DateTimeFormat('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(expiryDate)
    render(
      <ExpirationDate
        {...{
          expiryDate,
          name: 'name',
          setShowEarnifiDialog: () => null,
          t: (translationKey) => translationKey,
        }}
      />,
    )
    expect(screen.getByText(formattedDate)).toBeInTheDocument()
  })
  it('should render the expiry time correctly', () => {
    const expiryDate = new Date('2022-12-31T23:59:59Z')
    const formattedTime = new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      timeZoneName: 'short',
    }).format(expiryDate)
    render(
      <ExpirationDate
        {...{
          expiryDate,
          name: 'name',
          setShowEarnifiDialog: () => null,
          t: (translationKey) => translationKey,
        }}
      />,
    )
    expect(screen.getByText(formattedTime)).toBeInTheDocument()
  })
  it('should show the Earnifi dialog when the Earnifi button is clicked', async () => {
    const expiryDate = new Date('2022-12-31T23:59:59Z')
    const setShowEarnifiDialog = jest.fn()
    render(
      <ExpirationDate
        {...{
          expiryDate,
          name: 'name',
          setShowEarnifiDialog,
          t: (translationKey) => translationKey,
        }}
      />,
    )
    const remindMeButton = screen.getByText(/action.remindMe/i)
    userEvent.click(remindMeButton)
    await waitFor(() => screen.getByText(/tabs.more.misc.reminderOptions.earnifi/i))
    const earnifiButton = screen.getByText(/tabs.more.misc.reminderOptions.earnifi/i)
    fireEvent.click(earnifiButton)
    await waitFor(() => expect(setShowEarnifiDialog).toHaveBeenCalledTimes(1))
  })

  it('should call makeEvent when a calendar option is clicked', async () => {
    const expiryDate = new Date('2022-12-31T23:59:59Z')
    const setShowEarnifiDialog = jest.fn()
    const windowOpenSpy = jest.spyOn(window, 'open')
    render(
      <ExpirationDate
        {...{
          expiryDate,
          name: 'name',
          setShowEarnifiDialog,
          t: (translationKey) => translationKey,
        }}
      />,
    )
    const remindMeButton = screen.getByText(/action.remindMe/i)
    userEvent.click(remindMeButton)
    await waitFor(() => screen.getByText(/tabs.more.misc.reminderOptions.google/i))
    const googleButton = screen.getByText(/tabs.more.misc.reminderOptions.google/i)
    fireEvent.click(googleButton)
    await waitFor(() => expect(setShowEarnifiDialog).toHaveBeenCalledTimes(0))
    expect(windowOpenSpy).toHaveBeenCalled()
    windowOpenSpy.mockRestore()
  })
})
