import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { act, renderHook } from "@testing-library/react-hooks";
import { usePaginate } from "./usePaginate";

const GET_PAGE_QUERY = gql`
  query GetPage($skip: Int, $first: Int) {
    page(skip: $skip, first: $first) {
      items {
        id
        name
      }
    }
  }
`;

const generatePageItems = (skip: number, first: number) =>
  [...Array(first)].map((_, i) => ({ id: i + skip, name: `Item ${i + skip}` }));

const generatePage = (skip: number, first: number) => ({
  request: {
    query: GET_PAGE_QUERY,
    variables: {
      skip,
      first,
    },
  },
  newData: () => ({
    data: {
      page: {
        items: generatePageItems(skip, first),
      },
    },
  }),
});

const mocks = [
  generatePage(0, 10),
  generatePage(10, 10),
  generatePage(20, 10),
  generatePage(30, 10),
];

const MockWrapper = ({ children }: { children: any }) => {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  );
};
describe("usePaginate", () => {
  const pageSize = 10;
  const targetKey = "page.items";
  const { result, waitFor, rerender } = renderHook(
    () => usePaginate(GET_PAGE_QUERY, { pageSize, targetKey }),
    { wrapper: MockWrapper }
  );

  const loadPage = async (page: number) => {
    rerender();
    act(() => {
      result.current.loadPage(page);
    });
    await waitFor(() => result.current.loading === false);
    expect(result.current.data).toStrictEqual(
      generatePageItems(page * pageSize, pageSize)
    );
  };
  const fetchMoreFromPage = async (page: number, amount: number) => {
    await loadPage(page);
    await waitFor(() => result.current.loading === false);
    let compareData: any[] = result.current.data;
    const fetchMoreData = async () => {
      await act(async () => {
        await result.current.fetchMore();
      });
      compareData = [
        ...compareData,
        ...generatePageItems(page * pageSize + compareData.length, pageSize),
      ];
      await waitFor(() => result.current.loading === false);
      expect(result.current.data).toStrictEqual(compareData);
    };
    for (let i = 0; i < amount; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await fetchMoreData();
    }
  };

  it("Loads the first page on initial render", async () => {
    rerender();
    await waitFor(() => result.current.loading === false);
    expect(result.current.data).toStrictEqual(generatePageItems(0, 10));
  });
  describe("loadPage", () => {
    it("Loads different pages individually", async () => {
      await loadPage(0);
      await loadPage(1);
      await loadPage(2);
      await loadPage(3);
    });
  });
  describe("fetchMore", () => {
    it("Loads first page, and then fetches more pages and adds to existing data", async () => {
      await fetchMoreFromPage(0, 3);
    });
    it("Loads non-first page, and then more fetches pages and adds to existing data", async () => {
      await fetchMoreFromPage(1, 2);
    });
  });
});
