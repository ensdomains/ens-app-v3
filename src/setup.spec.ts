/* eslint-disable import/first */
import { connect as _connect } from "@app/api/web3modal";
import { setup as _setup } from "@app/apollo/mutations/ens";
import {
  accountsReactive as _accountsReactive,
  globalErrorReactive as _globalErrorReactive,
  isAppReadyReactive as _isAppReadyReactive,
  networkIdReactive as _networkIdReactive,
  networkReactive as _networkReactive,
} from "@app/apollo/reactiveVars";
import defaultSetup, {
  getProvider,
  isSupportedNetwork,
  setWeb3Provider,
} from "@app/setup";
import {
  getNetwork as _getNetwork,
  getNetworkId as _getNetworkId,
} from "@ensdomains/ui";

jest.doMock("@app/api/web3modal", () => ({
  connect: jest.fn(),
}));

jest.doMock("@app/apollo/mutations/ens", () => ({
  setup: jest.fn(),
}));

const setup = jest.fn() as jest.MockedFunction<typeof _setup>;

const connect = jest.fn() as jest.MockedFunction<typeof _connect>;

jest.mock("@app/apollo/reactiveVars", () => ({
  ...jest.requireActual("@app/apollo/reactiveVars"),
  networkIdReactive: jest.fn(),
  networkReactive: jest.fn(),
  accountsReactive: jest.fn(),
  globalErrorReactive: jest.fn(),
  isAppReadyReactive: jest.fn(),
}));

const networkIdReactive = jest.fn() as Partial<
  typeof _networkIdReactive
> as jest.MockedFunction<typeof _networkIdReactive>;
const networkReactive = jest.fn() as Partial<
  typeof _networkReactive
> as jest.MockedFunction<typeof _networkReactive>;
const accountsReactive = jest.fn() as Partial<
  typeof _accountsReactive
> as jest.MockedFunction<typeof _accountsReactive>;
const globalErrorReactive = jest.fn() as Partial<
  typeof _globalErrorReactive
> as jest.MockedFunction<typeof _globalErrorReactive>;
const isAppReadyReactive = jest.fn() as Partial<
  typeof _isAppReadyReactive
> as jest.MockedFunction<typeof _isAppReadyReactive>;

jest.mock("@ensdomains/ui", () => ({
  ...jest.requireActual("@ensdomains/ui"),
  getNetworkId: jest.fn(),
  getNetwork: jest.fn(),
}));

const getNetworkId = _getNetworkId as jest.MockedFunction<typeof _getNetworkId>;
const getNetwork = _getNetwork as jest.MockedFunction<typeof _getNetwork>;

describe("getProvider", () => {
  it.only("should return readOnly provider if connect() fails", async () => {
    connect.mockImplementation(() =>
      Promise.reject(new Error("There was an error while connecting"))
    );
    setup.mockReturnValue(
      Promise.resolve({
        ens: undefined,
        providerObject: undefined,
        registrar: undefined,
      })
    );
    const provider = await getProvider(false);
    console.log(provider);
    expect(provider.readOnlyProvider).toBeTruthy();
  });

  describe("local blockchain", () => {
    let originalReactAppStage: any;
    let originalReactAppEnsAddress: any;
    let originalReactAppLabels: any;
    beforeAll(() => {
      originalReactAppStage = process.env.REACT_APP_STAGE;
      originalReactAppEnsAddress = process.env.REACT_APP_ENS_ADDRESS;
      originalReactAppLabels = process.env.REACT_APP_LABELS;
      process.env.REACT_APP_STAGE = "local";
      process.env.REACT_APP_ENS_ADDRESS = "0xaddress";
      process.env.REACT_APP_LABELS = "{}";
    });
    afterAll(() => {
      process.env.REACT_APP_STAGE = originalReactAppStage;
      process.env.REACT_APP_ENS_ADDRESS = originalReactAppEnsAddress;
      process.env.REACT_APP_LABELS = originalReactAppLabels;
    });

    it("should return provider when using local blockchain", async () => {
      setup.mockImplementation(() =>
        Promise.resolve({
          ens: undefined,
          registrar: undefined,
          providerObject: { localProvider: true },
        })
      );
      const provider = await getProvider(false);
      expect(provider.localProvider);
    });
  });

  describe("web3 cached provider", () => {
    afterAll(() => {
      window.localStorage.clear();
    });
    it("should call connect if there is a cached provider", async () => {
      expect.assertions(1);
      window.localStorage.setItem("WEB3_CONNECT_CACHED_PROVIDER", "injected");
      connect.mockImplementation(() =>
        Promise.resolve(expect(true).toBeTruthy())
      );
      getProvider();
    });
  });

  describe("no cached provider", () => {
    it("should call setup", async () => {
      setup.mockImplementation(() =>
        Promise.resolve({
          ens: undefined,
          registrar: undefined,
          providerObject: {},
        })
      );
      await getProvider(false);
      expect(setup).toHaveBeenCalled();
    }, 10000);
  });

  describe("reconnect == true", () => {
    it("should call connect if reconnect == true", async () => {
      connect.mockImplementation(() => Promise.resolve(1));
      const provider = await getProvider(true);
      expect(provider).toEqual(1);
    });
  });
});

describe("setWeb3Provider", () => {
  it("should update network id when network id changes", async () => {
    expect.assertions(1);
    getNetworkId.mockImplementation(() => Promise.resolve("2"));
    getNetwork.mockImplementation(() => Promise.resolve("Main"));
    const mockProvider = {
      on: (event: any, callback: any) => {
        const cb = async () => {
          try {
            await callback("1");
            expect(networkIdReactive).toHaveBeenCalled();
          } catch (e) {
            console.error(e);
          }
        };
        if (event === "chainChanged") {
          cb();
        }
      },
      removeAllListeners: () => null,
    };
    await setWeb3Provider(mockProvider);
  });
  it("should update accounts when accounts change", async () => {
    expect.assertions(1);
    getNetworkId.mockImplementation(() => Promise.resolve("2"));
    getNetwork.mockImplementation(() => Promise.resolve("Main"));
    const mockProvider = {
      on: (event: any, callback: any) => {
        const cb = async () => {
          try {
            await callback("1");
            expect(accountsReactive).toHaveBeenCalled();
          } catch (e) {
            console.error(e);
          }
        };
        if (event === "accountsChanged") {
          cb();
        }
      },
      removeAllListeners: () => null,
    };
    await setWeb3Provider(mockProvider);
  });
  it("should remove listeners on the provider if they already exist", async () => {
    expect.assertions(1);
    getNetworkId.mockImplementation(() => Promise.resolve(2));
    getNetwork.mockImplementation(() => Promise.resolve("Main"));
    const mockRemoveAllListeners = jest.fn();
    const mockProvider = {
      on: () => {},
      removeAllListeners: mockRemoveAllListeners,
    };
    await setWeb3Provider(mockProvider);
    expect(mockRemoveAllListeners).toHaveBeenCalled();
  });
  it("should update network when network changes", async () => {
    expect.assertions(1);
    getNetworkId.mockImplementation(() => Promise.resolve(2));
    getNetwork.mockImplementation(() => Promise.resolve("Main"));
    const mockProvider = {
      on: (event: any, callback: any) => {
        const cb = async () => {
          try {
            await callback("1");
            expect(networkReactive).toHaveBeenCalled();
          } catch (e) {
            console.error(e);
          }
        };
        if (event === "chainChanged") {
          cb();
        }
      },
      removeAllListeners: () => null,
    };
    await setWeb3Provider(mockProvider);
  });
  it("should set global error if chain is changed to an unsupported network", async () => {
    expect.assertions(2);
    getNetworkId.mockImplementation(() => Promise.resolve(2));
    getNetwork.mockImplementation(() => Promise.resolve("Main"));
    const mockProvider = {
      on: (event: any, callback: any) => {
        const cb = async () => {
          try {
            await callback(1314);
            expect(globalErrorReactive).toHaveBeenCalled();
            expect(networkReactive).not.toHaveBeenCalled();
          } catch (e) {
            console.error(e);
          }
        };
        if (event === "chainChanged") {
          cb();
        }
      },
      removeAllListeners: () => null,
    };
    await setWeb3Provider(mockProvider);
  });
});

describe("isSupportedNetwork", () => {
  it("should return true if network is supported", () => {
    expect(isSupportedNetwork(3)).toBeTruthy();
  });
  it("should return false if network is not supported", () => {
    expect(isSupportedNetwork(22222)).toBeFalsy();
  });
});

describe("setup", () => {
  let originalReactAppStage: any;
  let originalReactAppEnsAddress: any;
  let originalReactAppLabels: any;
  beforeAll(() => {
    originalReactAppStage = process.env.REACT_APP_STAGE;
    originalReactAppEnsAddress = process.env.REACT_APP_ENS_ADDRESS;
    originalReactAppLabels = process.env.REACT_APP_LABELS;
    process.env.REACT_APP_STAGE = "local";
    process.env.REACT_APP_ENS_ADDRESS = "0xaddress";
    process.env.REACT_APP_LABELS = "{}";
  });
  afterAll(() => {
    process.env.REACT_APP_STAGE = originalReactAppStage;
    process.env.REACT_APP_ENS_ADDRESS = originalReactAppEnsAddress;
    process.env.REACT_APP_LABELS = originalReactAppLabels;
  });
  it("should set global error if network is unsupported", async () => {
    setup.mockImplementation(() =>
      Promise.resolve({
        ens: undefined,
        registrar: undefined,
        providerObject: { localProvider: true },
      })
    );
    await getProvider(false);
    getNetworkId.mockImplementation(() => Promise.resolve(222));
    await defaultSetup(false);
    expect(globalErrorReactive).toHaveBeenCalled();
  });

  it("should set global error if connect throws unsupported network error", async () => {
    jest.clearAllMocks();
    process.env.REACT_APP_STAGE = "notlocal";
    connect.mockImplementation(() =>
      Promise.reject(new Error("Unsupported network 124"))
    );
    expect(globalErrorReactive).not.toHaveBeenCalled();
    await getProvider(true);
    expect(globalErrorReactive).toHaveBeenCalled();
  });

  it("should allow setup to continue if network is supported", async () => {
    const mockProvider = {
      on: () => {},
      removeAllListeners: () => null,
    };
    getNetworkId.mockImplementation(() => Promise.resolve(1));
    getNetwork.mockImplementation(() => Promise.resolve("Main"));
    setup.mockImplementation(() =>
      Promise.resolve({
        ens: undefined,
        registrar: undefined,
        providerObject: mockProvider,
      })
    );
    await getProvider(false);
    getNetworkId.mockImplementation(() => Promise.resolve(1));
    await defaultSetup(false);
    expect(isAppReadyReactive).toHaveBeenCalled();
  });
});
