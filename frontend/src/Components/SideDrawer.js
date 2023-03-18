import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  GenericAvatarIcon,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { Logout } from "@mui/icons-material";
import React from "react";

import { useNavigate } from "react-router-dom";

const SideDrawer = ({ children }) => {
  const STYLES = {
    height: "48px",
    width: "200px",
    border: "1px",
    backgroundColor: "transparent",
    marginTop: "8px",
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  return (
    <>
      <span onClick={isOpen ? onClose : onOpen}>{children}</span>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bgColor="blackAlpha.800" backdropFilter="blur(8px)" color="whiteAlpha.600">
          <DrawerBody
            pt="50px"
            display="flex"
            flexDir="column"
            alignItems="center"
          >
            <Box>
              <GenericAvatarIcon height="100px" />
            </Box>
            <Button
              style={STYLES}
              _hover={{ color: "white" }}
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Dashboard
            </Button>
            <Button
              style={STYLES}
              _hover={{ color: "white" }}
              onClick={() => {
                navigate("/selfattendance");
              }}
            >
              Self Attendance
            </Button>
            {/* <Button style={STYLES} _hover={{ color: "white" }}>
              FeedBack
            </Button> */}
            <DrawerFooter>
              <Button
                style={STYLES}
                _hover={{ color: "white" }}
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  navigate("/");
                }}
              >
                <Icon as={Logout} mt="-3px" />
                <Box paddingInline="15px">LogOut</Box>
              </Button>
            </DrawerFooter>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
