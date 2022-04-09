import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Boxes, { BOXES_FOR_BASE_QUERY } from "./Boxes";
import { render } from "utils/test-utils";

describe("Boxes view", () => {
  const mocks = [
    {
      request: {
        query: BOXES_FOR_BASE_QUERY,
        variables: {
          baseId: 1,
        },
      },
      result: {
        data: {
          base: {
            __typename: "Base",
            locations: [
              {
                __typename: "Location",
                boxes: {
                  __typename: "BoxPage",
                  totalCount: 27,
                  elements: [
                    {
                      __typename: "Box",
                      id: "11",
                      state: "Donated",
                      size: "4",
                      product: { __typename: "Product", gender: "Women", name: "Long Dress" },
                      items: 64,
                    },
                    {
                      __typename: "Box",
                      id: "995",
                      state: "Donated",
                      size: "52",
                      product: { __typename: "Product", gender: "Women", name: "Socks" },
                      items: 35,
                    },
                  ],
                },
              },
              {
                __typename: "Location",
                boxes: {
                  __typename: "BoxPage",
                  totalCount: 31,
                  elements: [
                    {
                      __typename: "Box",
                      id: "157",
                      state: "Lost",
                      size: "54",
                      product: { __typename: "Product", gender: "UnisexBaby", name: "Blanket" },
                      items: 40,
                    },
                    {
                      __typename: "Box",
                      id: "174",
                      state: "MarkedForShipment",
                      size: "68",
                      product: {
                        __typename: "Product",
                        gender: "UnisexBaby",
                        name: "Top 2-6 Months ",
                      },
                      items: 16,
                    },
                    {
                      __typename: "Box",
                      id: "291",
                      state: "Lost",
                      size: "118",
                      product: {
                        __typename: "Product",
                        gender: "UnisexKid",
                        name: "Jacket Sleeveless ",
                      },
                      items: 81,
                    },
                  ],
                },
              },
              {
                __typename: "Location",
                boxes: {
                  __typename: "BoxPage",
                  totalCount: 16,
                  elements: [
                    {
                      __typename: "Box",
                      id: "43",
                      state: "InStock",
                      size: "68",
                      product: { __typename: "Product", gender: "Women", name: "Hijab" },
                      items: 4,
                    },
                    {
                      __typename: "Box",
                      id: "137",
                      state: "InStock",
                      size: "68",
                      product: {
                        __typename: "Product",
                        gender: "Boy",
                        name: "Top Boys (18-24 months)",
                      },
                      items: 95,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  ];

  beforeEach(() => {
    render(<Boxes />, { mocks });
  });

  it("renders with an initial 'Loading...'", () => {
    const loadingInfo = screen.getByText("Loading...");
    expect(loadingInfo).toBeInTheDocument();
  });

  it("eventually removes the 'Loading...' and shows the table head", async () => {
    await waitFor(() => {
      const loadingInfo = screen.queryByText("Loading...");
      expect(loadingInfo).toBeNull();
    });
    const heading = await screen.getByText("Product");
    expect(heading).toBeInTheDocument();
  });

  it("tests if global filter is working", async () => {
    await waitFor(() => {
      const loadingInfo = screen.queryByText("Loading...");
      expect(loadingInfo).toBeNull();
    });

    const nonBlanketProduct = screen.queryByRole("gridcell", {
      name: "Top 2-6 Months",
    });
    expect(nonBlanketProduct).toBeInTheDocument();
    // screen.debug();
    const searchField = screen.getByPlaceholderText("Search");
    fireEvent.change(searchField, { target: { value: "Blanket" } });
    await waitFor(() => {
      const nonBlanketProduct = screen.queryByRole("gridcell", {
        name: "Top 2-6 Months",
      });
      expect(nonBlanketProduct).toBeNull();
    });
    const blanketProduct = screen.queryByRole("gridcell", {
      name: "Blanket",
    });
    expect(blanketProduct).toBeInTheDocument();

    //   expect(3).toBe(3)
  });
  it("tests sorting in column headers", async () => {
    await waitFor(() => {
      const loadingInfo = screen.queryByText("Loading...");
      expect(loadingInfo).toBeNull();
    });
    const productheader = screen.getByText("Product");
    // const productheader = screen.queryByRole("columnheader", { name: "Product" });
    console.log("productheader", productheader)
    fireEvent.click(productheader);
    screen.debug();
    const row = screen.getAllByRole("row");
    expect(row[0]).toHaveTextContent("Blanket");
    // expect(row[1]).toHaveTextContent("Top 2-6 Months");
  });
});
