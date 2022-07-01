import { fireEvent, render, screen } from '@app/test-utils'
import Accordion, { AccordionData } from './Accordion'

const data: AccordionData[] = [
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
    expect(screen.getByText('Body 1')).not.toHaveStyle('height: 0px')
    expect(screen.getByText('Body 2')).toHaveStyle('height: 0px')
    expect(
      screen.queryByTestId('accordion-Item 2-body'),
    ).not.toBeInTheDocument()
  })

  it('should show a disabled item correctly', () => {
    render(
      <Accordion
        data={[
          ...data,
          {
            title: 'Item 3',
            body: 'Body 3',
            disabled: true,
          },
        ]}
      />,
    )
    expect(screen.getByTestId('accordion-Item 3-disabled')).toBeVisible()
    expect(screen.getByText('Not wrapped')).toBeVisible()
    fireEvent.click(screen.getByTestId('accordion-Item 3-disabled'))
    expect(screen.queryByText('Body 3')).not.toBeInTheDocument()
  })
  it('should show an enabled item correctly', () => {
    render(<Accordion data={data} />)
    fireEvent.click(screen.getByTestId('accordion-Item 2-enabled'))
    expect(screen.getByText('Body 2')).not.toHaveStyle('height: 0px')
    expect(
      screen.queryByTestId('accordion-Item 1-body'),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Body 1')).toHaveStyle('height: 0px')
  })
})
