// TODO: Implement this test properly

// import { disconnect } from "./web3modal";

// jest.mock("../apollo/mutations/ens", () => ({
//   ...jest.requireActual("../apollo/mutations/ens"),
//   setup: jest.fn(),
// }));

// const { setup } = require("@app/apollo/mutations/ens");

// describe("disconnect", () => {
//   it("should clear cached provider if using web3modal", async () => {
//     const mockClearCache = jest.fn();

//     const mockWeb3Modal = {
//       clearCachedProvider: () =>
//         new Promise(() => {
//           mockClearCache();
//           expect(mockClearCache).toBeCalled();
//         }),
//     };

//     disconnect();
//   });

//   it("should clear cached provider before calling setupENS", () => {
//     const mockClearCache = jest.fn();

//     const mockWeb3Modal = {
//       clearCachedProvider: () =>
//         new Promise(() => {
//           mockClearCache();
//           expect(mockClearCache).toBeCalled();
//           expect(setup).toHaveBeenCalledTimes(0);
//         }),
//     };

//     disconnect();
//   });
// });
