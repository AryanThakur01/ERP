import React, { createContext, useContext, useState } from "react";

const AttendanceContext = createContext();

const AttendanceProvider = ({ children }) => {
  const [subject, setSubject] = useState(new Set());
  const [attendance, setAttendance] = useState([]);

  return (
    <AttendanceContext.Provider
      value={{ subject, setSubject, setAttendance, attendance }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const AttendanceState = () => {
  return useContext(AttendanceContext);
};

export default AttendanceProvider;
