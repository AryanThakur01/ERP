import {
  Box,
  Container,
  GenericAvatarIcon,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { UserState } from "../Context/UserProvider";
import TableElement from "../Components/TableElement";
import Navigation from "../Components/Navigation";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, setUser } = UserState();
  const navigate = useNavigate();
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/");
    } else {
      delete userData.teacher;
      delete userData.password;
      delete userData.createdAt;
      delete userData.updatedAt;
      delete userData.__v;
      setUser(userData);
    }
  }, []);
  return (
    <Box
      overflowX="hidden"
      bgColor="blackAlpha.800"
      minHeight="max(100vh, 500px)"
      display="flex"
      flexDir="column"
      alignItems="center"
      padding="10px"
    >
      <Box
        width={{ base: "100vw", md: "fit-content" }}
        bgColor="whiteAlpha.200"
        paddingInline={{ base: "2px", sm: "20px" }}
        marginBlock={{ md: "50px" }}
        display={{ md: "flex" }}
        alignItems="center"
      >
        <Box height="200px" display="flex" alignItems="center">
          <GenericAvatarIcon />
        </Box>
        <TableContainer
          color="whiteAlpha.800"
          fontSize={{ base: "14px", md: "17px" }}
        >
          <Table variant="unstyled">
            <Tbody>
              {Object.keys(user).map((objectKey) => (
                <TableElement
                  objectKey={objectKey}
                  value={user[objectKey]}
                  key={user[objectKey]}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Navigation />
    </Box>
  );
};

export default Home;
