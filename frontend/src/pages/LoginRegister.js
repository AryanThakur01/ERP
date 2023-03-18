import {
  Box,
  Divider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React from "react";
import Login from "./Login";
import Register from "./Register";
import "./LoginRegister.css";

const LoginRegister = () => {
  return (
    <div className="loginRegister">
      <Box display="flex" justifyContent="center">
        <Tabs
          variant="soft-rounded"
          colorScheme="green"
          width="fit-content"
          bgColor="blackAlpha.600"
          padding={{ base: "20px 5px", sm: "20px" }}
          backdropFilter="blur(20px)"
          borderRadius="20px"
        >
          <TabList pb="10px" marginInlineStart="10px">
            <Tab>Login</Tab>
            <Tab>Register</Tab>
          </TabList>
          <Divider />
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </div>
  );
};

export default LoginRegister;
