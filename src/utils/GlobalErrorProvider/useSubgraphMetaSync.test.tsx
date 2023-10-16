describe('useMetaData', () => {
  it.todo('should be implemented')
  // beforeEach(() => {
  //   mockDispatch.mockClear()
  // })

  // it('should not call mockDispatch if there is no global error state', () => {
  //   renderHook(() => useSubgraphMetaSync(makeGlobalErrorState(), mockDispatch), {
  //     wrapper: createWrapper(),
  //   })
  //   expect(mockDispatch).not.toHaveBeenCalled()
  // })

  // it('should not call mockDispatch once meta returns hasIndexingError is false ', () => {
  //   mockClientRequest.mockResolvedValue({
  //     data: {
  //       _meta: { hasIndexingErrors: false },
  //       block: { number: 1 },
  //     },
  //   })
  //   renderHook(() => useSubgraphMetaSync(makeGlobalErrorState(true), mockDispatch), {
  //     wrapper: createWrapper(),
  //   })
  //   expect(mockDispatch).not.toHaveBeenCalled()
  // })

  // it('should call mockDispatch twice if meta returns hasIndexingError is true ', async () => {
  //   mockClientRequest.mockResolvedValue({
  //     _meta: { hasIndexingErrors: true, block: { number: 1 } },
  //   })
  //   renderHook(() => useSubgraphMetaSync(makeGlobalErrorState(true), mockDispatch), {
  //     wrapper: createWrapper(),
  //   })
  //   await waitFor(() => {
  //     expect(mockDispatch).toHaveBeenCalledTimes(2)
  //   })
  //   expect(mockDispatch).toHaveBeenCalledWith({
  //     type: 'SET_META',
  //     payload: {
  //       hasSubgraphError: true,
  //       hasIndexingErrors: true,
  //     },
  //   })
  //   expect(mockDispatch).toHaveBeenCalledWith({
  //     type: 'SET_META',
  //     payload: { timestamp: 1 },
  //   })
  // })

  // it('should call mockDispatch once if force is true ', async () => {
  //   mockClientRequest.mockResolvedValue({
  //     _meta: { hasIndexingErrors: false, block: { number: 1 } },
  //   })
  //   renderHook(() => useSubgraphMetaSync(makeGlobalErrorState(true, true), mockDispatch), {
  //     wrapper: createWrapper(),
  //   })
  //   await waitFor(() => {
  //     expect(mockDispatch).toHaveBeenCalledTimes(1)
  //   })
  //   expect(mockDispatch).toHaveBeenCalledWith({
  //     type: 'SET_META',
  //     payload: { hasIndexingErrors: false },
  //   })
  // })
})
