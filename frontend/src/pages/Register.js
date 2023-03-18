import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  StackDivider,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { UserState } from "../Context/UserProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const showPassword = () => {
    setShow(show ? false : true);
  };

  const { domain } = UserState();

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${domain}/api/v1/auth/emailVerification/`,
        {
          userName,
          rollNo,
          course,
          email,
          password,
        }
      );
      console.log(data);
      // navigate("/home");
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      console.log(error);
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   if (localStorage.getItem("token")) navigate("/home");
  // }, []);

  return (
    <div className="Login">
      <Container borderRadius="20px">
        <VStack
          color="white"
          divider={<StackDivider borderStyle="revert" />}
          spacing={2}
        >
          <FormControl>
            <Input
              value={userName}
              type="text"
              placeholder="Enter your userName"
              onChange={(e) => setUserName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <Input
              value={email}
              type="email"
              placeholder="Enter Your Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <Input
              value={rollNo}
              type="text"
              placeholder="Class Roll.No"
              onChange={(e) => setRollNo(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <Input
              value={course}
              type="text"
              placeholder="Course"
              onChange={(e) => setCourse(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <InputGroup>
              <Input
                value={password}
                placeholder="password"
                type={show ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.85rem"
                  size="sm"
                  onClick={showPassword}
                  color={show ? "green" : "black"}
                >
                  Show
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            width="140px"
            colorScheme="green"
            alignSelf="center"
            isLoading={loading}
            spinner={<Spinner size="md" color="white" />}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </VStack>
      </Container>
    </div>
  );
};

export default Register;
