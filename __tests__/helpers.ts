// test/helpers.ts

type MockableFunction = (...args: any[]) => any;

// use generic constraints to restrict `mockedFunc` to be any type of function
export const asMock = (mockedFunc: MockableFunction) =>
  jest.fn() as jest.MockedFunction<typeof mockedFunc>;
