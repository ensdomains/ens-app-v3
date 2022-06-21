import { render, screen, fireEvent } from '@app/test-utils'

import Accordion, { AccordionData } from './Accordion'

const data: AccordionData = [
  {
    title: 'Item 1',
    body: 'Body 1',
  },
  {
    title: 'Item 2',
    body: 'Body 2',
  },
]

describe('Accordion', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    render(<Accordion data={data} />)
  })
  it('should show the correct body based on clicked item', () => {
    render(<Accordion data={data} />)
    expect(screen.getByText('Body 2')).toHaveStyle('height: 0px')
    fireEvent.click(screen.getByText('Item 2'))
    expect(screen.getByText('Body 1')).toHaveStyle('height: 0px')
  })

  it.todo('should show disabled item correctly')
  it.todo('should show enabled item correctly')
})
