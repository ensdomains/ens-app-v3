import { reducer } from './reducer'

describe('reducer', () => {
  it('should not break if resumeFlowWithCheck is called with item', () => {
    const mockPush = jest.fn()
    const action = {
      name: 'resumeFlowWithCheck',
      key: 'key',
      payload: {
        push: mockPush,
      },
    }
    const draft = {
      items: {
        key: {
          resumeLink: 'resumeLink',
          transactions: [{ hash: 'hash', stage: 'complete' }],
        },
      },
    }
    reducer(draft, action)
    expect(mockPush).toHaveBeenCalled()
  })
  it('should break if resumeFlowWithCheck is called wihout item', () => {
    const mockPush = jest.fn()
    const action = {
      name: 'resumeFlowWithCheck',
      key: 'key',
      payload: {
        push: mockPush,
      },
    }
    const draft = {
      items: {
        otherKey: {
          resumeLink: 'resumeLink',
          transactions: [{ hash: 'hash', stage: 'complete' }],
        },
      },
    }
    reducer(draft, action)
    expect(mockPush).not.toHaveBeenCalled()
  })
  it('should not break if resumeFlow is called with item', () => {
    const mockPush = jest.fn()
    const action = {
      name: 'resumeFlow',
      key: 'key',
      payload: {
        push: mockPush,
      },
    }
    const draft = {
      selectedKey: '',
      items: {
        key: {
          intro: true,
          currentFlowStage: '',
        },
      },
    }
    reducer(draft, action)
    expect(draft.selectedKey).toEqual('key')
  })
  it('should break if resumeFlow is called wihout item', () => {
    const mockPush = jest.fn()
    const action = {
      name: 'resumeFlow',
      key: 'key',
      payload: {
        push: mockPush,
      },
    }
    const draft = {
      selectedKey: '',
      items: {
        otherkey: {
          intro: true,
          currentFlowStage: '',
        },
      },
    }
    reducer(draft, action)
    expect(draft.selectedKey).toEqual('')
  })
})
