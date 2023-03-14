import {
  Box,
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { Calendar } from "react-calendar";
import { AttendanceState } from "../Context/AttendanceProvider";
import { UserState } from "../Context/UserProvider";
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
    onOpen();
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
    // console.log("moshi moshi");
    for (const key in attendance) {
      if (attendance[key].Subject === subjectName) {
        if (attendance[key].Status === "P") {
          present.add(attendance[key].date);
        } else if (attendance[key].Status === "A") {
          absent.add(attendance[key].date);
        } else if (attendance[key].Status === "L") {
          leave.add(attendance[key].date);
        }
      }
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

  return (
    <>
      <span onClick={filterData}>{children}</span>
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
          <ModalHeader color="white">
            {subjectName ? subjectName : "Total"}
          </ModalHeader>
          <ModalBody justifyContent="center">
            {subjectName ? (
              <Box display="flex" justifyContent="center">
                <Calendar
                  // onChange={setToday}
                  tileClassName={({ activeStartDate, date, view }) => {
                    if (present.has(`${date}`)) {
                      return "present";
                    } else if (absent.has(`${date}`)) {
                      return "absent";
                    } else if (leave.has(`${date}`)) {
                      return "leave";
                    }
                  }}
                  onChange={handleSelectedDay}
                />
              </Box>
            ) : (
              <></>
            )}
            {subjectName ? (
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
                </ButtonGroup>
              </Box>
            ) : (
              <></>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AttendanceModal;
