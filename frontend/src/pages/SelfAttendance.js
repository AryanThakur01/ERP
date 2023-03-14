import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Progress,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Navigation from "../Components/Navigation";
import { UserState } from "../Context/UserProvider";
import axios from "axios";
import AttendanceCard from "../Components/AttendanceCard";
import { useNavigate } from "react-router-dom";
import { AttendanceState } from "../Context/AttendanceProvider";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import LoadingSection from "../Components/Miscellaneous/LoadingSection";

const SelfAttendance = () => {
  const [percentage, setPercentage] = useState(0);
  const [newSubject, setNewSubject] = useState("");
  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAttendance, attendance } = AttendanceState();

  const { domain } = UserState();
  const navigate = useNavigate();

  const toast = useToast();

  const fetchSubjects = async () => {
    const { data } = await axios.get(
      `${domain}/api/v1/studentAttendance/selfsubjects`,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const subjectList = data.subjectList;
    const attendanceData = [];

    for (const subject of subjectList) {
      const response = await axios.get(
        `${domain}/api/v1/studentAttendance/subjectAttendanceData?subjectName=${subject}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      attendanceData.push({ subject: subject, data: response.data });
    }
    // console.log(subjectAttendance);
    // setSubjects(subjectList);
    setSubjectAttendance(attendanceData);
  };

  const fetchAttendance = async () => {
    const { data } = await axios.get(
      `${domain}/api/v1/studentAttendance/self`,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // console.log(data);

    const percentage = (
      (data.Present.length / (data.Absent.length + data.Present.length)) *
      100
    ).toFixed(2);
    setAttendance(data);
    setPercentage(percentage);
    // console.log(data);
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
    const getPageData = async () => {
      setLoading(true);
      await fetchAttendance();
      await fetchSubjects();
      setLoading(false);
    };
    getPageData();

    // eslint-disable-next-line
  }, []);

  const handleAddSubject = async () => {
    if (!newSubject.trim()) {
      toast({
        title: "Subject Name Missing",
        description: "Enter Subject Name",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    setSubjectAttendance([
      ...subjectAttendance,
      { subject: newSubject, data: { Present: [], Absent: [], Leave: [] } },
    ]);
  };

  useEffect(() => {
    fetchSubjects();
    // eslint-disable-next-line
    {
      console.log(subjectAttendance);
    }
  }, [attendance]);

  return (
    <>
      <Box
        minHeight="100vh"
        bgColor="blackAlpha.800"
        overflowX="hidden"
        pt="50px"
      >
        {loading ? (
          <LoadingSection />
        ) : (
          <>
            <Navigation />
            {/* <Menu
        m="20px 10px"
        display="flex"
        justifyContent={{ md: "flex-start", base: "center" }}
      >
        <Button colorScheme="blue" onClick="">
          Add Subject
        </Button>
      </Menu> */}
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                m="20px 10px"
                display="flex"
                justifyContent={{ md: "flex-start", base: "center" }}
                colorScheme="blue"
              >
                Add Subject
              </MenuButton>
              <MenuList
                bgColor="blackAlpha.500"
                border="none"
                backdropFilter="blur(15px)"
              >
                <InputGroup
                  size="md"
                  m="20px 10px"
                  display="flex"
                  justifyContent={{ md: "flex-start", base: "center" }}
                  width={{ md: "500px", base: "88vw" }}
                >
                  <Input
                    pr="4.5rem"
                    placeholder="Enter Subject"
                    color="white"
                    value={newSubject}
                    onChange={(e) => {
                      setNewSubject(e.target.value);
                    }}
                  />
                  <InputRightElement width="70px">
                    <Button
                      colorScheme="blue"
                      h="1.75rem"
                      width="60px"
                      mr="6px"
                      onClick={handleAddSubject}
                    >
                      Add
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </MenuList>
            </Menu>

            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent={{ md: "flex-start", base: "center" }}
            >
              <AttendanceCard key="TOTAL" percentage={percentage} />
              {subjectAttendance.map((attendance) => (
                <AttendanceCard
                  key={attendance.subject}
                  percentage={(
                    (attendance.data.Present.length /
                      (attendance.data.Present.length +
                        attendance.data.Absent.length)) *
                    100
                  ).toFixed(2)}
                  subjectName={attendance.subject}
                  attendanceFunction={fetchAttendance}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default SelfAttendance;
