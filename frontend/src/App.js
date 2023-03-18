import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister";
import { Box } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import Home from "./pages/Home";
import UserProvider from "./Context/UserProvider";
import DashBoard from "./pages/DashBoard";
import AttendanceProvider from "./Context/AttendanceProvider";
import SelfAttendance from "./pages/SelfAttendance";

function App() {
  return (
    <Box>
      <ChakraProvider>
        <BrowserRouter>
          <UserProvider>
            <AttendanceProvider>
              <Routes>
                <Route exact path="/" element={<LoginRegister />} />
                <Route exact path="/home" element={<Home />} />
                <Route exact path="/dashboard" element={<DashBoard />} />
                <Route
                  exact
                  path="/selfattendance"
                  element={<SelfAttendance />}
                />
              </Routes>
            </AttendanceProvider>
          </UserProvider>
        </BrowserRouter>
      </ChakraProvider>
    </Box>
  );
}

export default App;
