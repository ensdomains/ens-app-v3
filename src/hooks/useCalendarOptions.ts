import { CalendarEvent, google, ics, office365, outlook, yahoo } from 'calendar-link'

const calendarOptions = [
  {
    value: 'google',
    label: 'tabs.more.misc.reminderOptions.google',
    function: google,
  },
  {
    value: 'outlook',
    label: 'tabs.more.misc.reminderOptions.outlook',
    function: outlook,
  },
  {
    value: 'office365',
    label: 'tabs.more.misc.reminderOptions.office365',
    function: office365,
  },
  {
    value: 'yahoo',
    label: 'tabs.more.misc.reminderOptions.yahoo',
    function: yahoo,
  },
  {
    value: 'ics',
    label: 'tabs.more.misc.reminderOptions.ical',
    function: ics,
  },
]

export function useCalendarOptions(title: string) {
  const makeEvent = (expiryDate: Date): CalendarEvent => ({
    title,
    start: expiryDate,
    duration: [10, 'minute'],
    url: window.location.href,
  })

  return {
    makeEvent,
    options: calendarOptions,
  }
}
