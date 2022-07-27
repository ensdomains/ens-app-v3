import { cleanup, render } from '@app/test-utils'
import { AddRecordButton } from './AddRecordButton'

describe('AddRecordButton', () => {
  beforeEach(() => {})

  afterEach(() => {
    cleanup()
  })

  it('should render', async () => {
    render(<AddRecordButton />)
  })
})
