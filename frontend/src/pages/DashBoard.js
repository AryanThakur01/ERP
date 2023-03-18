import { Box, Progress } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Navigation from "../Components/Navigation";
import { UserState } from "../Context/UserProvider";
import axios from "axios";
import { AttendanceState } from "../Context/AttendanceProvider";
import AttendanceCard from "../Components/AttendanceCard";
import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const [percentage, setPercentage] = useState(0);
  const [subjectPercent, setSubjectPercent] = useState({});
  const { domain } = UserState();
  const { subject, setSubject, setAttendance, attendance } = AttendanceState();
  const navigate = useNavigate();

  const fetchAttendance = async () => {
    const { data } = await axios.get(
      `${domain}/api/v1/studentAttendance/official`,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setAttendance(data.attendance);
    const attendanceList = data.attendance;
    let subjectList = new Set();
    let pCount = 0;
    let tCount = 0;
    let subjectTotal = {};
    let subjectPresent = {};
    let subjectPercentage = {};

    attendanceList.forEach((element) => {
      if (element.Status === "P") {
        pCount++;
        tCount++;
      } else if (element.Status === "A") {
        tCount++;
      }
      subjectList.add(element.Subject);
      if (element.Status !== "L") {
        subjectTotal[element.Subject] = subjectTotal[element.Subject]
          ? subjectTotal[element.Subject] + 1
          : 1;
        if (element.Status === "P")
          subjectPresent[element.Subject] = subjectPresent[element.Subject]
            ? subjectPresent[element.Subject] + 1
            : 1;

        subjectPercentage[element.Subject] =
          ((subjectPresent[element.Subject]
            ? subjectPresent[element.Subject]
            : 0) *
            100) /
          subjectTotal[element.Subject];
        console.log(subjectPercent);
      }
    });
    setSubjectPercent(subjectPercentage);
    setSubject(subjectList);
    setPercentage(((pCount * 100) / tCount).toFixed(2));
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    fetchAttendance();
  }, []);

  return (
    <Box minHeight="100vh" bgColor="blackAlpha.800" overflowX="hidden">
      <Navigation />
      {/* this is the flex to change */}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent={{ base: "center", md: "flex-start" }}
        mt="70px"
      >
        <AttendanceCard percentage={percentage} />
        {subject ? (
          Array.from(subject).map((e) => (
            <AttendanceCard
              key={e}
              percentage={subjectPercent[e] ? subjectPercent[e].toFixed(2) : ""}
              subjectName={e}
            />
          ))
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default DashBoard;
