// test/helpers.ts

type MockableFunction = (...args: any[]) => any

// use generic constraints to restrict `mockedFunc` to be any type of function
export const asMock = <Func extends MockableFunction>(mockedFunc: Func) =>
  mockedFunc as jest.MockedFunction<typeof mockedFunc>
