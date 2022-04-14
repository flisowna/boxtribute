import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  ListItem,
  Select,
  Stack,
  UnorderedList,
} from "@chakra-ui/react";
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
  const { loading, error, data } = useQuery<OrganisationsAndBasesQuery>(ORGANISATIONS_QUERY);
  const [org, setOrg] = React.useState<Organisation | undefined>(undefined);

  const handleOrganisationSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    
    const selectedOrganisation = event.target.value;
    const filteredOrganisation = data?.organisations?.find(organisation => 
    organisation.id === selectedOrganisation)
    setOrg(filteredOrganisation)
    console.log(filteredOrganisation);
  }
  

  const handleBaseSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBase = event.target.value;
    console.log(selectedBase);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);

  return (
    <>
      {/* to build filter which takes out from the dropdown the source organisation */}
      <FormControl isRequired>
        <FormLabel htmlFor="target organisation">Organisation</FormLabel>
        <Select
          onChange={handleOrganisationSelection}
          id="organisation"
          placeholder="Select organisation"
        >
          {data?.organisations?.map((organisation) => (
            <option value={organisation.id} key={organisation.id}>
              {organisation.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="target organisation">Bases</FormLabel>
        <Select onChange={handleBaseSelection} id="base" placeholder="All">
          {org?.bases?.map((base) => (
            <option value={base.id} key={base.id}>
              {base.name}
            </option>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

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
      <Heading>Transfers</Heading>
      <OrganisationsList />
    </Box>
  );
};

export default Transfers;
