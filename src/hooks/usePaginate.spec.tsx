import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { render, waitFor } from "@testing-library/react";
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
  result: {
    data: {
      page: {
        items: generatePageItems(skip, first),
      },
    },
  },
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

const MockPageComponent = ({
  query,
  options,
}: {
  query: any;
  options: any;
}) => {
  const { data } = usePaginate(query, options);

  return (
    <>
      {data.map((item: any) => (
        <div data-testid={`item-${item.id}`} key={item.name}>
          {item.name}
        </div>
      ))}
    </>
  );
};

it("Loads single page without errors", async () => {
  const pageSize = 10;
  const body = render(
    <MockPageComponent
      query={GET_PAGE_QUERY}
      options={{
        pageSize,
        targetKey: "page.items",
      }}
    />,
    {
      wrapper: MockWrapper,
    }
  );

  await waitFor(() => new Promise((resolve) => setTimeout(resolve, 100)));

  [...Array(pageSize)].forEach((_, inx) => body.getByTestId(`item-${inx}`));
});

it("Loads individual pages without errors", async () => {});
