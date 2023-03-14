import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  List,
  ListIcon,
  ListItem,
  ScaleFade,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import AttendanceModal from "./AttendanceModal";

const AttendanceCard = ({ percentage, subjectName, attendanceFunction }) => {
  const { isOpen, onToggle } = useDisclosure();
  useEffect(() => {
    onToggle();
  }, []);

  return (
    <ScaleFade initialScale={0.7} in={isOpen}>
      <Box
        pb="20px"
        paddingInline="10px"
        display="flex"
        alignItems="center"
        flexWrap="wrap"
      >
        <AttendanceModal
          subjectName={subjectName}
          attendanceFunction={attendanceFunction}
        >
          <Box
            backgroundColor="blackAlpha.400"
            width="fit-content"
            padding="20px"
            cursor="pointer"
            transition="all 0.3s ease-out"
            _hover={{ boxShadow: "0px 10px 10px black" }}
          >
            <Box textAlign="center" color="white">
              {subjectName ? subjectName : "Total"}
            </Box>
            <Box display="flex">
              <CircularProgress
                value={percentage}
                color={
                  percentage > 75
                    ? "#07c107"
                    : percentage > 50
                    ? "#ff6000"
                    : "red"
                }
                opacity={0.8}
                thickness="15px"
                size="110px"
                trackColor="whiteAlpha.400"
                textColor="white"
              >
                <CircularProgressLabel fontSize="16px">
                  {isNaN(percentage) ? 0 : percentage}%
                </CircularProgressLabel>
              </CircularProgress>
              <Box
                display="flex"
                flexDir="column"
                justifyContent="center"
                color="white"
                padding="20px"
              >
                <List>
                  <ListItem display="flex" alignItems="center">
                    <ListIcon
                      as={CircleIcon}
                      height="15px"
                      mt={"-4px"}
                      color={
                        percentage > 75
                          ? "#07c107"
                          : percentage > 50
                          ? "#ff6000"
                          : "red"
                      }
                    />
                    Present
                  </ListItem>
                  <ListItem display="flex" alignItems="center">
                    <ListIcon
                      as={CircleIcon}
                      height="15px"
                      mt={"-4px"}
                      color="whiteAlpha.400"
                    />
                    Absent
                  </ListItem>
                </List>
              </Box>
            </Box>
          </Box>
        </AttendanceModal>
      </Box>
    </ScaleFade>
  );
};

export default AttendanceCard;
