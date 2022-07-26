describe('valideResolver', () => {
  it.each`
    a     | b     | result
    ${2}  | ${3}  | ${5}
    ${20} | ${30} | ${50}
    ${-2} | ${-3} | ${-5}
  `('should return $result when $a and $b are used', ({ a, b, result }) => {
    expect(add(a, b)).toEqual(result)
  })
})

describe('EditResolverForm', () => {
  it.todo('should allow user to update if the have chosen to use the latest resolver')
  it.todo(
    'should NOT allow the user to update if they have chosen a custom resolver and have not provided a valid address',
  )
  it.todo(
    'should allow the user to update if they have chosen a custom resolver and HAVE provided a valid address',
  )
  it.todo('should not allow the user to use latest resolver if they already have it set')
  it.todo('if custom address is equal to currently set resolver, should not allow udpate')
})
