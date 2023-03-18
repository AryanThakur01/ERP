import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Calendar } from "react-calendar";
import { AttendanceState } from "../Context/AttendanceProvider";
import { UserState } from "../Context/UserProvider";
import { DeleteOutline, Close, AttachEmail } from "@mui/icons-material";
import "./Calendar.css";

const AttendanceModal = ({ children, subjectName, attendanceFunction }) => {
  const { isOpen, onOpen, onClose } = useDisclosure([]);
  const [day, setDay] = useState(new Date());
  const [present, setPresent] = useState(new Set());
  const [absent, setAbsent] = useState(new Set());
  const [leave, setLeave] = useState(new Set());
  const [dayAttendance, setDayAttendance] = useState("");
  const { domain } = UserState();
  const { attendance } = AttendanceState();
  const { user } = UserState();
  const attendanceOptions = ["P", "A", "L"];
  const toast = useToast();
  const writeSelfAttendance = async (date) => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      await axios.post(
        `${domain}/api/v1/studentAttendance/selfAttendance`,
        {
          data: {
            subject: subjectName,
            attendance: dayAttendance,
          },
          date,
        },
        config
      );
      attendanceFunction();
      toast({
        title: "Successfully Updated",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: error.message,
        description: "Error Updating Your Data",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const filterData = async () => {
    // console.log(localStorage.getItem("user").search("classRoll") < 0);
    const present = new Set();
    const absent = new Set();
    const leave = new Set();
    if (attendance.Present || attendance.Absent || attendance.Leave) {
      attendance.Present.forEach((eachAttendance) => {
        if (eachAttendance.Subject === subjectName)
          present.add(eachAttendance.date);
      });
      attendance.Absent.forEach((eachAttendance) => {
        if (eachAttendance.Subject === subjectName)
          absent.add(eachAttendance.date);
      });
      attendance.Leave.forEach((eachAttendance) => {
        if (eachAttendance.Subject === subjectName)
          leave.add(eachAttendance.date);
      });
      // console.log({ present, absent, leave });
      setPresent(present);
      setAbsent(absent);
      setLeave(leave);
      return;
    }
    for (const key in attendance) {
      if (attendance[key].Subject === subjectName) {
        if (attendance[key].Status === "P") {
          let p = new Date(attendance[key].date);
          present.add(p.toDateString());
        } else if (attendance[key].Status === "A") {
          let a = new Date(attendance[key].date);
          absent.add(a.toDateString());
        } else if (attendance[key].Status === "L") {
          let l = new Date(attendance[key].date);
          leave.add(l.toDateString());
        }
      }
      // console.log(leave);
      setPresent(present);
      setAbsent(absent);
      setLeave(leave);
    }
  };

  const handleUpdateAttendance = async (event) => {
    if (!event.target.value) {
      writeSelfAttendance(
        `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`
      );
      return;
    }
    setDayAttendance(event.target.value);
  };

  const handleSelectedDay = async (date) => {
    setDay(date);
    if (present.has(date.toString())) {
      setDayAttendance("P");
    } else if (absent.has(date.toString())) {
      setDayAttendance("A");
    } else if (leave.has(date.toString())) {
      setDayAttendance("L");
    } else {
      setDayAttendance("");
    }
  };

  const DeleteSubject = async () => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const res = await axios.delete(
        `${domain}/api/v1/studentAttendance/removeSubject?subject=${subjectName}`,
        config
      );
      onClose();
      attendanceFunction();
    } catch (error) {
      toast({
        title: error.message,
        description: "Unable to delete the subject",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };
  const DeleteAttendance = async () => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const res = await axios.delete(
        `${domain}/api/v1/studentAttendance/deleteSelfAttendance?date=${day.toDateString()}`,
        config
      );
      // console.log(day, attendance);
      attendanceFunction();
      toast({
        title: "Successfully Updated",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: error.message,
        description: "Unable to delete the subject",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    filterData();
  }, [attendance]);

  return (
    <>
      <span
        onClick={() => {
          onOpen();
          filterData();
        }}
      >
        {children}
      </span>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        // size={"full"}
        scrollBehavior="outside"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent
          display="flex"
          bgColor="blackAlpha.800"
          backdropFilter="blur(5px)"
        >
          <ModalHeader
            color="white"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>{subjectName ? subjectName : "Total"}</Box>
            <Box>
              <IconButton
                color="red.300"
                variant="outline"
                border="none"
                _hover={{
                  backgroundColor: "blackAlpha.300",
                  cursor: "pointer",
                }}
                size="sm"
                as={Close}
                onClick={onClose}
              />
            </Box>
          </ModalHeader>
          <ModalBody justifyContent="center">
            {subjectName ? (
              <Box display="flex" justifyContent="center">
                <Calendar
                  // onChange={setToday}
                  tileClassName={({ activeStartDate, date, view }) => {
                    const d = date.toDateString();
                    if (present.has(`${d}`)) {
                      return "present";
                    } else if (absent.has(`${d}`)) {
                      return "absent";
                    } else if (leave.has(`${d}`)) {
                      return "leave";
                    }
                  }}
                  onChange={handleSelectedDay}
                />
              </Box>
            ) : (
              <></>
            )}
            {!attendance[0] && subjectName ? (
              <Box
                padding="20px 25px"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="space-evenly"
              >
                <Box
                  padding="5px"
                  borderRadius="5px"
                  variant="outline"
                  border="1px solid white"
                  width="100px"
                  textAlign="center"
                >
                  {day.getDate()}/{day.getMonth() + 1}/{day.getFullYear()}
                </Box>
                <ButtonGroup size="sm" variant="outline">
                  {attendanceOptions.map((e) => (
                    <Button
                      key={e}
                      variant="ghost"
                      colorScheme="purple"
                      value={e}
                      onClick={handleUpdateAttendance}
                      borderBottom={
                        e === dayAttendance ? "2px solid white" : ""
                      }
                      _hover={{
                        borderBottom: "2px solid white",
                        bgColor: "transparent",
                      }}
                    >
                      {e}
                    </Button>
                  ))}

                  <Button
                    variant="ghost"
                    colorScheme="purple"
                    onClick={handleUpdateAttendance}
                    _hover={{
                      borderBottom: "2px solid white",
                      bgColor: "transparent",
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    border="none"
                    colorScheme="purple"
                    onClick={DeleteAttendance}
                    color="red.400"
                    _hover={{
                      bgColor: "transparent",
                      color: "red.600",
                    }}
                    paddingInline="0"
                  >
                    <Icon as={DeleteOutline} />
                  </Button>
                </ButtonGroup>
              </Box>
            ) : (
              <></>
            )}
            <Box px="25px" my="10px">
              <Box color="white">
                TOTAL CLASSES: {present.size + absent.size + leave.size}
              </Box>
              <Box color="green.500">PRESENT: {present.size}</Box>
              <Box color="red.500">ABSENT: {absent.size}</Box>
              <Box color="orange.500">LEAVE: {leave.size}</Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Box>
              {!attendance[0] && subjectName ? (
                <Button colorScheme="red" mr={3} onClick={DeleteSubject}>
                  Remove
                </Button>
              ) : (
                <></>
              )}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AttendanceModal;
