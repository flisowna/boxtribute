import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Box, Heading, ListItem, UnorderedList } from "@chakra-ui/react";
import { Column, useTable, useSortBy } from "react-table";
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'

const BASE_QUERY = gql`
  query Base($baseId: ID!) {
    base(id: $baseId) {
      locations {
        id
        name
        isShop
        boxState
        boxes {
          totalCount
          elements {
            id
            product {
              gender
              name
              sizes
              category {
                name
              }
              price
            }
            items
          }
        }
      }
    }
  }
`;

//

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {JSON.stringify(error)}</div>;
//   if (data.location == null) return <Box>No location found</Box>;

//   return (
//     <Box>
//       <Heading>
//         Location '{data.location.name}' ({data.location.id})
//       </Heading>
//       <Box>
//         <Heading as="h3">{data?.location?.boxes.length} Boxes in this location</Heading>
//         <UnorderedList>
//           {data?.location?.boxes.elements.map((box) => (
//             <ListItem>
//               {box.id} - {box.product.name}
//             </ListItem>
//           ))}
//         </UnorderedList>
//       </Box>
//     </Box>
//   );
type ProductRow = {
  name: string;
  id: number;
  gender: string;
  sizes: string;
  items: number;
};

type UnterTableProps = {
  tableData: ProductRow[];
};

const UnterTable = (props: UnterTableProps) => {
  const columns: Column<ProductRow>[] = React.useMemo(
    () => [
      {
        Header: "Product",
        accessor: "name", // accessor is the "key" in the data
      },
      {
        Header: "Box ID",
        accessor: "id",
      },
      {
        Header: "Gender",
        accessor: "gender",
      },
      {
        Header: "Size",
        accessor: "sizes",
      },
      {
        Header: "Items",
        accessor: "items",
      },
    ],
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: props.tableData,
  }, useSortBy);

  return (
    <Table {...getTableProps()} style={{ border: "solid 1px blue" }}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render("Header")}
                <chakra.span pl='4'>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <TriangleDownIcon aria-label='sorted descending' />
                    ) : (
                      <TriangleUpIcon aria-label='sorted ascending' />
                    )
                  ) : null}
                </chakra.span>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <Td
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </Td>
                );
              })}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

const DataTable = () => {
  const baseId = 1;

  const {
    loading,
    error,
    data: data2,
  } = useQuery(BASE_QUERY, {
    variables: {
      baseId,
    },
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  const tableData = data2?.base.locations.flatMap((location) =>
    location.boxes.elements.map((element) => ({
      name: element.product.name,
      id: element.id,
      sizes: element.product.sizes,
      gender: element.product.gender,
      items: element.items,
    })),
  );

  return <UnterTable tableData={tableData} />;
};

export default DataTable;
