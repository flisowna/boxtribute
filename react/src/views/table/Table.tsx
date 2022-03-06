import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Box, Heading, ListItem, UnorderedList } from "@chakra-ui/react";
import { useTable } from 'react-table'

const LOCATION_QUERY = gql`
query Location($locationId: ID!) {
  location(id: $locationId) {
    id
    name
    isShop
    boxState
    boxes {
      totalCount
      elements {
        product {
          name
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


const Table = () => {

    const locationId = 1

      const { loading, error, data } = useQuery(LOCATION_QUERY, {
    variables: {
      locationId,
    },
  });


    // const data = React.useMemo(
    //     () => [
    //       {
    //         col1: 'Hello',
    //         col2: 'World',
    //       },
    //       {
    //         col1: 'react-table',
    //         col2: 'rocks',
    //       },
    //       {
    //         col1: 'whatever',
    //         col2: 'you want',
    //       },
    //     ],
    //     []
    //   )
    
      const columns = React.useMemo(
        () => [
          {
            Header: 'Column 1',
            accessor: 'col1', // accessor is the "key" in the data
          },
          {
            Header: 'Column 2',
            accessor: 'col2',
          },
        ],
        []
      )
    
    //   const {
    //     getTableProps,
    //     getTableBodyProps,
    //     headerGroups,
    //     rows,
    //     prepareRow,
    //   } = useTable({ columns, data })
    console.log(data)
      return (
          
        // <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        //   <thead>
        //     {headerGroups.map(headerGroup => (
        //       <tr {...headerGroup.getHeaderGroupProps()}>
        //         {headerGroup.headers.map(column => (
        //           <th
        //             {...column.getHeaderProps()}
        //             style={{
        //               borderBottom: 'solid 3px red',
        //               background: 'aliceblue',
        //               color: 'black',
        //               fontWeight: 'bold',
        //             }}
        //           >
        //             {column.render('Header')}
        //           </th>
        //         ))}
        //       </tr>
        //     ))}
        //   </thead>
        //   <tbody {...getTableBodyProps()}>
        //     {rows.map(row => {
        //       prepareRow(row)
        //       return (
        //         <tr {...row.getRowProps()}>
        //           {row.cells.map(cell => {
        //             return (
        //               <td
        //                 {...cell.getCellProps()}
        //                 style={{
        //                   padding: '10px',
        //                   border: 'solid 1px gray',
        //                   background: 'papayawhip',
        //                 }}
        //               >
        //                 {cell.render('Cell')}
        //               </td>
        //             )
        //           })}
        //         </tr>
        //       )
        //     })}
        //   </tbody>
        // </table>
      <>hallo</>
        )
};

export default Table;