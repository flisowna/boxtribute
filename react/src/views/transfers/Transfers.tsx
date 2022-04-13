import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { Box, Heading, ListItem, UnorderedList } from "@chakra-ui/react";
import { Organisation, OrganisationsAndBasesQuery } from "generated/graphql";




export const ORGANISATIONS_QUERY = gql`
  query OrganisationsAndBases {
    organisations {
      name
      id
      bases {
        id
        name
      }
    }
  }
`;


const OrganisationsList = () => {
  const { loading, error, data } = useQuery<OrganisationsAndBasesQuery>(
    ORGANISATIONS_QUERY,
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data)

  const foo = data?.organisations?.[0]?.name
  return (
      <>
    Test: {foo}
    </>
  )
}
  
  
//   (
//     <UnorderedList>
//       {data?.?.map((name, i) => (
//         <ListItem key={i}>
//           <Link to={`/bases/${baseId}/locations/${location.id}`}>{location.name}</Link>
//         </ListItem>
//       ))}
//     </UnorderedList>
//   );
// };

const Transfers = () => {
    return (
    <Box>

      <Heading>Organisations</Heading>
      <OrganisationsList/>
    </Box>
  );
};


export default Transfers;