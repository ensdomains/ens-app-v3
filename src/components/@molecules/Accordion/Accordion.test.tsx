import { fireEvent, mockFunction, render, screen } from '@app/test-utils'

import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import Accordion, { AccordionData } from './Accordion'

jest.mock('@app/transaction-flow/TransactionFlowProvider')
const mockUseTransactionFlow = mockFunction(useTransactionFlow)

const data: AccordionData[] = [
  {
    title: 'Item 1',
    name: 'item1',
    body: () => <>Body 1</>,
  },
  {
    title: 'Item 2',
    name: 'item2',
    body: () => <>Body 2</>,
  },
]

describe('Accordion', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    mockUseTransactionFlow.mockReturnValue({
      prepareDataInput: () => () => {},
    })
    render(<Accordion data={data} name="test" />)
  })
  it('should show the correct body based on clicked item', () => {
    render(<Accordion data={data} name="test" />)
    expect(screen.getByText('Body 1')).not.toHaveStyle('height: 0px')
    expect(screen.getByText('Body 2')).toHaveStyle('height: 0px')
    fireEvent.click(screen.getByText('Item 2'))
    expect(screen.getByText('Body 2')).not.toHaveStyle('height: 0px')
    expect(screen.getByText('Body 1')).toHaveStyle('height: 0px')
  })

  it('should show a disabled item correctly', () => {
    render(
      <Accordion
        name="test"
        data={[
          ...data,
          {
            title: 'Item 3',
            name: 'item3',
            body: () => <>Body 3</>,
            disabled: true,
          },
        ]}
      />,
    )
    expect(screen.getByTestId('accordion-Item 3-disabled')).toBeVisible()
    expect(screen.getByText('details.notWrapped')).toBeVisible()
    fireEvent.click(screen.getByTestId('accordion-Item 3-disabled'))
    expect(screen.queryByText('Body 3')).not.toBeInTheDocument()
  })
  it('should show an enabled item correctly', () => {
    render(<Accordion data={data} name="test" />)
    fireEvent.click(screen.getByTestId('accordion-Item 2-enabled'))
    expect(screen.getByText('Body 2')).not.toHaveStyle('height: 0px')
    expect(screen.queryByTestId('accordion-Item 1-body')).not.toBeInTheDocument()
    expect(screen.getByText('Body 1')).toHaveStyle('height: 0px')
  })
  it('should render edit button if edit is enabled', () => {
    render(
      <Accordion
        name="test"
        data={[
          {
            title: 'Item 3',
            name: 'item3',
            body: () => <>Body 3</>,
            disabled: false,
            canEdit: true,
          },
        ]}
      />,
    )
    expect(screen.getByText('action.edit')).toBeVisible()
  })
  it('if edit is clicked on a tab that is not active, that tab should become active', () => {
    render(
      <Accordion
        data={[
          ...data,
          {
            title: 'Item 3',
            name: 'item3',
            body: () => <>Body 3</>,
            disabled: false,
            canEdit: true,
          },
        ]}
        name="test"
      />,
    )
    expect(screen.getByText('Body 1')).not.toHaveStyle('height: 0px')
    expect(screen.getByText('Body 2')).toHaveStyle('height: 0px')
    expect(screen.getByText('Body 3')).toHaveStyle('height: 0px')
    fireEvent.click(screen.getByText('action.edit'))
    expect(screen.getByText('Body 1')).toHaveStyle('height: 0px')
    expect(screen.getByText('Body 2')).toHaveStyle('height: 0px')
    expect(screen.getByText('Body 3')).not.toHaveStyle('height: 0px')
  })
  it('should display the correct dialog when edit is clicked', () => {
    const mockShowDataInput = jest.fn()

    mockUseTransactionFlow.mockReturnValue({
      prepareDataInput: () => mockShowDataInput,
    })
    render(
      <Accordion
        data={[
          ...data,
          {
            title: 'Item 3',
            name: 'fuses',
            body: () => <>Body 3</>,
            disabled: false,
            canEdit: true,
          },
        ]}
        name="test"
      />,
    )
    fireEvent.click(screen.getByText('action.edit'))
    expect(mockShowDataInput).toHaveBeenCalledWith('burn-fuses-test', { name: 'test' })
  })
})
