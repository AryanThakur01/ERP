import {
  Box,
  Button,
  IconButton,
  Image,
} from "@chakra-ui/react";
import React from "react";
import home from "./logo/home.png";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import SideDrawer from "./SideDrawer";

const Navigation = () => {
  const navigate = useNavigate();
  return (
    <Box
      position="fixed"
      borderRadius="8px"
      padding="2px 5px"
      bgColor="blackAlpha.400"
      backdropFilter="blur(8px)"
      top="4px"
      width={{ base: "100%" }}
      display="flex"
      justifyContent="space-between"
      zIndex={9999}
    >
      <SideDrawer>
        <IconButton
          variant="outline"
          borderColor="purple"
          _hover={{ backgroundColor: "blackAlpha.300" }}
          icon={<HamburgerIcon color="white" />}
        />
      </SideDrawer>
      <Button
        paddingInline="3px"
        variant="outline"
        borderColor="purple"
        _hover={{ backgroundColor: "blackAlpha.300" }}
        mx="2px"
        onClick={() => navigate("/home")}
      >
        <Image filter="invert(100%)" src={home} height="20px" />
      </Button>
    </Box>
  );
};

export default Navigation;
